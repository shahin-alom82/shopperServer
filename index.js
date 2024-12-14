import express from "express"
import 'dotenv/config'
import cors from 'cors'
import mongodbConnect from "./config/mongodb.js";
import userRouter from "./route/userRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import productRoute from "./route/productRoute.js";
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

mongodbConnect()
connectCloudinary()

app.use('/api/user', userRouter)
app.use('/api/product', productRoute)


app.get("/", (req, res) => {
      res.send("Shoppers server is running...")
});

app.listen(port, () => {
      console.log(`Server is Running on port : ${port}`)
})

