'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signinSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
 const page=()=>
  {

    
  const [issubmitting,setissubmitting]=useState(false)

    
  const {toast}=useToast()
  const router=useRouter()
   //zod implementation
   const form=useForm<z.infer<typeof signinSchema>>({
    resolver:zodResolver(signinSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
   })

   

   const onsubmit=async(data:z.infer<typeof signinSchema>)=>
    {
       const result=await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })
      if(result?.error)
        {
          if(result.error=='Credentialssignin'){
            toast({
              title:"Log in failed",
              description:"Incorrect username or paasword",
              variant:'destructive'
            })
          } 
          else{
            toast({
              title:"Log in failed",
              description:result.error,
              variant:'destructive'
            })
          }
        }
     if(result?.url)
      {
        router.replace('/dashboard');
      }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join True Feedback
        </h1>
        <p className="mb-4">Sign in to start your anonymous adventure</p>
      </div>
      <Form {...form}>
           <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
           

      <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/username</FormLabel>
              <FormControl>
                <Input placeholder="email"
                 {...field}
                  />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password"
                 {...field}
                  />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={issubmitting}>
          Sign in 
        </Button>
           </form>
      </Form>
      
    </div>
  </div>
  )
}

export default page
