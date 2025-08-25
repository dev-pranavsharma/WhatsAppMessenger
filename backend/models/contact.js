import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
  },
  { collection: "contacts" } // map to existing collection
);

export default mongoose.models.contact || mongoose.model("contact", ContactSchema);
