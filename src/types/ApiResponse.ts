import { Message } from "@/models/User";

export interface ApiResponse
{
    sucess:boolean;
    message:string;
    isAceeptingMessage?:boolean;
    messages?:Array<Message>
}