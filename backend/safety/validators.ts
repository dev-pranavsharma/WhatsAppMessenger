export type email = string;
export type phone_number = string;
export type ErrorResponse={
    status : number,
    message : string,
}
export type SuccessResponse<T=any>={
    success:true,
    message:string,
    data?:T
}
export function isEmail (value:unknown): email{
  if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("❌ Invalid email format");
  }
  return value as email
}
export function isPhoneNumber(value: unknown): phone_number {
  if (typeof value !== 'string' || !/^\d{7,15}$/.test(value)) {
    throw new Error("❌ Invalid phone number format");
  }
  return value as phone_number
}

