package com.jaysambhu.dairymanagementsystem.common.audit;

import jakarta.persistence.EntityManager;
import org.hibernate.envers.RevisionListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class CustomRevisionListener implements RevisionListener {

    @Override
    public void newRevision(Object revisionEntity) {
        CustomRevisionEntity revision = (CustomRevisionEntity) revisionEntity;

        // Get current user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "system";
        revision.setUsername(username);

        // Get IP address
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            String ipAddress = attributes.getRequest().getRemoteAddr();
            revision.setIpAddress(ipAddress);
        }

        // Set action type (this could be enhanced based on the operation type)
        revision.setAction("MODIFY");
    }
}