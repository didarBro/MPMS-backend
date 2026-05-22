import type { CreateTaskInput, UpdateTaskInput, UpdateStatusInput } from "./task.schema";
declare function list(filters: {
    projectId?: string;
    sprintId?: string;
    assigneeId?: string;
    status?: string;
    priority?: string;
    search?: string;
}): Promise<({
    sprint: {
        name: string;
        id: string;
        project: {
            name: string;
            id: string;
        };
        sprintNumber: number;
    } | null;
    assignee: {
        name: string;
        id: string;
        avatar: string | null;
    } | null;
    _count: {
        subtasks: number;
        attachments: number;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: import("@prisma/client").$Enums.TaskStatus;
    priority: import("@prisma/client").$Enums.Priority;
    storyPoints: number | null;
    estimate: number | null;
    dueDate: Date | null;
    sprintId: string | null;
    assigneeId: string | null;
    createdById: string;
    parentId: string | null;
})[]>;
declare function findById(id: string): Promise<{
    sprint: {
        name: string;
        id: string;
        project: {
            name: string;
            id: string;
        };
        sprintNumber: number;
    } | null;
    assignee: {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    } | null;
    createdBy: {
        name: string;
        id: string;
    };
    subtasks: {
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.Priority;
        assigneeId: string | null;
        assignee: {
            name: string;
            id: string;
            avatar: string | null;
        } | null;
    }[];
    attachments: {
        name: string;
        id: string;
        createdAt: Date;
        taskId: string;
        url: string;
        mimeType: string;
        size: number;
    }[];
    _count: {
        subtasks: number;
        timeLogs: number;
        attachments: number;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: import("@prisma/client").$Enums.TaskStatus;
    priority: import("@prisma/client").$Enums.Priority;
    storyPoints: number | null;
    estimate: number | null;
    dueDate: Date | null;
    sprintId: string | null;
    assigneeId: string | null;
    createdById: string;
    parentId: string | null;
}>;
declare function create(data: CreateTaskInput, createdById: string): Promise<{
    sprint: {
        name: string;
        id: string;
        project: {
            name: string;
            id: string;
        };
        sprintNumber: number;
    } | null;
    assignee: {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    } | null;
    createdBy: {
        name: string;
        id: string;
    };
    subtasks: {
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.Priority;
        assigneeId: string | null;
        assignee: {
            name: string;
            id: string;
            avatar: string | null;
        } | null;
    }[];
    attachments: {
        name: string;
        id: string;
        createdAt: Date;
        taskId: string;
        url: string;
        mimeType: string;
        size: number;
    }[];
    _count: {
        subtasks: number;
        timeLogs: number;
        attachments: number;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: import("@prisma/client").$Enums.TaskStatus;
    priority: import("@prisma/client").$Enums.Priority;
    storyPoints: number | null;
    estimate: number | null;
    dueDate: Date | null;
    sprintId: string | null;
    assigneeId: string | null;
    createdById: string;
    parentId: string | null;
}>;
declare function update(id: string, data: UpdateTaskInput): Promise<{
    sprint: {
        name: string;
        id: string;
        project: {
            name: string;
            id: string;
        };
        sprintNumber: number;
    } | null;
    assignee: {
        name: string;
        id: string;
        email: string;
        avatar: string | null;
    } | null;
    createdBy: {
        name: string;
        id: string;
    };
    subtasks: {
        id: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        priority: import("@prisma/client").$Enums.Priority;
        assigneeId: string | null;
        assignee: {
            name: string;
            id: string;
            avatar: string | null;
        } | null;
    }[];
    attachments: {
        name: string;
        id: string;
        createdAt: Date;
        taskId: string;
        url: string;
        mimeType: string;
        size: number;
    }[];
    _count: {
        subtasks: number;
        timeLogs: number;
        attachments: number;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: import("@prisma/client").$Enums.TaskStatus;
    priority: import("@prisma/client").$Enums.Priority;
    storyPoints: number | null;
    estimate: number | null;
    dueDate: Date | null;
    sprintId: string | null;
    assigneeId: string | null;
    createdById: string;
    parentId: string | null;
}>;
declare function updateStatus(id: string, data: UpdateStatusInput): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: import("@prisma/client").$Enums.TaskStatus;
    priority: import("@prisma/client").$Enums.Priority;
    storyPoints: number | null;
    estimate: number | null;
    dueDate: Date | null;
    sprintId: string | null;
    assigneeId: string | null;
    createdById: string;
    parentId: string | null;
}>;
declare function remove(id: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: import("@prisma/client").$Enums.TaskStatus;
    priority: import("@prisma/client").$Enums.Priority;
    storyPoints: number | null;
    estimate: number | null;
    dueDate: Date | null;
    sprintId: string | null;
    assigneeId: string | null;
    createdById: string;
    parentId: string | null;
}>;
declare function addAttachment(taskId: string, file: {
    originalname: string;
    filename: string;
    mimetype: string;
    size: number;
}): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    taskId: string;
    url: string;
    mimeType: string;
    size: number;
}>;
declare function removeAttachment(taskId: string, attachmentId: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    taskId: string;
    url: string;
    mimeType: string;
    size: number;
}>;
export declare const taskService: {
    list: typeof list;
    findById: typeof findById;
    create: typeof create;
    update: typeof update;
    updateStatus: typeof updateStatus;
    remove: typeof remove;
    addAttachment: typeof addAttachment;
    removeAttachment: typeof removeAttachment;
};
export {};
