import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const Connection:ConnectionObject={}



async function dbConnect():Promise<void>{
    if(Connection.isConnected)
        {
            console.log("Connected");
            return
        }
        try {
            const dbName = mongoose.connection.name;

            const db=await mongoose.connect(process.env.MONGODB_URI||'',{})
           Connection.isConnected=db.connections[0].readyState
           console.log("Connected to database:", dbName);
           console.log("DB CONNECTED SUCESFULLY")
        } catch (error) {
            console.log("Database Connection failed",error);
            process.exit(1);
        }
}



export default dbConnect  