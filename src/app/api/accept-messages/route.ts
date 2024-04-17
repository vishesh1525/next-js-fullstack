import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:Request) {
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
  const userId=user._id;
  const {aceeptingmesg}=await request.json();
  try{
    const updateduser=await UserModel.findByIdAndUpdate(userId,
        {
            isAceeptingMessage:aceeptingmesg
        },
        {
            new:true
        }
    )

    if(!updateduser)
        {
            return Response.json({
                sucess:false,
                message:"failed to update user status to accept mesg"
            },
        {status:404})
        }
        return Response.json({
            sucess:true,
            message:"mesg acceptance status updated sucesfully",updateduser
        },
    {status:500})
  }catch(error)
  {
    console.error(error)
    return Response.json({
        sucess:false,
        message:"failed to update user status to accept mesg"
    },
{status:500})
  }
}


export async function GET(request:Request)
{
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
  const userId=user._id;
  try {
    const founduser=await UserModel.findById(userId)
  if(!founduser)
    {
        return Response.json({
            sucess:false,
            message:"failed to update user status to accept mesg"
        },
    {status:401})
    }

    
            return Response.json({
                sucess:true,
                message:founduser.isAceeptingMessage
            },
        {status:200})

    
  } catch (error) {
    console.error(error);
    return Response.json({
        sucess:false,
        message:"Error in getting the mesges"
    },
{status:500})
  }
    }

    
