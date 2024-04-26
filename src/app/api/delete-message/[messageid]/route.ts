import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function DELETE(request:Request,{params}:{params:{messageid:string}}) {
    const mesgid=params.messageid;
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user:User=session?.user as User
    if(!session || !session.user)
        {
            return Response.json({
                sucess:false,
                message:"Not Aunticated"
            },
        {status:401}
    )
    }

    try {
        const updatedResult=await UserModel.updateOne({_id:user._id},{
            $pull:{messages:{_id:mesgid}}
        })

        if(updatedResult.modifiedCount==0)
            {
                return Response.json({
                    sucess:false,
                    message:"Message not found"
                },{status:404})
            }
            return Response.json({
                sucess:true,
                message:"Message Deleted"
            },{status:200})
    
    } catch (error) {
        return Response.json({
            sucess:false,
            message:"Error deleting mesg"
        },{status:500})
    }
  
  
  
}