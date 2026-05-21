import type { RegisterInput, LoginInput } from "./auth.schema";
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare function register(data: RegisterInput): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare function login(data: LoginInput): Promise<{
    user: {
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare function refreshTokens(token: string): Promise<TokenPair>;
export declare function logout(token: string): Promise<void>;
export declare function getMe(userId: string): Promise<{
    name: string;
    id: string;
    email: string;
    role: import("@prisma/client").$Enums.Role;
    avatar: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export {};
