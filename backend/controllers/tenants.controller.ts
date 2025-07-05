import { pool } from "../config/database.js";
import type { email, ErrorResponse, SuccessResponse, phone_number } from "../safety/validators.js";
import type { Request, Response } from 'express';
import { isEmail, isPhoneNumber } from "../safety/validators.js";
import type { ResultSetHeader } from "mysql2";
import type { Role } from "../safety/types.ts";

type Tenant = {
    id?: number,
    business_name: string,
    business_email: email,
    phone_number: phone_number,
    phone_number_code: string,
    first_name: string,
    last_name: string,
    display_name: string,
    website_url: string,
}
export async function AllTenants(){

}
export async function AddTenant(req: Request<{}, {}, Tenant>, res: Response) {
    const request = req.body;
    
    try {
        const params: Tenant = {
            business_name: request.business_name,
            business_email: isEmail(request.business_email),
            phone_number: isPhoneNumber(request.phone_number),
            phone_number_code: request.phone_number_code,
            first_name: request.first_name,
            last_name: request.last_name,
            display_name: request.display_name,
            website_url: request.website_url,
        };

        const query: string = `INSERT INTO tenants (business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [results] = await pool.query<ResultSetHeader>(query, [
            params.business_name,
            params.business_email,
            params.phone_number,
            params.phone_number_code,
            params.first_name,
            params.last_name,
            params.display_name,
            params.website_url
        ])

        const response: SuccessResponse<{insertedId: number}> = {
            success: true,
            message: 'Tenant created successfully',
            data: {
                insertedId: results.insertId
            }
        }
        res.status(201).json(response);
    } catch (error: any) {
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support';
        console.log(error);
        
        const errorResponse: ErrorResponse = {
            status: status,
            message: message
        };
        
        res.status(status).json(errorResponse);
    }
}

export async function TenantbyID(req:Request,res:Response){
    try {
        const role_id = req.user.roleId;
        const tenant_id = req.user.tenant_id;
      const roleQuery = `SELECT id ,role_name FROM public.roles WHERE id=?`
      const [results] =  await pool.query<Role []>(roleQuery, [role_id]);
      console.log('role',results);
      
      if (results[0].role_name=='admin'){
        const tenantquery = `SELECT * FROM tenants WHERE id=?`
        const [results] = await pool.query<ResultSetHeader>(tenantquery,[tenant_id])
            const response: SuccessResponse = {
            success: true,
            message: null,
            data: results[0]
        }
        res.status(200).json(response);
        }
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support';
        console.error(error);
        
        const errorResponse: ErrorResponse = {
            status: status,
            message: message
        }
        res.status(status).json(errorResponse);
    }

}
