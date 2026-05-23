import type { CreateUserInput, UpdateUserInput } from "./user.schema";
declare function list(filters: {
    search?: string;
    role?: string;
    department?: string;
    isActive?: string;
}): Promise<{
    name: string;
    id: string;
    email: string;
    role: import("@prisma/client").$Enums.Role;
    avatar: string | null;
    department: string | null;
    skills: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}[]>;
declare function findById(id: string): Promise<{
    name: string;
    id: string;
    email: string;
    role: import("@prisma/client").$Enums.Role;
    avatar: string | null;
    department: string | null;
    skills: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    teamMembers: ({
        team: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        role: import("@prisma/client").$Enums.TeamRole;
        createdAt: Date;
        teamId: string;
        userId: string;
    })[];
}>;
declare function create(data: CreateUserInput): Promise<{
    name: string;
    id: string;
    email: string;
    role: import("@prisma/client").$Enums.Role;
    avatar: string | null;
    department: string | null;
    skills: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
declare function update(id: string, data: UpdateUserInput): Promise<{
    name: string;
    id: string;
    email: string;
    role: import("@prisma/client").$Enums.Role;
    avatar: string | null;
    department: string | null;
    skills: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
declare function changePassword(id: string, password: string): Promise<void>;
declare function remove(id: string): Promise<void>;
export declare const userService: {
    list: typeof list;
    findById: typeof findById;
    create: typeof create;
    update: typeof update;
    changePassword: typeof changePassword;
    remove: typeof remove;
};
export {};
