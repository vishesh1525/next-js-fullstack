import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User";

export async function POST(request:Request)
{
    await dbConnect()

    const {username,content}=await request.json();
    try {
        const user=await UserModel.findOne({username})

        if(!user)
            {
                return Response.json(
                    {
                    sucess:false,
                    message:"user not found"
                    },{status:404}
                )
            }

       if(!user.isAceeptingMessage)
        {
            return Response.json(
                {
                sucess:false,
                message:"user is not accepting the mesg"
                },{status:403}
            )
        }

        const newmmsg={content,createdat:new Date()}

        user.messages.push(newmmsg as Message)
        await user.save()
        return Response.json(
            {
            sucess:true,
            message:"user has sent the mesg"
            },{status:401}
        )
    } catch (error) {
        console.log("an unexpected error",error)
        return Response.json(
            {
            sucess:false,
            message:"internal server error"
            },{status:500}
        )
    }
}