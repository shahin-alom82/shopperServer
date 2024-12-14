import mongoose from "mongoose";

const mongodbConnect = async () => {
      try {
            await mongoose.connect(process.env.MONGOBD_URI);
            console.log("Mongodb is Connected!");
      } catch (error) {
            console.log("Mongodb Connection Error!", error);
      }
};
export default mongodbConnect;
