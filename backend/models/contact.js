import mongoose from "mongoose";

 const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
  },
  { collection: "contacts" }
);
export const Contact = mongoose.model('Contact', ContactSchema);
