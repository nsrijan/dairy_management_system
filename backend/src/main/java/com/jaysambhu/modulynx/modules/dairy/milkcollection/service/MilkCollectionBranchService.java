package com.jaysambhu.modulynx.modules.dairy.milkcollection.service;

import com.jaysambhu.modulynx.modules.dairy.milkcollection.dto.MilkCollectionBranchDto;
import com.jaysambhu.modulynx.modules.dairy.milkcollection.dto.CreateMcbRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for MilkCollectionBranch operations.
 * All methods use CompanyContext for company-scoped access.
 */
public interface MilkCollectionBranchService {

    /**
     * Create a new MCB (uses CompanyContext.get() for company association)
     */
    MilkCollectionBranchDto createMcb(CreateMcbRequest request);

    /**
     * Update an existing MCB (uses CompanyContext.get() for validation)
     */
    MilkCollectionBranchDto updateMcb(Long mcbId, CreateMcbRequest request);

    /**
     * Get MCB by ID (uses CompanyContext.get() for security)
     */
    MilkCollectionBranchDto getMcbById(Long mcbId);

    /**
     * Get all MCBs for current company (uses CompanyContext.get())
     */
    List<MilkCollectionBranchDto> getAllMcbs();

    /**
     * Get MCBs with pagination (uses CompanyContext.get())
     */
    Page<MilkCollectionBranchDto> getMcbs(Pageable pageable);

    /**
     * Get active MCBs only (uses CompanyContext.get())
     */
    List<MilkCollectionBranchDto> getActiveMcbs();

    /**
     * Search MCBs by name (uses CompanyContext.get())
     */
    List<MilkCollectionBranchDto> searchMcbsByName(String name);

    /**
     * Delete MCB (uses CompanyContext.get() for validation)
     */
    void deleteMcb(Long mcbId);

    /**
     * Check if MCB code is unique within company
     */
    boolean isCodeUnique(String code);

    /**
     * Get company statistics
     */
    Object getCompanyStats();
}