import {resend} from "@/lib/resend"

import VerificationEmail from "../../emails/Verficationemail"
import { ApiResponse } from "@/types/ApiResponse"


export async function sendverificationEmail(   email:string,
    username:string,
    verifiycode:string
):Promise<ApiResponse>
{
     try{
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to: email,
            subject: "Mystery Mesg|Verification Code",
            react: VerificationEmail({username,otp:verifiycode}),
          });

        return {sucess:true,message:"sucess in send verification email"}
     }catch(emailError)
     {
        console.error('Error Sending Verification email',emailError)
        return {sucess:false,message:"Failed to send verification email"}
     }
}
