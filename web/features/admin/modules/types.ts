export interface Feature {
    id?: number;
    name: string;
    code?: string;
    description?: string;
    isActive?: boolean;
    moduleId?: number;
}

export interface Module {
    id: number;
    name: string;
    code: string;
    description: string;
    active: boolean;
    features: Feature[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ModuleCreateRequest {
    name: string;
    code: string;
    description: string;
    features: Feature[];
}

export interface ModuleUpdateRequest {
    name?: string;
    code?: string;
    description?: string;
    active?: boolean;
    features?: Feature[];
}

export interface PageableResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
}

export interface ModulesListResponse extends PageableResponse<Module> { }

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ModuleFormData {
    id?: number;
    name: string;
    code: string;
    description: string;
    active: boolean;
    features: Feature[];
} 