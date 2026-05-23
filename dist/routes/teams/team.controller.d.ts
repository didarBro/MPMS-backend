import type { Request, Response } from "express";
export declare const listTeams: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getTeam: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createTeam: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateTeam: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteTeam: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const addTeamMember: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateTeamMemberRole: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const removeTeamMember: (req: Request, res: Response, next: import("express").NextFunction) => void;
