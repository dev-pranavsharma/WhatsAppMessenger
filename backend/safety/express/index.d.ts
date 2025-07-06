import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: number;
        role_id: number;
        username: string;
        tenant_id?: number;
      };
    }
  }
}
