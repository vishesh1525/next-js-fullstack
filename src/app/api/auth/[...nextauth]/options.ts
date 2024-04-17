import NextAuth, { NextAuthOptions} from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"


export const authOptions:NextAuthOptions={
       providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email: { label: "Email", type: "text", },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
                 await dbConnect()
                 try{
                    const user=await UserModel.findOne({$or:[
                        {
                            email:credentials.identifier
                        },
                        {
                            username:credentials.identifier
                        },

                    ]})
                    if(!user)
                        {
                            throw new Error("No user found with this email")
                        }
                    if(!user.isverifired)
                        {
                            throw new Error("please verifiy your account")
                        }

                   const isPassword=await bcrypt.compare(credentials.password,user.password)

                   if(isPassword)
                    {
                        return user;
                    }
                    else{
                        throw new Error("password is not matching")
                    }
                 }catch(error:any)
                 {
                    throw new Error(error)
                 }
            }
        })
       ],
       callbacks:{
        
          async jwt({ token, user }) {

            if(user)
                {
                    token._id=user._id?.toString()
                    token._isverified=user.isverifired;
                    token.isAceeptingMessage=user.isAceeptingMessage
                    token.username=user.username
                }
            return token
          },
          async session({ session, token }) {
            if(token)
                {
                    session.user._id=token._id//to correct this we have modofied the jwt tokens types in nexxt-auth.js
                    session.user.isverifired=token.isverifired
                    session.user.isAceeptingMessage=token.isAceeptingMessage
                    session.user.username=token.username

                }
            return session
          },
       },
       pages:{
        signIn:'/sign-in'
       },
       session:{
        strategy:"jwt"
       },
       secret:process.env.NEXTAUTH_SECRECT,
}