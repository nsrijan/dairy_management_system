package com.jaysambhu.modulynx.milkCollectionBranch.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.context.CompanyContext;
import com.jaysambhu.modulynx.milkCollectionBranch.dto.CreateMilkCollectionBranchRequest;
import com.jaysambhu.modulynx.milkCollectionBranch.dto.MilkCollectionBranchDto;
import com.jaysambhu.modulynx.milkCollectionBranch.dto.ChillVatDto;
import com.jaysambhu.modulynx.milkCollectionBranch.dto.McbMilkRateDto;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.MilkType;
import com.jaysambhu.modulynx.milkCollectionBranch.enums.RateType;
import com.jaysambhu.modulynx.milkCollectionBranch.service.MilkCollectionBranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Milk Collection Branch (MCB) operations.
 * Handles complete CRUD operations including chill vats, milk rates, and user
 * management.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/mcb")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Milk Collection Branch", description = "MCB management operations")
public class MilkCollectionBranchController {

        private final MilkCollectionBranchService mcbService;

        // ============ MCB CRUD OPERATIONS ============

        @PostMapping
        @Operation(summary = "Create new MCB", description = "Creates a new MCB with chill vats, milk rates, and manager user")
        public ResponseEntity<GlobalApiResponse<MilkCollectionBranchDto>> createMcb(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Valid @RequestBody CreateMilkCollectionBranchRequest request) {

                log.info("Creating new MCB: {} for company: {}", request.getBranchName(), companyId);

                MilkCollectionBranchDto createdMcb = mcbService.createMcb(request);

                GlobalApiResponse<MilkCollectionBranchDto> response = GlobalApiResponse
                                .<MilkCollectionBranchDto>builder()
                                .success(true)
                                .message("MCB created successfully")
                                .data(createdMcb)
                                .build();

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping
        @Operation(summary = "Get all MCBs", description = "Retrieves all MCBs for the current company")
        public ResponseEntity<GlobalApiResponse<List<MilkCollectionBranchDto>>> getAllMcbs(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId) {

                List<MilkCollectionBranchDto> mcbs = mcbService.getAllMcbs();

                GlobalApiResponse<List<MilkCollectionBranchDto>> response = GlobalApiResponse
                                .<List<MilkCollectionBranchDto>>builder()
                                .success(true)
                                .message("MCBs retrieved successfully")
                                .data(mcbs)
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/paginated")
        @Operation(summary = "Get MCBs with pagination", description = "Retrieves MCBs with pagination support")
        public ResponseEntity<GlobalApiResponse<Page<MilkCollectionBranchDto>>> getMcbsWithPagination(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        Pageable pageable) {

                Page<MilkCollectionBranchDto> mcbs = mcbService.getMcbs(pageable);

                GlobalApiResponse<Page<MilkCollectionBranchDto>> response = GlobalApiResponse
                                .<Page<MilkCollectionBranchDto>>builder()
                                .success(true)
                                .message("MCBs retrieved successfully")
                                .data(mcbs)
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/active")
        @Operation(summary = "Get active MCBs", description = "Retrieves only active MCBs for the current company")
        public ResponseEntity<GlobalApiResponse<List<MilkCollectionBranchDto>>> getActiveMcbs(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId) {

                List<MilkCollectionBranchDto> mcbs = mcbService.getActiveMcbs();

                GlobalApiResponse<List<MilkCollectionBranchDto>> response = GlobalApiResponse
                                .<List<MilkCollectionBranchDto>>builder()
                                .success(true)
                                .message("Active MCBs retrieved successfully")
                                .data(mcbs)
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{id}")
        @Operation(summary = "Get MCB by ID", description = "Retrieves a specific MCB with all related data")
        public ResponseEntity<GlobalApiResponse<MilkCollectionBranchDto>> getMcbById(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long id) {

                MilkCollectionBranchDto mcb = mcbService.getMcbById(id);

                GlobalApiResponse<MilkCollectionBranchDto> response = GlobalApiResponse
                                .<MilkCollectionBranchDto>builder()
                                .success(true)
                                .message("MCB retrieved successfully")
                                .data(mcb)
                                .build();

                return ResponseEntity.ok(response);
        }

        @PutMapping("/{id}")
        @Operation(summary = "Update MCB", description = "Updates an existing MCB")
        public ResponseEntity<GlobalApiResponse<MilkCollectionBranchDto>> updateMcb(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long id,
                        @Valid @RequestBody CreateMilkCollectionBranchRequest request) {

                log.info("Updating MCB {}: {} for company: {}", id, request.getBranchName(), companyId);

                MilkCollectionBranchDto updatedMcb = mcbService.updateMcb(id, request);

                GlobalApiResponse<MilkCollectionBranchDto> response = GlobalApiResponse
                                .<MilkCollectionBranchDto>builder()
                                .success(true)
                                .message("MCB updated successfully")
                                .data(updatedMcb)
                                .build();

                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{id}")
        @Operation(summary = "Delete MCB", description = "Deletes an MCB and all related data")
        public ResponseEntity<GlobalApiResponse<Void>> deleteMcb(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long id) {

                log.info("Deleting MCB {} for company: {}", id, companyId);

                mcbService.deleteMcb(id);

                GlobalApiResponse<Void> response = GlobalApiResponse.<Void>builder()
                                .success(true)
                                .message("MCB deleted successfully")
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/search")
        @Operation(summary = "Search MCBs", description = "Search MCBs by name or location")
        public ResponseEntity<GlobalApiResponse<List<MilkCollectionBranchDto>>> searchMcbs(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "Search term") @RequestParam String searchTerm) {

                List<MilkCollectionBranchDto> mcbs = mcbService.searchMcbsByName(searchTerm);

                GlobalApiResponse<List<MilkCollectionBranchDto>> response = GlobalApiResponse
                                .<List<MilkCollectionBranchDto>>builder()
                                .success(true)
                                .message("MCBs retrieved successfully")
                                .data(mcbs)
                                .build();

                return ResponseEntity.ok(response);
        }

        // ============ UTILITY OPERATIONS ============

        @GetMapping("/check-name-unique")
        @Operation(summary = "Check name uniqueness", description = "Checks if MCB name is unique within company")
        public ResponseEntity<GlobalApiResponse<Boolean>> checkNameUnique(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB name") @RequestParam String name) {

                boolean isUnique = mcbService.isNameUnique(name);

                GlobalApiResponse<Boolean> response = GlobalApiResponse.<Boolean>builder()
                                .success(true)
                                .message("Name uniqueness checked")
                                .data(isUnique)
                                .build();

                return ResponseEntity.ok(response);
        }

        // ============ CHILL VAT OPERATIONS ============

        @PostMapping("/{mcbId}/chill-vats")
        @Operation(summary = "Add chill vat", description = "Adds a new chill vat to an MCB")
        public ResponseEntity<GlobalApiResponse<ChillVatDto>> addChillVat(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId,
                        @Parameter(description = "Vat name") @RequestParam String name,
                        @Parameter(description = "Capacity in liters") @RequestParam Integer capacityInLiters) {

                ChillVatDto chillVat = mcbService.addChillVat(mcbId, name, capacityInLiters);

                GlobalApiResponse<ChillVatDto> response = GlobalApiResponse.<ChillVatDto>builder()
                                .success(true)
                                .message("Chill vat added successfully")
                                .data(chillVat)
                                .build();

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping("/{mcbId}/chill-vats")
        @Operation(summary = "Get chill vats", description = "Retrieves all chill vats for an MCB")
        public ResponseEntity<GlobalApiResponse<List<ChillVatDto>>> getChillVats(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId) {

                List<ChillVatDto> chillVats = mcbService.getChillVatsByMcbId(mcbId);

                GlobalApiResponse<List<ChillVatDto>> response = GlobalApiResponse.<List<ChillVatDto>>builder()
                                .success(true)
                                .message("Chill vats retrieved successfully")
                                .data(chillVats)
                                .build();

                return ResponseEntity.ok(response);
        }

        @PutMapping("/{mcbId}/chill-vats/{chillVatId}")
        @Operation(summary = "Update chill vat", description = "Updates an existing chill vat")
        public ResponseEntity<GlobalApiResponse<ChillVatDto>> updateChillVat(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId,
                        @Parameter(description = "Chill Vat ID") @PathVariable Long chillVatId,
                        @Parameter(description = "Vat name") @RequestParam String name,
                        @Parameter(description = "Capacity in liters") @RequestParam Integer capacityInLiters) {

                ChillVatDto chillVat = mcbService.updateChillVat(mcbId, chillVatId, name, capacityInLiters);

                GlobalApiResponse<ChillVatDto> response = GlobalApiResponse.<ChillVatDto>builder()
                                .success(true)
                                .message("Chill vat updated successfully")
                                .data(chillVat)
                                .build();

                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{mcbId}/chill-vats/{chillVatId}")
        @Operation(summary = "Delete chill vat", description = "Deletes a chill vat")
        public ResponseEntity<GlobalApiResponse<Void>> deleteChillVat(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId,
                        @Parameter(description = "Chill Vat ID") @PathVariable Long chillVatId) {

                mcbService.deleteChillVat(mcbId, chillVatId);

                GlobalApiResponse<Void> response = GlobalApiResponse.<Void>builder()
                                .success(true)
                                .message("Chill vat deleted successfully")
                                .build();

                return ResponseEntity.ok(response);
        }

        // ============ MILK RATE OPERATIONS ============

        @PostMapping("/{mcbId}/milk-rates")
        @Operation(summary = "Add milk rate", description = "Adds a new milk rate (auto-closes current rate)")
        public ResponseEntity<GlobalApiResponse<McbMilkRateDto>> addMilkRate(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId,
                        @Parameter(description = "Milk type") @RequestParam MilkType milkType,
                        @Parameter(description = "Rate type") @RequestParam RateType rateType,
                        @Parameter(description = "Rate amount") @RequestParam BigDecimal rate,
                        @Parameter(description = "Effective from date") @RequestParam LocalDate effectiveFrom) {

                McbMilkRateDto milkRate = mcbService.addMilkRate(mcbId, milkType, rateType, rate, effectiveFrom);

                GlobalApiResponse<McbMilkRateDto> response = GlobalApiResponse.<McbMilkRateDto>builder()
                                .success(true)
                                .message("Milk rate added successfully")
                                .data(milkRate)
                                .build();

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping("/{mcbId}/milk-rates/current")
        @Operation(summary = "Get current rates", description = "Retrieves all current rates for an MCB")
        public ResponseEntity<GlobalApiResponse<List<McbMilkRateDto>>> getCurrentRates(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId) {

                List<McbMilkRateDto> rates = mcbService.getCurrentRatesByMcbId(mcbId);

                GlobalApiResponse<List<McbMilkRateDto>> response = GlobalApiResponse.<List<McbMilkRateDto>>builder()
                                .success(true)
                                .message("Current rates retrieved successfully")
                                .data(rates)
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{mcbId}/milk-rates/history")
        @Operation(summary = "Get rate history", description = "Retrieves rate history for specific milk and rate type")
        public ResponseEntity<GlobalApiResponse<List<McbMilkRateDto>>> getRateHistory(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId,
                        @Parameter(description = "Milk type") @RequestParam MilkType milkType,
                        @Parameter(description = "Rate type") @RequestParam RateType rateType) {

                List<McbMilkRateDto> rates = mcbService.getRateHistory(mcbId, milkType, rateType);

                GlobalApiResponse<List<McbMilkRateDto>> response = GlobalApiResponse.<List<McbMilkRateDto>>builder()
                                .success(true)
                                .message("Rate history retrieved successfully")
                                .data(rates)
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{mcbId}/milk-rates/current/{milkType}/{rateType}")
        @Operation(summary = "Get specific current rate", description = "Retrieves current rate for specific milk and rate type")
        public ResponseEntity<GlobalApiResponse<McbMilkRateDto>> getCurrentRate(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId,
                        @Parameter(description = "Milk type") @PathVariable MilkType milkType,
                        @Parameter(description = "Rate type") @PathVariable RateType rateType) {

                McbMilkRateDto rate = mcbService.getCurrentRate(mcbId, milkType, rateType);

                GlobalApiResponse<McbMilkRateDto> response = GlobalApiResponse.<McbMilkRateDto>builder()
                                .success(true)
                                .message("Current rate retrieved successfully")
                                .data(rate)
                                .build();

                return ResponseEntity.ok(response);
        }

        @PostMapping("/{mcbId}/milk-rates/close")
        @Operation(summary = "Close current rate", description = "Closes the current rate for specific milk and rate type")
        public ResponseEntity<GlobalApiResponse<Void>> closeCurrentRate(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId,
                        @Parameter(description = "Milk type") @RequestParam MilkType milkType,
                        @Parameter(description = "Rate type") @RequestParam RateType rateType,
                        @Parameter(description = "End date") @RequestParam LocalDate endDate) {

                mcbService.closeCurrentRate(mcbId, milkType, rateType, endDate);

                GlobalApiResponse<Void> response = GlobalApiResponse.<Void>builder()
                                .success(true)
                                .message("Current rate closed successfully")
                                .build();

                return ResponseEntity.ok(response);
        }

        // ============ STATISTICS OPERATIONS ============

        @GetMapping("/stats/company")
        @Operation(summary = "Get company stats", description = "Retrieves company-wide MCB statistics")
        public ResponseEntity<GlobalApiResponse<Map<String, Object>>> getCompanyStats(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId) {

                Map<String, Object> stats = mcbService.getCompanyStats();

                GlobalApiResponse<Map<String, Object>> response = GlobalApiResponse.<Map<String, Object>>builder()
                                .success(true)
                                .message("Company statistics retrieved successfully")
                                .data(stats)
                                .build();

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{mcbId}/stats")
        @Operation(summary = "Get MCB stats", description = "Retrieves MCB-specific statistics")
        public ResponseEntity<GlobalApiResponse<Map<String, Object>>> getMcbStats(
                        @Parameter(description = "Company ID") @PathVariable("companyId") Long companyId,
                        @Parameter(description = "MCB ID") @PathVariable Long mcbId) {

                Map<String, Object> stats = mcbService.getMcbStats(mcbId);

                GlobalApiResponse<Map<String, Object>> response = GlobalApiResponse.<Map<String, Object>>builder()
                                .success(true)
                                .message("MCB statistics retrieved successfully")
                                .data(stats)
                                .build();

                return ResponseEntity.ok(response);
        }
}