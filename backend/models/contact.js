import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    t_id: {
      type: Number,
      required: true,
    },
    waba_id: {
      type: String,
      required: true,
    },
    pn_id: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["N","M", "F", "O"]
    },
    full_name: {
      type: String,
      required: true,
    },
    country_code: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },

    // ✅ Nested personal details
    personal_details: {
      occupation: { type: String },
      birthday: { type: Date },
      company_name: { type: String },
      engagement: { type: Date, default: null },
      anniversary: { type: Date, default: null },
    },

    // ✅ Nested address details
    address_details: {
      address_line_1: { type: String },
      address_line_2: { type: String },
      state: { type: String },
      country_code: { type: String }, // ISO country code (e.g., IN, US)
      city: { type: String },
      pincode: { type: String },
    },
  },
  { collection: "contacts", timestamps: true }
);

export const Contact = mongoose.model("Contact", ContactSchema);
