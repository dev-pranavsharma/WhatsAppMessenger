import { RowDataPacket } from "mysql2";

export type Role = RowDataPacket &{
  id: number;
  role_name: string;
};