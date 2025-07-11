package com.jaysambhu.modulynx.milkCollectionBranch.mapper;

import com.jaysambhu.modulynx.milkCollectionBranch.dto.MilkCollectionBranchDto;
import com.jaysambhu.modulynx.milkCollectionBranch.model.McbMilkRate;
import com.jaysambhu.modulynx.milkCollectionBranch.model.ChillVat;
import com.jaysambhu.modulynx.milkCollectionBranch.model.MilkCollectionBranch;
import org.mapstruct.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * MapStruct mapper for MilkCollectionBranch entity and DTO conversions.
 */
@Mapper(componentModel = "spring", uses = { ChillVatMapper.class, McbMilkRateMapper.class })
public interface MilkCollectionBranchMapper {

    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    @Mapping(source = "manager.id", target = "managerId")
    @Mapping(source = "manager.firstName", target = "managerName")
    @Mapping(source = "manager.username", target = "managerUsername")
    @Mapping(source = "chillVats", target = "totalCapacity", qualifiedByName = "calculateTotalCapacity")
    @Mapping(target = "chillVatCount", expression = "java(entity.getChillVats() != null ? entity.getChillVats().size() : 0)")
    @Mapping(target = "currentRates", source = "milkRates", qualifiedByName = "toCurrentRateDtos")
    MilkCollectionBranchDto toDto(MilkCollectionBranch entity);

    List<MilkCollectionBranchDto> toDtos(List<MilkCollectionBranch> entities);

    @Mapping(target = "company", ignore = true)
    @Mapping(target = "chillVats", ignore = true)
    @Mapping(target = "milkRates", ignore = true)
    @Mapping(target = "manager", ignore = true)
    MilkCollectionBranch toEntity(MilkCollectionBranchDto dto);

    /**
     * Maps a single McbMilkRate entity to a CurrentMilkRateDto.
     * This method is used by the toCurrentRateDtos method. MapStruct will implement
     * it
     * by matching property names (e.g., milkType, rateType, rate).
     *
     * @param rate The source McbMilkRate entity.
     * @return The mapped CurrentMilkRateDto.
     */
    MilkCollectionBranchDto.CurrentMilkRateDto mcbMilkRateToCurrentMilkRateDto(McbMilkRate rate);

    @Named("toCurrentRateDtos")
    default List<MilkCollectionBranchDto.CurrentMilkRateDto> toCurrentRateDtos(Set<McbMilkRate> milkRates) {
        if (milkRates == null) {
            return Collections.emptyList();
        }
        return milkRates.stream()
                .filter(McbMilkRate::isCurrentlyActive)
                .map(this::mcbMilkRateToCurrentMilkRateDto)
                .collect(Collectors.toList());
    }

    @Named("calculateTotalCapacity")
    default Integer calculateTotalCapacity(Set<ChillVat> chillVats) {
        if (chillVats == null) {
            return 0;
        }
        return chillVats.stream()
                .mapToInt(ChillVat::getCapacityInLiters)
                .sum();
    }
}