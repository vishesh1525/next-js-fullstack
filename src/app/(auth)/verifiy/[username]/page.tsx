'use client'

import { useToast } from '@/components/ui/use-toast'
import { verifiySchema } from '@/schemas/verifiySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ApiResponse } from "@/types/ApiResponse"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
function VerifiyAcount() {
    const router=useRouter()
    const param=useParams<{username:string}>()
    const {toast}=useToast()
    const form=useForm<z.infer<typeof verifiySchema>>({
        resolver:zodResolver(verifiySchema),
        
       })



       const onsubmit=async(data:z.infer<typeof verifiySchema>)=>{
            try {
                const response=await axios.post('/api/verifiy-code',{username:param.username,code:data.code})
                toast({
                    title:"Sucess",
                    description:response.data.message
                })

                router.replace('sign-in')
            } catch (error) {
                console.error("Error in the verifiying ",error);
               const axiosError=error as AxiosError<ApiResponse>;
        
        toast({
          title:"Verification  up failed",
          description:axiosError.response?.data.message,
          variant:"destructive"
        })
            }  
       }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
   </div>
   </div>
  )
}

export default VerifiyAcount
