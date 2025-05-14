package com.jaysambhu.dairymanagementsystem.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class InvalidTenantException extends RuntimeException {

    public InvalidTenantException(String subdomain) {
        super(String.format("Tenant with subdomain '%s' is inactive or invalid", subdomain));
    }

    public InvalidTenantException(Long id) {
        super(String.format("Tenant with ID '%d' is inactive or invalid", id));
    }
}