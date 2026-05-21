import type { CreateSprintInput, UpdateSprintInput, ReorderInput } from "./sprint.schema.js";
declare function list(filters: {
    projectId?: string;
    status?: string;
}): Promise<({
    _count: {
        tasks: number;
    };
    project: {
        client: string | null;
        name: string;
        id: string;
    };
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
})[]>;
declare function listByProject(projectId: string): Promise<({
    _count: {
        tasks: number;
    };
    tasks: {
        status: import("@prisma/client").$Enums.TaskStatus;
    }[];
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
})[]>;
declare function create(projectId: string, data: CreateSprintInput): Promise<{
    _count: {
        tasks: number;
    };
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
}>;
declare function update(id: string, data: UpdateSprintInput): Promise<{
    _count: {
        tasks: number;
    };
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
}>;
declare function remove(id: string): Promise<{
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
}>;
declare function reorder(projectId: string, data: ReorderInput): Promise<void>;
export declare const sprintService: {
    list: typeof list;
    listByProject: typeof listByProject;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
    reorder: typeof reorder;
};
export {};
