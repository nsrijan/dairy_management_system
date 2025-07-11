package com.jaysambhu.modulynx.milkCollectionBranch.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.context.CompanyContext;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.company.repository.CompanyRepository;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import com.jaysambhu.modulynx.core.user.dto.UserRegistrationDto;
import com.jaysambhu.modulynx.core.user.model.Role;
import com.jaysambhu.modulynx.core.user.model.RoleName;
import com.jaysambhu.modulynx.core.user.model.User;
import com.jaysambhu.modulynx.core.user.model.UserCompanyRole;
import com.jaysambhu.modulynx.core.user.repository.RoleRepository;
import com.jaysambhu.modulynx.core.user.repository.UserCompanyRoleRepository;
import com.jaysambhu.modulynx.core.user.repository.UserRepository;
import com.jaysambhu.modulynx.milkCollectionBranch.dto.*;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.MilkType;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.RateType;
import com.jaysambhu.modulynx.milkCollectionBranch.mapper.ChillVatMapper;
import com.jaysambhu.modulynx.milkCollectionBranch.mapper.McbMilkRateMapper;
import com.jaysambhu.modulynx.milkCollectionBranch.mapper.MilkCollectionBranchMapper;
import com.jaysambhu.modulynx.milkCollectionBranch.model.ChillVat;
import com.jaysambhu.modulynx.milkCollectionBranch.model.McbMilkRate;
import com.jaysambhu.modulynx.milkCollectionBranch.model.MilkCollectionBranch;
import com.jaysambhu.modulynx.milkCollectionBranch.repository.ChillVatRepository;
import com.jaysambhu.modulynx.milkCollectionBranch.repository.McbMilkRateRepository;
import com.jaysambhu.modulynx.milkCollectionBranch.repository.MilkCollectionBranchRepository;
import com.jaysambhu.modulynx.milkCollectionBranch.service.McbUserManagementService;
import com.jaysambhu.modulynx.milkCollectionBranch.service.MilkCollectionBranchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service implementation for MilkCollectionBranch operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MilkCollectionBranchServiceImpl implements MilkCollectionBranchService {

    private final MilkCollectionBranchRepository mcbRepository;
    private final ChillVatRepository chillVatRepository;
    private final McbMilkRateRepository mcbMilkRateRepository;
    private final MilkCollectionBranchMapper mcbMapper;
    private final ChillVatMapper chillVatMapper;
    private final McbMilkRateMapper mcbMilkRateMapper;
    private final McbUserManagementService mcbUserManagementService;
    private final RoleRepository roleRepository;
    private final UserCompanyRoleRepository userCompanyRoleRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public MilkCollectionBranchDto createMcb(CreateMilkCollectionBranchRequest request) {
        Long companyId = validateAndGetCompanyId();
        boolean createdNewManager = false;

        // Check if name is unique
        if (mcbRepository.existsByNameAndCompany_Id(request.getBranchName(), companyId)) {
            throw new BadRequestException("MCB with name '" + request.getBranchName() + "' already exists");
        }

        // Create MCB entity
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new BadRequestException("Company with ID " + companyId + " not found."));

        MilkCollectionBranch mcb = MilkCollectionBranch.builder()
                .name(request.getBranchName())
                .location(request.getLocation())
                .phoneNumber(request.getPhoneNumber())
                .isActive(request.getIsActive())
                .company(company)
                .build();

        // Save MCB first to get the ID
        MilkCollectionBranch savedMcb = mcbRepository.save(mcb);

        // Create manager if specified
        if (request.getManagerUsername() != null && !request.getManagerUsername().trim().isEmpty()) {
            UserDto existingManager = mcbUserManagementService.findUserByUsername(request.getManagerUsername());
            if (existingManager != null) {
                User managerUser = userRepository.getReferenceById(existingManager.getId());
                savedMcb.setManager(managerUser);
                log.info("Assigned existing user '{}' as manager for MCB {}.", existingManager.getUsername(),
                        savedMcb.getId());
            } else {
                // Create new manager user
                UserRegistrationDto managerRegistration = UserRegistrationDto.builder()
                        .firstName(request.getManagerName())
                        .username(request.getManagerUsername())
                        .password(request.getManagerPassword())
                        .email(request.getManagerUsername() + "@modulynx.com")
                        .phone(request.getManagerUsername())
                        .tenantId(company.getTenant().getId())
                        .build();

                UserDto newManager = mcbUserManagementService.createMcbManager(savedMcb.getId(), managerRegistration);
                createdNewManager = true; // Mark that a new manager was created
                User managerUser = userRepository.getReferenceById(newManager.getId());
                savedMcb.setManager(managerUser);

                log.info("Created new user '{}' and assigned as manager for MCB {}.", newManager.getUsername(),
                        savedMcb.getId());
            }

            // Save MCB again with manager reference
            savedMcb = mcbRepository.save(savedMcb);
        }

        // Create chill vats
        if (request.getChillVats() != null && !request.getChillVats().isEmpty()) {
            for (CreateMilkCollectionBranchRequest.ChillVatRequest chillVatRequest : request.getChillVats()) {
                try {
                    addChillVat(savedMcb.getId(), chillVatRequest.getName(), chillVatRequest.getCapacity());
                    log.info("Created chill vat '{}' for MCB {}", chillVatRequest.getName(), savedMcb.getId());
                } catch (Exception e) {
                    log.error("Failed to create chill vat '{}' for MCB {}: {}", chillVatRequest.getName(),
                            savedMcb.getId(), e.getMessage());
                    throw new BadRequestException(
                            "Failed to create chill vat '" + chillVatRequest.getName() + "': " + e.getMessage());
                }
            }
        }

        // Create milk rates
        LocalDate today = LocalDate.now();
        try {
            // Raw milk buy rate
            if (request.getRawMilkBuyRate() != null) {
                addMilkRate(savedMcb.getId(), MilkType.RAW, RateType.BUY, request.getRawMilkBuyRate(), today);
                log.info("Created raw milk buy rate for MCB {}", savedMcb.getId());
            }

            // Raw milk sale rate
            if (request.getRawMilkSaleRate() != null) {
                addMilkRate(savedMcb.getId(), MilkType.RAW, RateType.SELL, request.getRawMilkSaleRate(), today);
                log.info("Created raw milk sale rate for MCB {}", savedMcb.getId());
            }

            // Whole milk buy rate
            if (request.getWholeMilkBuyRate() != null) {
                addMilkRate(savedMcb.getId(), MilkType.WHOLE, RateType.BUY, request.getWholeMilkBuyRate(), today);
                log.info("Created whole milk buy rate for MCB {}", savedMcb.getId());
            }

            // Whole milk sale rate
            if (request.getWholeMilkSaleRate() != null) {
                addMilkRate(savedMcb.getId(), MilkType.WHOLE, RateType.SELL, request.getWholeMilkSaleRate(), today);
                log.info("Created whole milk sale rate for MCB {}", savedMcb.getId());
            }
        } catch (Exception e) {
            log.error("Failed to create milk rates for MCB {}: {}", savedMcb.getId(), e.getMessage());
            throw new BadRequestException("Failed to create milk rates: " + e.getMessage());
        }

        // Assign MCB manager role if a new manager was created
        if (createdNewManager) {
            assignMcbManagerRole(savedMcb.getManager().getId(), companyId);
        }

        log.info("Successfully created MCB {} for company {} with {} chill vats and milk rates",
                savedMcb.getName(), companyId, request.getChillVats() != null ? request.getChillVats().size() : 0);

        // Return the complete MCB with all related data
        return getMcbById(savedMcb.getId());
    }

    private void assignMcbManagerRole(Long userId, Long companyId) {
        // Find the MILK_COLLECTION_MANAGER role
        Role mcbManagerRole = roleRepository.findByName(RoleName.MCB_MANAGER)
                .orElseThrow(() -> new BadRequestException("MCB Manager role not found"));

        UserCompanyRole userCompanyRole = UserCompanyRole.builder()
                .user(userRepository.getReferenceById(userId))
                .company(companyRepository.getReferenceById(companyId))
                .role(mcbManagerRole)
                .isActive(true)
                .build();

        userCompanyRoleRepository.save(userCompanyRole);
        log.info("Assigned MILK_COLLECTION_MANAGER role to user {} for company {}", userId, companyId);
    }

    @Override
    @Transactional
    public MilkCollectionBranchDto updateMcb(Long mcbId, CreateMilkCollectionBranchRequest request) {
        Long companyId = validateAndGetCompanyId();

        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        mcb.setName(request.getBranchName());
        mcb.setLocation(request.getLocation());
        mcb.setPhoneNumber(request.getPhoneNumber());
        mcb.setActive(request.getIsActive());

        // Update manager if specified
        if (request.getManagerUsername() != null && !request.getManagerUsername().trim().isEmpty()) {
            UserDto manager = mcbUserManagementService.findUserByUsername(request.getManagerUsername());
            if (manager != null) {
                User managerUser = userRepository.getReferenceById(manager.getId());
                mcb.setManager(managerUser);
            } else {
                throw new BadRequestException("Manager with username '" + request.getManagerUsername() + "' not found");
            }
        } else {
            mcb.setManager(null);
        }

        MilkCollectionBranch updatedMcb = mcbRepository.save(mcb);
        return mcbMapper.toDto(updatedMcb);
    }

    @Override
    @Transactional(readOnly = true)
    public MilkCollectionBranchDto getMcbById(Long mcbId) {
        Long companyId = validateAndGetCompanyId();

        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        return mcbMapper.toDto(mcb);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MilkCollectionBranchDto> getAllMcbs() {
        Long companyId = validateAndGetCompanyId();
        List<MilkCollectionBranch> mcbs = mcbRepository.findByCompany_Id(companyId);
        return mcbMapper.toDtos(mcbs);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MilkCollectionBranchDto> getMcbs(Pageable pageable) {
        Long companyId = validateAndGetCompanyId();
        Page<MilkCollectionBranch> mcbs = mcbRepository.findByCompany_Id(companyId, pageable);
        return mcbs.map(mcbMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MilkCollectionBranchDto> getActiveMcbs() {
        Long companyId = validateAndGetCompanyId();
        List<MilkCollectionBranch> mcbs = mcbRepository.findByCompany_IdAndIsActive(companyId, true);
        return mcbMapper.toDtos(mcbs);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MilkCollectionBranchDto> searchMcbsByName(String searchTerm) {
        Long companyId = validateAndGetCompanyId();
        List<MilkCollectionBranch> mcbs = mcbRepository.searchByNameOrLocation(companyId, searchTerm);
        return mcbMapper.toDtos(mcbs);
    }

    @Override
    @Transactional
    public void deleteMcb(Long mcbId) {
        Long companyId = validateAndGetCompanyId();
        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));
        mcbRepository.delete(mcb);
        log.info("Deleted MCB {} for company {}", mcb.getName(), companyId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isNameUnique(String name) {
        Long companyId = validateAndGetCompanyId();
        return !mcbRepository.existsByNameAndCompany_Id(name, companyId);
    }

    // ============ CHILL VAT OPERATIONS ============

    @Override
    @Transactional
    public ChillVatDto addChillVat(Long mcbId, String name, Integer capacityInLiters) {
        Long companyId = validateAndGetCompanyId();

        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        // Check if name is unique within the MCB
        if (chillVatRepository.existsByNameAndMilkCollectionBranch_Id(name, mcbId)) {
            throw new BadRequestException("Chill vat with name '" + name + "' already exists in this MCB");
        }

        ChillVat chillVat = ChillVat.builder()
                .name(name)
                .capacityInLiters(capacityInLiters)
                .currentStockLiters(0)
                .isOperational(true)
                .milkCollectionBranch(mcb)
                .build();

        ChillVat savedChillVat = chillVatRepository.save(chillVat);
        log.info("Added chill vat {} to MCB {}", name, mcbId);
        return chillVatMapper.toDto(savedChillVat);
    }

    @Override
    @Transactional
    public ChillVatDto updateChillVat(Long mcbId, Long chillVatId, String name, Integer capacityInLiters) {
        Long companyId = validateAndGetCompanyId();

        ChillVat chillVat = chillVatRepository.findByIdAndMcbIdAndCompanyId(chillVatId, mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("Chill vat not found"));

        // Check if name is unique within the MCB (excluding current record)
        if (chillVatRepository.existsByNameAndMilkCollectionBranch_IdAndIdNot(name, mcbId, chillVatId)) {
            throw new BadRequestException("Chill vat with name '" + name + "' already exists in this MCB");
        }

        chillVat.setName(name);
        chillVat.setCapacityInLiters(capacityInLiters);

        ChillVat updatedChillVat = chillVatRepository.save(chillVat);
        log.info("Updated chill vat {} in MCB {}", name, mcbId);
        return chillVatMapper.toDto(updatedChillVat);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChillVatDto> getChillVatsByMcbId(Long mcbId) {
        Long companyId = validateAndGetCompanyId();
        List<ChillVat> chillVats = chillVatRepository.findByMcbIdAndCompanyId(mcbId, companyId);
        return chillVatMapper.toDtos(chillVats);
    }

    @Override
    @Transactional
    public void deleteChillVat(Long mcbId, Long chillVatId) {
        Long companyId = validateAndGetCompanyId();

        ChillVat chillVat = chillVatRepository.findByIdAndMcbIdAndCompanyId(chillVatId, mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("Chill vat not found"));

        chillVatRepository.delete(chillVat);
        log.info("Deleted chill vat {} from MCB {}", chillVat.getName(), mcbId);
    }

    // ============ MILK RATE OPERATIONS ============

    @Override
    @Transactional
    public McbMilkRateDto addMilkRate(Long mcbId, MilkType milkType, RateType rateType,
            BigDecimal rate, LocalDate effectiveFrom) {
        Long companyId = validateAndGetCompanyId();

        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        // Close any existing active rates for this combination
        List<McbMilkRate> existingRates = mcbMilkRateRepository.findOverlappingActiveRates(mcbId, milkType, rateType);
        for (McbMilkRate existingRate : existingRates) {
            existingRate.setEffectiveTo(effectiveFrom.minusDays(1));
            mcbMilkRateRepository.save(existingRate);
        }

        McbMilkRate milkRate = McbMilkRate.builder()
                .milkType(milkType)
                .rateType(rateType)
                .rate(rate)
                .effectiveFrom(effectiveFrom)
                .milkCollectionBranch(mcb)
                .build();

        McbMilkRate savedRate = mcbMilkRateRepository.save(milkRate);
        log.info("Added milk rate {} for {} {} in MCB {}", rate, milkType, rateType, mcbId);
        return mcbMilkRateMapper.toDto(savedRate);
    }

    @Override
    @Transactional(readOnly = true)
    public McbMilkRateDto getCurrentRate(Long mcbId, MilkType milkType, RateType rateType) {
        Long companyId = validateAndGetCompanyId();

        McbMilkRate currentRate = mcbMilkRateRepository.findCurrentRateWithCompanyId(
                mcbId, milkType, rateType, LocalDate.now(), companyId)
                .orElseThrow(() -> new BadRequestException("No current rate found for " + milkType + " " + rateType));

        return mcbMilkRateMapper.toDto(currentRate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<McbMilkRateDto> getRateHistory(Long mcbId, MilkType milkType, RateType rateType) {
        Long companyId = validateAndGetCompanyId();

        // Validate MCB exists and belongs to company
        mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        List<McbMilkRate> rateHistory = mcbMilkRateRepository.findRateHistory(mcbId, milkType, rateType);
        return mcbMilkRateMapper.toDtos(rateHistory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<McbMilkRateDto> getCurrentRatesByMcbId(Long mcbId) {
        Long companyId = validateAndGetCompanyId();

        List<McbMilkRate> currentRates = mcbMilkRateRepository.findByMcbIdAndCompanyId(mcbId, companyId);
        return mcbMilkRateMapper.toDtos(currentRates.stream()
                .filter(rate -> rate.getEffectiveTo() == null || rate.getEffectiveTo().isAfter(LocalDate.now()))
                .toList());
    }

    @Override
    @Transactional
    public void closeCurrentRate(Long mcbId, MilkType milkType, RateType rateType, LocalDate endDate) {
        Long companyId = validateAndGetCompanyId();

        McbMilkRate currentRate = mcbMilkRateRepository.findCurrentRateWithCompanyId(
                mcbId, milkType, rateType, LocalDate.now(), companyId)
                .orElseThrow(() -> new BadRequestException("No current rate found for " + milkType + " " + rateType));

        currentRate.setEffectiveTo(endDate);
        mcbMilkRateRepository.save(currentRate);
        log.info("Closed current rate for {} {} in MCB {} effective to {}", milkType, rateType, mcbId, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getCompanyStats() {
        Long companyId = validateAndGetCompanyId();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMcbs", mcbRepository.countByCompany_Id(companyId));
        stats.put("activeMcbs", mcbRepository.countByCompany_IdAndIsActive(companyId, true));
        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getMcbStats(Long mcbId) {
        Long companyId = validateAndGetCompanyId();
        mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("mcbId", mcbId);
        stats.put("totalChillVats", chillVatRepository.findByMcbIdAndCompanyId(mcbId, companyId).size());
        stats.put("operationalChillVats", chillVatRepository.countOperationalByMcbId(mcbId));
        stats.put("totalCapacity", chillVatRepository.getTotalCapacityByMcbId(mcbId));
        stats.put("currentStock", chillVatRepository.getTotalCurrentStockByMcbId(mcbId));
        stats.put("totalRateChanges", mcbMilkRateRepository.countRateChangesByMcbId(mcbId));
        return stats;
    }

    private Long validateAndGetCompanyId() {
        Long companyId = CompanyContext.get();
        if (companyId == null) {
            log.error("No company context found");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Company context required for MCB operations");
        }
        return companyId;
    }
}