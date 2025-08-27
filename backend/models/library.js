import mongoose from "mongoose"

const CountryCodeSchema = new mongoose.Schema(
  {
    code:String,
    country:String
  },
  {collection:"country_code"}
)
export const CountryCode = mongoose.model('CountryCode',CountryCodeSchema)