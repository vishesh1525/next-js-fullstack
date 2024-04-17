import {z} from 'zod'

export const usernameValidation=z
     .string()
     .min(2,"Username must be atleast two chracters")
     .max(20,"must be no more than 20 chracters")
     .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters")

export const signupSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email Adress"}),
    password:z.string().min(6,{message:"password must be atleast 6 chracters"})
})