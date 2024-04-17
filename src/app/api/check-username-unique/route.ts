import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {z} from 'zod'

import {usernameValidation} from "@/schemas/signupSchema"
import UserModel from "@/models/User";

const UsernameQuerySchema=z.object({
    username:usernameValidation
})

export async function GET(request:Request)
{
     //i have to use this all in routes

     if(request.method!=='GET')
        {
             return Response.json({
                sucess:false,
                message:"Method not allowed"

             },{status:405})
        }






    await dbConnect();
    try {
        const {searchParams}=new URL
        (request.url)
        const queryParam={
            username:searchParams.get('username') 
        }
        //validate with zod
        const result=UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success)
            {
                const usernameerrors=result.error.format().username?._errors || []

                return Response.json({
                    sucess:false,
                    message:usernameerrors?.length>0?usernameerrors.join(','):'invalid query parameters'
                },{status:400})
            }


        const {username}=result.data
        const existingverifieduser=await UserModel.findOne({username,isVerfied
            :true})
        console.log(existingverifieduser)
        if(existingverifieduser)
            {
                return Response.json({
                    sucess:false,
                    message:"Username is already taken"
                },{status:400})
            }
            return Response.json({
                sucess:true,
                message:"Username is Unique"
            },{status:200})
    } catch (error) {
        console.error("Error checking the username",error);
        return Response.json(
            {
                sucess:false,
                message:"Error checking the username"
            },
            {
                status:500
            }
        )
    }
}