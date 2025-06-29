import pool from "../config/database.js";
import type { email, ErrorResponse , SuccessResponse, phone_number } from "../safety/validators.ts";
import type { Request, Response } from 'express';
import { isEmail,isPhoneNumber } from "../safety/validators.ts";
import { ResultSetHeader } from "mysql2";

type Tenant ={
    id? : number,
    business_name: string,
    business_email: email,
    phone_number: phone_number,
    phone_number_code: string,
    first_name: string,
    last_name: string,
    display_name: string,
    website_url: string,
}

export async function AddTenant(req: Request<{}, {}, Tenant>,res:Response){
    const request = req.body ;
    const params :Tenant={
    business_name: request.business_name,
    business_email: isEmail(request.business_email),
    phone_number: isPhoneNumber(request.phone_number),
    phone_number_code: request.phone_number_code,
    first_name: request.first_name,
    last_name: request.last_name,
    display_name: request.display_name,
    website_url: request.website_url,
    }
    try{
    const query:string = `INSERT INTO tenants (business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    const [results] = await pool.query<ResultSetHeader>(query,[params.business_name,params.business_email,params.phone_number,params.phone_number_code,params.phone_number,params.first_name,params.last_name,params.display_name,params.website_url])
    const response: SuccessResponse <{insertedId:number}> ={
    success: true,
    message :'tenant created successfully',
    data:{
        insertedId:results.insertId
    }
};
    res.status(201).json(response)
    }catch(error){
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support ';
       const Error:ErrorResponse={
            status:status,
            message:message
       }
       res.json(Error)
    }



}