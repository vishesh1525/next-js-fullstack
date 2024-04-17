import mongoose,{Schema,Document} from "mongoose";


export interface Message extends Document
{
    content:string;
    createdat:Date;
}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdat:
    {
        type:Date,
        required:true,
        default:Date.now
    },
})


export interface User extends Document
{
    username:string;
    email:string;
    password:string;
    verifiyCode:string;
    verifiyCodeExpire:Date;
    isverifired:Boolean;
    isAceeptingMessage:boolean;
    messages:Message[]

}

const userSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"User is required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+/,'please use a valid email address']

    },
    password:
    {
        type:String,
        required:[true,"pAssword is required"],

    },
    verifiyCode:
    {
        type:String,
        
    },
    verifiyCodeExpire:
    {
        type:Date,
        

    },
    isverifired:
    {
        type:Boolean,
       default:false
    }
    ,
    isAceeptingMessage:
    {
        type:Boolean,
       default:false
    },
    messages:[MessageSchema]

})


const UserModel=(mongoose.models.User as mongoose.Model<User> )||(mongoose.model<User>("User",userSchema))

export default UserModel