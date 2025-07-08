package com.jaysambhu.modulynx.modules.dairy.milkcollection.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.context.CompanyContext;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.modules.dairy.milkcollection.model.MilkCollectionBranch;
import com.jaysambhu.modulynx.modules.dairy.milkcollection.repository.MilkCollectionBranchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service implementation demonstrating CompanyContext usage.
 * This shows the exact pattern requested for company-scoped operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MilkCollectionBranchServiceImpl {

    private final MilkCollectionBranchRepository mcbRepository;

    /**
     * Create MCB - demonstrates CompanyContext usage in service layer
     * This is the exact pattern requested in the requirements
     */
    @Transactional
    public MilkCollectionBranch createMcb(String name, String code, String address) {
        // ============ KEY REQUIREMENT: Use CompanyContext.get() ============
        Long companyId = CompanyContext.get();

        // ============ NULL CHECKS AND GUARDS (Required) ============
        if (companyId == null) {
            log.error("No company context found when creating MCB");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Company context required for MCB operations");
        }

        log.debug("Creating MCB for company ID: {}", companyId);

        // Check if code is unique within company scope
        if (mcbRepository.existsByCodeAndCompany_Id(code, companyId)) {
            throw new BadRequestException("MCB code '" + code + "' already exists in this company");
        }

        // ============ SET COMPANY FROM CONTEXT (Required Pattern) ============
        Company company = new Company();
        company.setId(companyId);

        MilkCollectionBranch mcb = MilkCollectionBranch.builder()
                .name(name)
                .code(code)
                .address(address)
                .company(company) // Set company from CompanyContext
                .isActive(true)
                .build();

        MilkCollectionBranch savedMcb = mcbRepository.save(mcb);

        log.info("Created MCB {} for company {}", savedMcb.getName(), companyId);
        return savedMcb;
    }

    /**
     * Get MCB by ID - demonstrates secure company-scoped access
     */
    @Transactional(readOnly = true)
    public MilkCollectionBranch getMcbById(Long mcbId) {
        // ============ KEY REQUIREMENT: Use CompanyContext.get() ============
        Long companyId = CompanyContext.get();

        // ============ NULL CHECKS AND GUARDS (Required) ============
        if (companyId == null) {
            log.error("No company context found when retrieving MCB");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Company context required for MCB operations");
        }

        log.debug("Retrieving MCB {} for company {}", mcbId, companyId);

        // ============ SCOPED REPOSITORY METHOD (Required Pattern) ============
        return mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found or access denied"));
    }

    /**
     * Get all MCBs for current company
     */
    @Transactional(readOnly = true)
    public List<MilkCollectionBranch> getAllMcbs() {
        // ============ KEY REQUIREMENT: Use CompanyContext.get() ============
        Long companyId = CompanyContext.get();

        // ============ NULL CHECKS AND GUARDS (Required) ============
        if (companyId == null) {
            log.error("No company context found when retrieving MCBs");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Company context required for MCB operations");
        }

        log.debug("Retrieving all MCBs for company {}", companyId);

        // ============ SCOPED REPOSITORY METHOD (Required Pattern) ============
        return mcbRepository.findByCompany_Id(companyId);
    }

    /**
     * Update MCB - demonstrates secure update with company validation
     */
    @Transactional
    public MilkCollectionBranch updateMcb(Long mcbId, String name, String address) {
        // ============ KEY REQUIREMENT: Use CompanyContext.get() ============
        Long companyId = CompanyContext.get();

        // ============ NULL CHECKS AND GUARDS (Required) ============
        if (companyId == null) {
            log.error("No company context found when updating MCB");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Company context required for MCB operations");
        }

        log.debug("Updating MCB {} for company {}", mcbId, companyId);

        // ============ SCOPED REPOSITORY METHOD (Required Pattern) ============
        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found or access denied"));

        // Update fields
        mcb.setName(name);
        mcb.setAddress(address);

        MilkCollectionBranch updatedMcb = mcbRepository.save(mcb);

        log.info("Updated MCB {} for company {}", updatedMcb.getName(), companyId);
        return updatedMcb;
    }

    /**
     * Delete MCB - demonstrates secure deletion
     */
    @Transactional
    public void deleteMcb(Long mcbId) {
        // ============ KEY REQUIREMENT: Use CompanyContext.get() ============
        Long companyId = CompanyContext.get();

        // ============ NULL CHECKS AND GUARDS (Required) ============
        if (companyId == null) {
            log.error("No company context found when deleting MCB");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Company context required for MCB operations");
        }

        log.debug("Deleting MCB {} for company {}", mcbId, companyId);

        // ============ SCOPED REPOSITORY METHOD (Required Pattern) ============
        MilkCollectionBranch mcb = mcbRepository.findByIdAndCompany_Id(mcbId, companyId)
                .orElseThrow(() -> new BadRequestException("MCB not found or access denied"));

        mcbRepository.delete(mcb);

        log.info("Deleted MCB {} for company {}", mcb.getName(), companyId);
    }

    /**
     * Get company statistics - demonstrates aggregate operations with
     * CompanyContext
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getCompanyStats() {
        // ============ KEY REQUIREMENT: Use CompanyContext.get() ============
        Long companyId = CompanyContext.get();

        // ============ NULL CHECKS AND GUARDS (Required) ============
        if (companyId == null) {
            log.error("No company context found when retrieving stats");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Company context required for MCB operations");
        }

        log.debug("Retrieving MCB stats for company {}", companyId);

        Map<String, Object> stats = new HashMap<>();

        // Use company-scoped repository methods
        stats.put("totalMcbs", mcbRepository.countByCompany_Id(companyId));
        stats.put("activeMcbs", mcbRepository.countByCompany_IdAndIsActive(companyId, true));
        stats.put("totalCapacity", mcbRepository.getTotalCapacityByCompanyId(companyId));
        stats.put("currentStock", mcbRepository.getTotalCurrentStockByCompanyId(companyId));

        return stats;
    }

    /**
     * Check if code is unique within company scope
     */
    @Transactional(readOnly = true)
    public boolean isCodeUnique(String code) {
        // ============ KEY REQUIREMENT: Use CompanyContext.get() ============
        Long companyId = CompanyContext.get();

        // ============ NULL CHECKS AND GUARDS (Required) ============
        if (companyId == null) {
            log.error("No company context found when checking code uniqueness");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Company context required for MCB operations");
        }

        // ============ SCOPED REPOSITORY METHOD (Required Pattern) ============
        return !mcbRepository.existsByCodeAndCompany_Id(code, companyId);
    }
}