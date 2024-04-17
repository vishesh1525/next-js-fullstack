import { Content } from "next/font/google"
import {z} from "zod"

export const MesgSchema=z.object({
   Content:z.string().min(10,"Content must be of 10 chracters")
   .max(300,"Content must be no longer than 300 chracters")
})