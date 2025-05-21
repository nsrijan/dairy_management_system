package com.jaysambhu.modulynx.core.company.exception;

import com.jaysambhu.modulynx.common.exception.ResourceNotFoundException;

public class CompanyNotFoundException extends ResourceNotFoundException {

    public CompanyNotFoundException(Long id) {
        super("Company", "id", id);
    }

    public CompanyNotFoundException(String message) {
        super(message);
    }
}