import { Request ,Response} from "express"
import mongoose from "mongoose"
import contact from "../models/contact"

const GetContacts = async(req:Request,res:Response)=>{
    const tenant_id = req.params.tenant_id
    const waba_id = req.params.waba_id
      try {
    const contacts = await contact.find(); // fetch all contacts
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ message: "Server error" });
  }
}