import type { CreateProjectInput, UpdateProjectInput } from "./project.schema.js";
declare function list(filters: {
    status?: string;
    client?: string;
    search?: string;
}): Promise<{
    totalTasks: number;
    completedTasks: number;
    _count: {
        sprints: number;
        members: number;
    };
    client: string | null;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    status: import("@prisma/client").$Enums.ProjectStatus;
    startDate: Date | null;
    endDate: Date | null;
    budget: number | null;
    thumbnail: string | null;
}[]>;
declare function findById(id: string): Promise<{
    _count: {
        sprints: number;
        members: number;
    };
    sprints: ({
        tasks: ({
            assignee: {
                name: string;
                id: string;
                avatar: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            status: import("@prisma/client").$Enums.TaskStatus;
            priority: import("@prisma/client").$Enums.Priority;
            storyPoints: number | null;
            dueDate: Date | null;
            sprintId: string | null;
            assigneeId: string | null;
            createdById: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SprintStatus;
        projectId: string;
        startDate: Date | null;
        endDate: Date | null;
        sprintNumber: number;
        goal: string | null;
        order: number;
    })[];
    members: ({
        user: {
            name: string;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
        };
    } & {
        id: string;
        role: string;
        createdAt: Date;
        userId: string;
        projectId: string;
    })[];
} & {
    client: string | null;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    status: import("@prisma/client").$Enums.ProjectStatus;
    startDate: Date | null;
    endDate: Date | null;
    budget: number | null;
    thumbnail: string | null;
}>;
declare function create(data: CreateProjectInput): Promise<{
    client: string | null;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    status: import("@prisma/client").$Enums.ProjectStatus;
    startDate: Date | null;
    endDate: Date | null;
    budget: number | null;
    thumbnail: string | null;
}>;
declare function update(id: string, data: UpdateProjectInput): Promise<{
    client: string | null;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    status: import("@prisma/client").$Enums.ProjectStatus;
    startDate: Date | null;
    endDate: Date | null;
    budget: number | null;
    thumbnail: string | null;
}>;
declare function remove(id: string): Promise<{
    client: string | null;
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    status: import("@prisma/client").$Enums.ProjectStatus;
    startDate: Date | null;
    endDate: Date | null;
    budget: number | null;
    thumbnail: string | null;
}>;
export declare const projectService: {
    list: typeof list;
    findById: typeof findById;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export {};
