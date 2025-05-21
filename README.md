# Dairy Management System

A multi-tenant, multi-company system for managing dairy operations across the supply chain.

## Overview

This system provides comprehensive management for dairy operations, including:
- Multi-tenant architecture for serving multiple dairy organizations
- Company management within each tenant
- User management with role-based access control
- Supply chain tracking from farmers to end consumers
- Inventory and production management
- Sales and distribution tracking
- Reporting and analytics

## System Architecture

- **Backend**: Spring Boot REST API with Java 17
- **Database**: PostgreSQL with Flyway migrations
- **Security**: JWT-based authentication and role-based authorization
- **Auditing**: Hibernate Envers for entity history tracking
- **Multi-tenancy**: Subdomain-based tenant isolation

## Core Modules

### Tenant Module
- Tenant management and subdomain resolution
- Tenant-specific configuration
- Cross-tenant data isolation

### User Module
- Authentication and authorization
- Role-based access control
- User profile management
- Multi-company user assignments

### Company Module
- Company management within tenants
- Company-specific settings and configurations

### Supplier Module
- Supplier management
- Farmer registration and management
- Raw material procurement

### Inventory Module
- Stock management
- Warehouse operations
- Inventory valuation

### Production Module
- Production planning
- Batch processing
- Quality control

### Sales Module
- Point of sale
- Order management
- Customer relations

### Distribution Module
- Delivery planning
- Route optimization
- Delivery tracking

### Reporting Module
- Financial reports
- Operational analytics
- Performance dashboards

## User Roles

- **System Admin**: Platform-wide access and tenant management
- **Tenant Admin**: Manages all companies within a tenant
- **Company Admin**: Manages users and settings for a specific company
- **Supplier/Farmer**: Supplies raw materials, views payments
- **Shop Manager**: Manages store operations and sales
- **Factory Manager**: Oversees production operations
- **MCB Staff**: Records milk collections and quality checks
- **Delivery Staff**: Manages deliveries and stock transfers
- **Customer**: Purchases products

## Development

### Prerequisites
- JDK 17+
- Maven
- PostgreSQL
- Docker (optional)

### Setup
1. Clone the repository
2. Configure database connection in `application.yml`
3. Run `mvn clean install`
4. Start the application with `mvn spring-boot:run`

### API Documentation
API documentation is available at `/swagger-ui.html` when the application is running.

## License
Proprietary software. All rights reserved. 