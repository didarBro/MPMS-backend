import type { Request, Response } from "express";
export declare const listUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const changeUserPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
