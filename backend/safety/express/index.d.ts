import 'express';
import 'axios';


declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: number;
        role_id: number;
        username: string;
        t_id?: number;
      };
    }
  }
}


declare module 'axios' {
  export interface AxiosRequestConfig {
    meta?: {
      accessToken?: string
    };
  }
}