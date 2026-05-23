import type { CreateTeamInput, UpdateTeamInput, AddMemberInput, UpdateMemberRoleInput } from "./team.schema";
declare function list(filters: {
    projectId?: string;
    search?: string;
}): Promise<({
    _count: {
        members: number;
    };
    project: {
        name: string;
        id: string;
    };
    members: ({
        user: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        role: import("@prisma/client").$Enums.TeamRole;
        createdAt: Date;
        teamId: string;
        userId: string;
    })[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    projectId: string;
})[]>;
declare function findById(id: string): Promise<{
    _count: {
        members: number;
    };
    project: {
        name: string;
        id: string;
    };
    members: ({
        user: {
            name: string;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
            department: string | null;
            skills: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        role: import("@prisma/client").$Enums.TeamRole;
        createdAt: Date;
        teamId: string;
        userId: string;
    })[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    projectId: string;
}>;
declare function create(data: CreateTeamInput): Promise<{
    _count: {
        members: number;
    };
    project: {
        name: string;
        id: string;
    };
    members: ({
        user: {
            name: string;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
            department: string | null;
            skills: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        role: import("@prisma/client").$Enums.TeamRole;
        createdAt: Date;
        teamId: string;
        userId: string;
    })[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    projectId: string;
}>;
declare function update(id: string, data: UpdateTeamInput): Promise<{
    _count: {
        members: number;
    };
    project: {
        name: string;
        id: string;
    };
    members: ({
        user: {
            name: string;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
            department: string | null;
            skills: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        role: import("@prisma/client").$Enums.TeamRole;
        createdAt: Date;
        teamId: string;
        userId: string;
    })[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    projectId: string;
}>;
declare function remove(id: string): Promise<void>;
declare function addMember(teamId: string, data: AddMemberInput): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        avatar: string | null;
        department: string | null;
        skills: string[];
        isActive: boolean;
    };
} & {
    id: string;
    role: import("@prisma/client").$Enums.TeamRole;
    createdAt: Date;
    teamId: string;
    userId: string;
}>;
declare function updateMemberRole(teamId: string, memberId: string, data: UpdateMemberRoleInput): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        avatar: string | null;
        department: string | null;
        skills: string[];
        isActive: boolean;
    };
} & {
    id: string;
    role: import("@prisma/client").$Enums.TeamRole;
    createdAt: Date;
    teamId: string;
    userId: string;
}>;
declare function removeMember(teamId: string, memberId: string): Promise<void>;
export declare const teamService: {
    list: typeof list;
    findById: typeof findById;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
    addMember: typeof addMember;
    updateMemberRole: typeof updateMemberRole;
    removeMember: typeof removeMember;
};
export {};
