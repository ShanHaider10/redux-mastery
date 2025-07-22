import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await  mongoose.connect(process.env.MONGODB_URI);
    console.log("Connect DB: ", con.connection.host);
  } catch (error) {
    console.error("connect DB error:", error.message)
    console.error(`Stack trace, ${error.stack}`)
    process.exit(1)
  }
};


export default connectDB



