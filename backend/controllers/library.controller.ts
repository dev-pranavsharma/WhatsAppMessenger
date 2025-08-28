import { Request ,Response} from "express"
import { ErrorResponse, SuccessResponse } from "../safety/validators";
import { CountryCode } from "../models/library.js";
import mongoose from "mongoose";

export const GetCountryCodes = async(req:Request,res:Response) => {
    try {
    // const codes = await CountryCode.find({});
    const codes = await mongoose.connection.db.collection("country_code").find().toArray();
    const response:SuccessResponse = {
        success:true,
        message:'country codes list',
        data:codes
    }
    res.status(200).json(response)
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support'; 
        const response:ErrorResponse={
            status:status,
            message:message
        }
      res.status(500).json(response);
    }
}


export const GetGenders = async(req:Request,res:Response) => {
    try {
    // const codes = await CountryCode.find({});
    const codes = await mongoose.connection.db.collection("gender").find().toArray();
    const response:SuccessResponse = {
        success:true,
        message:'genders list',
        data:codes
    }
    res.status(200).json(response)
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Something went wrong. Please contact support'; 
        const response:ErrorResponse={
            status:status,
            message:message
        }
      res.status(500).json(response);
    }
}