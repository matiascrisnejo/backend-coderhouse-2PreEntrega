import mongoose from "mongoose"

const uri = "mongodb+srv://crisnejomatias:T2l2f4n4@matiascluster.wnvxrzy.mongodb.net/dbecomercenew?retryWrites=true&w=majority"

const connectToDB = () =>{
    try {
        mongoose.connect(uri)
        console.log("conectado a la db ecommerce");
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB