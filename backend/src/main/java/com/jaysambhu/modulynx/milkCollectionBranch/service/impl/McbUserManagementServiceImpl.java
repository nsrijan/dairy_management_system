package com.jaysambhu.modulynx.milkCollectionBranch.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.context.CompanyContext;
import com.jaysambhu.modulynx.core.tenant.service.TenantUserService;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import com.jaysambhu.modulynx.core.user.dto.UserRegistrationDto;
import com.jaysambhu.modulynx.core.user.model.User;
import com.jaysambhu.modulynx.core.user.repository.UserRepository;
import com.jaysambhu.modulynx.milkCollectionBranch.model.MilkCollectionBranch;
import com.jaysambhu.modulynx.milkCollectionBranch.repository.MilkCollectionBranchRepository;
import com.jaysambhu.modulynx.milkCollectionBranch.service.McbUserManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of McbUserManagementService for managing MCB-related users
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class McbUserManagementServiceImpl implements McbUserManagementService {

    private final MilkCollectionBranchRepository mcbRepository;
    private final UserRepository userRepository;
    private final TenantUserService tenantUserService;

    @Override
    @Transactional
    public UserDto createMcbManager(Long mcbId, UserRegistrationDto userRegistrationDto) {
        Long companyId = validateAndGetCompanyId();

        // Validate MCB exists and belongs to company
        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        // Create the user
        UserDto createdUser = tenantUserService.createUser(userRegistrationDto);

        // Note: Role assignment will be handled by the calling service
        // after MCB creation is complete

        log.info("Created MCB manager {} for MCB {}", createdUser.getUsername(), mcbId);
        return createdUser;
    }

    @Override
    @Transactional
    public UserDto assignMcbManager(Long mcbId, Long userId) {
        Long companyId = validateAndGetCompanyId();

        // Validate MCB exists and belongs to company
        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        // Validate user exists and belongs to company
        User user = userRepository.findByIdAndCompany_Id(userId, companyId)
                .orElseThrow(() -> new BadRequestException("User not found or not in company"));

        // Check if user can be assigned as manager
        if (!canAssignAsManager(userId)) {
            throw new BadRequestException("User cannot be assigned as MCB manager");
        }

        // Assign user as manager
        mcb.setManager(user);
        mcbRepository.save(mcb);

        log.info("Assigned user {} as manager for MCB {}", user.getUsername(), mcbId);
        return convertToUserDto(user);
    }

    @Override
    @Transactional
    public void removeMcbManager(Long mcbId) {
        Long companyId = validateAndGetCompanyId();

        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        if (mcb.getManager() != null) {
            String managerUsername = mcb.getManager().getUsername();
            mcb.setManager(null);
            mcbRepository.save(mcb);
            log.info("Removed manager {} from MCB {}", managerUsername, mcbId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getMcbManager(Long mcbId) {
        Long companyId = validateAndGetCompanyId();

        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        if (mcb.getManager() == null) {
            return null;
        }

        return convertToUserDto(mcb.getManager());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getEligibleMcbManagers() {
        Long companyId = validateAndGetCompanyId();

        // Get all users in the company who can be MCB managers
        List<User> eligibleUsers = userRepository.findByCompany_Id(companyId);

        return eligibleUsers.stream()
                .filter(user -> canAssignAsManager(user.getId()))
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getEligibleMcbManagers(Pageable pageable) {
        List<UserDto> eligibleUsers = getEligibleMcbManagers();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), eligibleUsers.size());

        List<UserDto> pageContent = eligibleUsers.subList(start, end);
        return new PageImpl<>(pageContent, pageable, eligibleUsers.size());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto findUserByUsername(String username) {
        Long companyId = validateAndGetCompanyId();

        Optional<User> user = userRepository.findByUsernameAndCompany_Id(username, companyId);
        return user.map(this::convertToUserDto).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canAssignAsManager(Long userId) {
        Long companyId = validateAndGetCompanyId();

        // Check if user exists in company
        Optional<User> user = userRepository.findByIdAndCompany_Id(userId, companyId);
        if (user.isEmpty()) {
            return false;
        }

        // Add additional checks based on your business logic
        // For example, check if user has appropriate role, is active, etc.
        return user.get().isActive();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getMcbsMangedByUser(Long userId) {
        Long companyId = validateAndGetCompanyId();

        List<MilkCollectionBranch> mcbs = mcbRepository.findByManager_IdAndCompany_Id(userId, companyId);
        return mcbs.stream()
                .map(MilkCollectionBranch::getId)
                .collect(Collectors.toList());
    }

    private Long validateAndGetCompanyId() {
        Long companyId = CompanyContext.get();
        if (companyId == null) {
            log.error("No company context found");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Company context required for MCB user operations");
        }
        return companyId;
    }

    private UserDto convertToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setActive(user.isActive());
        dto.setPhone(user.getPhone());
        // Add other fields as needed
        return dto;
    }
}