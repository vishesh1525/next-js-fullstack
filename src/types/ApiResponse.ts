import { Message } from "@/models/User";

export interface ApiResponse
{
    sucess:boolean;
    message:string;
    isAceepitingMessages?:boolean;
    messages?:Array<Message>
}