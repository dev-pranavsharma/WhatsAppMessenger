import { Request ,Response} from "express"
import mongoose from "mongoose"
import {Contact} from "../models/contact"
import { ErrorResponse, SuccessResponse } from "../safety/validators"

export const GetContacts = async(req:Request,res:Response)=>{
    const tenant_id = req.params.tenant_id
    const waba_id = req.params.waba_id
    try {
    const contacts = await Contact.find({tenant_id:tenant_id,waba_id:waba_id}); // fetch all contacts
    res.json(contacts)
    } catch (err) {
      console.error("Error fetching contacts:", err);
      res.status(500).json({ message: "Server error" });
    }
}
export const AddContact = async (req: Request, res: Response) => {
  try {
    const { t_id, waba_id, pn_id } = req.body;

    if (!t_id || !waba_id || !pn_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    const response:SuccessResponse = {
            success:true,
            message:'Contact Added Successfully',
            data:null
    }
    res.status(201).json(response);
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || 'Something went wrong. Please contact support'; 
    const response:ErrorResponse={
        status:status,
        message:message
    }
    res.status(500).json(response);
  }
};