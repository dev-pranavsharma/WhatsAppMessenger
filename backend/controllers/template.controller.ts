import { pool } from "../config/database.js";
import type { email, ErrorResponse, SuccessResponse, phone_number } from "../safety/validators.js";
import type { Request, Response } from 'express';
import { isEmail, isPhoneNumber } from "../safety/validators.js";
import type { ResultSetHeader } from "mysql2";
import type { Role } from "../safety/types.ts";
import axios from "axios";
import fb from "../utils/axios.js";


export const GetAllTemplates = async(req:Request,res:Response)=>{
    try {
    const waba_id = req.params.waba_id;
    const token = req.body.access_token
    const url = `${process.env.FACEBOOK_API_URL}/${process.env.FACEBOOK_API_VERSION}/${waba_id}/message_templates`   
    const data = await fb.get(url,{ meta: { accessToken: token } } )
    const response:SuccessResponse = {
        success:true,
        message:'templates list',
        data:data.data
    }
    res.status(200).json(response)
    } catch (error) {
        console.log(error.response);
        
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support';        
        const errorResponse: ErrorResponse = {
            status: status,
            message: message
        }
        res.status(status).json(errorResponse);
        
    }

}