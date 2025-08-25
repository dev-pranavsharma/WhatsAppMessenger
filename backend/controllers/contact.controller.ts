import { Request ,Response} from "express"
import mongoose from "mongoose"
import {Contact} from "../models/contact"

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