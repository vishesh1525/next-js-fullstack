'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
 const page=()=>
  {

    const [username,setusername]=useState('')
    const[usernameMessage,setusernameMessage]=useState('')
    const [ischeckingusername,setischeckingusername]=useState(false)
    const [issubmitting,setissubmitting]=useState(false)

    const debounced=useDebounceCallback(setusername,300)
   const {toast}=useToast()
   const router=useRouter()
   //zod implementation
   const form=useForm<z.infer<typeof signupSchema>>({
    resolver:zodResolver(signupSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
   })

   useEffect(()=>{
    const checkusernameunique=async ()=>{
      if(username)
        {
          setischeckingusername(true)
          setusernameMessage('')
          try{
            const response=await axios.get(`/api/check-username-unique?username=${username}`)

            setusernameMessage(response.data.message);

          }catch(error)
          {
            const axiosError=error as AxiosError<ApiResponse>;
            setusernameMessage(axiosError.response?.data.message??"Error checking username")



          }finally{
            setischeckingusername(false);
          }
        }
    }
    checkusernameunique()
   },[username])


   const onsubmit=async(data:z.infer<typeof signupSchema>)=>
    {
      setissubmitting(true)
      try {
        const response=await axios.post<ApiResponse>('/api/sign-up',data)
        toast({
          title:'Sucess',
          description:response.data.message
        });
        router.replace(`/verifiy-code/${username}`)
        setissubmitting(false)
      } catch (error) {
        console.error("Error in the sign up",error);
        const axiosError=error as AxiosError<ApiResponse>;
        let errormesg=axiosError.response?.data.message
        toast({
          title:"Sign up failed",
          description:errormesg,
          variant:"destructive"
        })

       setissubmitting(false);
      }

    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Join True Feedback
        </h1>
        <p className="mb-4">Sign up to start your anonymous adventure</p>
      </div>
      <Form {...form}>
           <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
           <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username"
                 {...field}
                 onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)//customized use
                 }} />
                 
              </FormControl>
              {ischeckingusername && <Loader2 className="animate-spin" />}
                  {!ischeckingusername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage ==='Username is Unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
              <FormMessage />
            </FormItem>
          )}
        />

      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
          {
            issubmitting?(
              <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait 
              </>
            ):('Signup')
          }
        </Button>
           </form>
      </Form>
      <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
    </div>
  </div>
  )
}

export default page
