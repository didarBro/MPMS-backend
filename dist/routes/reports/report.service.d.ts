declare function getSummary(): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    totalLoggedHours: number;
    overallProgress: number;
}>;
declare function getProjectReports(): Promise<{
    totalTasks: number;
    doneTasks: number;
    inProgressTasks: number;
    inReviewTasks: number;
    todoTasks: number;
    percentComplete: number;
    estimatedHours: number;
    loggedHours: number;
    client: string | null;
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.ProjectStatus;
    startDate: Date | null;
    endDate: Date | null;
    budget: number | null;
}[]>;
declare function getUserReports(): Promise<{
    totalAssigned: number;
    completedTasks: number;
    inProgressTasks: number;
    criticalOpen: number;
    loggedHours: number;
    completionRate: number;
    name: string;
    id: string;
    email: string;
    department: string | null;
}[]>;
export declare const reportService: {
    getSummary: typeof getSummary;
    getProjectReports: typeof getProjectReports;
    getUserReports: typeof getUserReports;
};
export {};
