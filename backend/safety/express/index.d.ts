import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        roleId: number;
        username: string;
        tenant_id?: number;
      };
    }
  }
}
