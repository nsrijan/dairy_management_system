# Core Modules

This directory contains core functionality that is shared across all business domains.

## Modules

- **user**: User management, profiles, and permissions
- **auth**: Authentication, JWT handling, security
- **tenant**: Multi-tenant support, tenant resolution, isolation
- **company**: Company management within each tenant
- **subscription**: (Planned) Subscription plans and billing
- **audit**: (Planned) System-wide audit logging
- **feature-toggle**: (Planned) Dynamic feature enabling/disabling per tenant

## Module Independence

Each core module is designed to be as independent as possible while still integrating with other modules through well-defined interfaces. 