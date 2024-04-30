'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Separator } from "@/components/ui/separator"
import {User} from 'next-auth'
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/models/User';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptMesgSchema } from '@/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCcw } from 'lucide-react';
import { MessageCard } from '@/components/Messagecard';
function page() {
  const [messages,setmessages]=useState<Message[]>([])
  const[isloading,setisloading]=useState(false);
  const [isswitchloading,setisswiticingloading]=useState(false);
  const {toast}=useToast()

  const handleDeleteMessage = (messageId: string) => {
    setmessages(messages.filter((message) => message._id !== messageId));
  }

  const {data:session}=useSession();
  const form=useForm({
    resolver:zodResolver(AcceptMesgSchema )
  })
  const {register,watch,setValue}=form
  const acceptMessages=watch('acceptMessages')
  const fecthAceeptmesg=useCallback(async()=>{
    setisswiticingloading(true);
    try {
      const response=await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages',response.data.isAceeptingMessage)
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message||"Failed to fetch",
        variant:"destructive"
      })
    }finally{
      setisswiticingloading(false)
    }
  },[setValue])



  const fetchmesges=useCallback(async(refresh:boolean=false)=>{
    setisloading(true)
    setisswiticingloading(false)
    try{
      const response=await axios.get<ApiResponse>('/api/get-messages')
      setmessages(response.data.messages || [])
      if(refresh)
        {
          toast({
            title:"Refreshed messages",
            description:"Showing latest messages"
          })
        }
    }catch(error)
    {
      const axiosError=error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message||"Failed to fetch",
        variant:"destructive"
      })
    }finally{
      setisloading(false)
      setisswiticingloading(false)
    }
  },[setisloading,setmessages])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchmesges()
    fecthAceeptmesg()
  },[session,setValue,fecthAceeptmesg,fetchmesges])

  //handle switch chnaage
  const handleswitchchange=async()=>{
    try{
      const response=await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages:!acceptMessages
      })
      console.log('hloo')
      setValue('acceptMessages',!acceptMessages)
      toast({
        title:response.data.message,
        variant:'default'
      })
      console.log(acceptMessages)
    }catch(error)
    {
      const axiosError=error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description:axiosError.response?.data.message||"Failed to fetch",
        variant:"destructive"
      })
    }
  }
  const {username}=session?.user as User||[];
  let baseurl = '';
if (typeof window !== 'undefined') {
  baseurl = `${window.location.protocol}//${window.location.host}`;
}
const profileUrl = `${baseurl}/u/${username}`;

  
  // const baseurl=`${window.location.protocol}//${window.location.host}`

  // const profileUrl=`${baseurl}/u/${username}`
 
  const copytoClipboard=()=>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"URL copied",
      description:"Profile URL has been copied  "
    })
  }
  
  if(!session || !session.user){
    return <div>Please Login</div>
  }
  return (
    <div>
     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copytoClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleswitchchange}
          disabled={isswitchloading}
        />
        <span className="ml-2">
          
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchmesges(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>

    </div>
  )
}

export default page
