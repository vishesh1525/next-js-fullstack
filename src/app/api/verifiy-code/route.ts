import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {isValid, z} from 'zod'
import {usernameValidation} from "@/schemas/signupSchema"
import UserModel from "@/models/User";

const UsernameQuerySchema=z.object({
    username:usernameValidation
})


export async function POST(request:Request)
{
    await dbConnect();
    try {
        const {username,code}=await request.json()

        const decodedusername=decodeURIComponent(username)
        const user=await UserModel.findOne(
            {
                username:decodedusername
            }
        )
        if(!user)
            {
                return Response.json(
                    {
                        sucess:false,
                        message:"User not found"
                    },
                    {
                        status:500
                    }
                )
            }

       const iscodevalid=user.verifiyCode==code
       const iscodesxpired=new Date(user.verifiyCodeExpire)>new Date()
       if(iscodevalid && iscodesxpired)
        {
            user.isverifired=true;
            await user.save()
            console.error(" Verifiying the user");
            return Response.json(
                {
                    success:true,
                    message:"Account verified sucessfully"
                },
                {status:200}
            )
        }
        else{
            if(!iscodesxpired)
                {
                    console.error("Error Verifiying the user");
                    return Response.json(
                        {
                            success:false,
                            message:"Verification code is expired"
                        },
                        {status:400}
                    )
                }else{
                    return Response.json(
                        {
                            success:false,
                            message:"Verification code is not correct"
                        },
                        {status:400}
                    )
                }
        }

    } catch (error) {
        console.error("Error Verifiying the user",error);
        return Response.json(
            {
                sucess:false,
                message:"Error Veifiying the user"
            },
            {
                status:500
            }
        )
    }
}