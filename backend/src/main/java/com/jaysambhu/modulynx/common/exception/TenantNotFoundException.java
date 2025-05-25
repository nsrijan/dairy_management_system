package com.jaysambhu.modulynx.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TenantNotFoundException extends ResourceNotFoundException {

    public TenantNotFoundException(String subdomain) {
        super("Tenant", "subdomain", subdomain);
    }

    public TenantNotFoundException(Long id) {
        super("Tenant", "id", id);
    }
}