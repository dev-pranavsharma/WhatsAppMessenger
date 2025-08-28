import { pool } from "../config/database.js";
import type { email, ErrorResponse, SuccessResponse, phone_number } from "../safety/validators.js";
import type { Request, Response } from 'express';
import { isEmail, isPhoneNumber } from "../safety/validators.js";
import type { ResultSetHeader } from "mysql2";
import type { Role } from "../safety/types.ts";
import axios from "axios";
import fb from "../utils/axios.js";

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
export async function UpdateTenant(req:Request<{},{},Tenant>,res:Response){       
    try {
        const params: Tenant = {
            id:req.body.id,
            business_name: req.body.business_name,
            business_email: isEmail(req.body.business_email),
            phone_number: isPhoneNumber(req.body.phone_number),
            phone_number_code: req.body.phone_number_code,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            display_name: req.body.display_name,
            website_url: req.body.website_url,
        };

        const query: string = 'UPDATE tenants set business_name=?, business_email=?, phone_number=?, phone_number_code=?, first_name=?, last_name=?, display_name=?, website_url=? WHERE id=?';
        
        const [results] = await pool.query<ResultSetHeader>(query, [
            params.business_name,
            params.business_email,
            params.phone_number,
            params.phone_number_code,
            params.first_name,
            params.last_name,
            params.display_name,
            params.website_url,
            params.id
        ])
        
        const response: SuccessResponse<{insertedId: number}> = {
            success: true,
            message: 'Tenant updated successfully',
            data: null
        }
        res.status(200).json(response);
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
        
        const errorResponse: ErrorResponse = {
            status: status,
            message: message
        };
        
        res.status(status).json(errorResponse);
    }
}

export async function TenantbyID(req:Request,res:Response){    
    try {
        const tenant_id = req.user.t_id;
        const tenantquery = `SELECT * FROM tenants WHERE id=?`
        const [results] = await pool.query<ResultSetHeader>(tenantquery,[tenant_id])        
            const response:  SuccessResponse = {
            success: true,
            message: null,
            data: results[0]
        }
        res.status(200).json(response);
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
export const TenantPhoneNumbers = async(req:Request,res:Response)=>{
    try {
        const waba_id = req.params.waba_id;
        const token = req.body.access_token
        const url = `${process.env.FACEBOOK_API_URL}/${process.env.FACEBOOK_API_VERSION}/${waba_id}/phone_numbers`        
        const data = await fb.get(url, { meta: { accessToken: token } } )
        console.log('TenantPhoneNumbers\n',data);
        
        const response:SuccessResponse = {
            success:true,
            message:'phone nnumbers list',
            data:data.data
        }
        res.status(200).json(response)
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support';
        console.error('error\n',error);
        
        const errorResponse: ErrorResponse = {
            status: status,
            message: message
        }
        res.status(status).json(errorResponse);
    }
}