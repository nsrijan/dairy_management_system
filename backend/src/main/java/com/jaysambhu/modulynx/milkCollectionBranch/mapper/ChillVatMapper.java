package com.jaysambhu.modulynx.milkCollectionBranch.mapper;

import com.jaysambhu.modulynx.milkCollectionBranch.dto.ChillVatDto;
import com.jaysambhu.modulynx.milkCollectionBranch.dto.MilkCollectionBranchDto;
import com.jaysambhu.modulynx.milkCollectionBranch.model.ChillVat;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for ChillVat entity and DTO conversions.
 */
@Mapper(componentModel = "spring")
public interface ChillVatMapper {

    @Mapping(source = "milkCollectionBranch.id", target = "milkCollectionBranchId")
    @Mapping(source = "milkCollectionBranch.name", target = "milkCollectionBranchName")
    @Mapping(target = "availableCapacity", expression = "java(entity.getAvailableCapacity())")
    @Mapping(target = "capacityUtilization", expression = "java(entity.getCapacityUtilization())")
    ChillVatDto toDto(ChillVat entity);

    List<ChillVatDto> toDtos(List<ChillVat> entities);

    @Mapping(target = "availableCapacity", expression = "java(entity.getAvailableCapacity())")
    @Mapping(target = "capacityUtilization", expression = "java(entity.getCapacityUtilization())")
    MilkCollectionBranchDto.ChillVatDto toNestedDto(ChillVat entity);

    List<MilkCollectionBranchDto.ChillVatDto> toNestedDtos(List<ChillVat> entities);

    @Mapping(target = "milkCollectionBranch", ignore = true)
    ChillVat toEntity(ChillVatDto dto);
}