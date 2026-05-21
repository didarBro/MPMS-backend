import type { Request, Response } from "express";
export declare const listSprints: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const listProjectSprints: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createSprint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateSprint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteSprint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const reorderSprints: (req: Request, res: Response, next: import("express").NextFunction) => void;
