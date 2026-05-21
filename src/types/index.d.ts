declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

export {};
