package com.jaysambhu.dairymanagementsystem.modules.company.exception;

import com.jaysambhu.dairymanagementsystem.common.exception.ResourceNotFoundException;

public class CompanyNotFoundException extends ResourceNotFoundException {

    public CompanyNotFoundException(Long id) {
        super("Company", "id", id);
    }

    public CompanyNotFoundException(String message) {
        super(message);
    }
}