import { authenticatedFetch, handleApiResponse } from '@/lib/api';

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    tenantId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    isActive: boolean;
}

export interface UpdateUserRequest {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
}

/**
 * User service for user management
 */
export const userService = {
    async getUsers(token: string): Promise<User[]> {
        const response = await authenticatedFetch('/api/v1/users', token);
        return handleApiResponse<User[]>(response);
    },

    async getUserById(token: string, id: string): Promise<User> {
        const response = await authenticatedFetch(`/api/v1/users/${id}`, token);
        return handleApiResponse<User>(response);
    },

    async createUser(token: string, data: CreateUserRequest): Promise<User> {
        const response = await authenticatedFetch('/api/v1/users', token, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleApiResponse<User>(response);
    },

    async updateUser(token: string, id: string, data: UpdateUserRequest): Promise<User> {
        const response = await authenticatedFetch(`/api/v1/users/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleApiResponse<User>(response);
    },

    async deleteUser(token: string, id: string): Promise<void> {
        const response = await authenticatedFetch(`/api/v1/users/${id}`, token, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `Failed to delete user`);
        }
    }
}; 