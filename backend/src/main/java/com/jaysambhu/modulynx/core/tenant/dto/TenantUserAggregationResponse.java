package com.jaysambhu.modulynx.core.tenant.dto;

import com.jaysambhu.modulynx.core.user.dto.UserDto;
import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * DTO for aggregated tenant user response containing both admins and regular
 * users
 */
@Data
@Builder
public class TenantUserAggregationResponse {
    private List<TenantAdminResponse> admins;
    private List<UserDto> users;
    private int totalCount;
    private int adminCount;
    private int userCount;
}