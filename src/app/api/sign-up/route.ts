import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"

import { sendverificationEmail } from "@/helpers/sendVerificationemails";


export async function POST(request:Request)
{
    await dbConnect()
    try {
         const {username,email,password}=await request.json()
         const existinguserverifiedbyusername=await UserModel.findOne({username,isverifired:true})

         if(existinguserverifiedbyusername)
            {
                return Response.json({
                    success:false,
                    message:"Username Already taken"

                },{status:400})
            }

            const existinguserverifiedbyemail=await UserModel.findOne({email})
            const verifiycode=Math.floor(100000+Math.random()*900000).toString()
            if(existinguserverifiedbyemail)
            {
                //we have to modifiy the existing user
                if(existinguserverifiedbyemail.isverifired)
                 {
                    
                        return Response.json({
                            success:false,
                            message:"User Already exist with this email"
        
                        },{status:400})
                    
                 }
                else{

                  const hashedpassword=await bcrypt.hash(password,10)
                  
                  existinguserverifiedbyemail.password=hashedpassword;
                  existinguserverifiedbyemail.verifiyCode=verifiycode
                  existinguserverifiedbyemail.verifiyCodeExpire=new Date(Date.now()+3600000)
                  await existinguserverifiedbyemail.save()
                  console.log("done")
                  
                }

            }else{
                const hashedpassword=await bcrypt.hash(password,10)

                const expirydate=new Date()
                expirydate.setHours(expirydate.getHours()+1)

                const newuser=new UserModel(
                    {
                        username,
                        email,
                        password:hashedpassword,
                        verifiyCode:verifiycode,
                        verifiyCodeExpire:expirydate,
                        isverifired:false,
                        isAceeptingMessage:true,
                        message:[]



                    }
                )
                console.log(newuser)
                await newuser.save();
                //send verfification email


                const emailresponse=await sendverificationEmail(email,username,verifiycode)

                if(!emailresponse.sucess)
                    {
                        return Response.json({
                            sucess:false,
                            message:emailresponse.message,

                        },{status:500})
                    }
              console.log(emailresponse)
            }
            return Response.json({
                sucess:false,
                message:"User registred sucesfully please verifiy the account",

            },{status:200})
                
         
    } catch (error) {
        console.error("Error registering User",error);
        return Response.json({
            sucess:false,
            message:"Error registering user"
        },
    {
        status:500
    })
    }
}