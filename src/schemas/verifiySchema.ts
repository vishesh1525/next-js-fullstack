import {z} from "zod"

export const verifiySchema=z.object({
    code:z.string().length(6,"Verififcation Code must be 6 diigits")
})