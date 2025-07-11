package com.jaysambhu.modulynx.milkCollectionBranch.mapper;

import com.jaysambhu.modulynx.milkCollectionBranch.dto.McbMilkRateDto;
import com.jaysambhu.modulynx.milkCollectionBranch.dto.MilkCollectionBranchDto;
import com.jaysambhu.modulynx.milkCollectionBranch.model.McbMilkRate;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * MapStruct mapper for McbMilkRate entity and DTO conversions.
 */
@Mapper(componentModel = "spring")
public interface McbMilkRateMapper {

    @Mapping(source = "milkCollectionBranch.id", target = "milkCollectionBranchId")
    @Mapping(source = "milkCollectionBranch.name", target = "milkCollectionBranchName")
    @Mapping(target = "isCurrentlyActive", expression = "java(entity.isCurrentlyActive())")
    @Mapping(target = "displayName", expression = "java(entity.getMilkType().getDisplayName() + \" - \" + entity.getRateType().getDisplayName())")
    McbMilkRateDto toDto(McbMilkRate entity);

    List<McbMilkRateDto> toDtos(List<McbMilkRate> entities);

    @Mapping(target = "displayName", expression = "java(entity.getMilkType().getDisplayName() + \" - \" + entity.getRateType().getDisplayName())")
    MilkCollectionBranchDto.CurrentMilkRateDto toNestedDto(McbMilkRate entity);

    @Named("toCurrentRateDtos")
    default List<MilkCollectionBranchDto.CurrentMilkRateDto> toCurrentRateDtos(List<McbMilkRate> entities) {
        return entities.stream()
                .filter(McbMilkRate::isCurrentlyActive)
                .map(this::toNestedDto)
                .collect(Collectors.toList());
    }

    @Mapping(target = "milkCollectionBranch", ignore = true)
    McbMilkRate toEntity(McbMilkRateDto dto);
}