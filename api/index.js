import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoute from './routes/users.js'
import videoRoute from './routes/videos.js'
import commentRoute from './routes/comments.js'
import authRoute from './routes/auth.js'
import cookieParser from 'cookie-parser';

const app = express();


dotenv.config();

app.use(express.json()) // activo el json

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log(err));

  
  app.use(cookieParser())
  app.use('/users', userRoute)
  app.use('/videos', videoRoute)
  app.use('/comments', commentRoute)
  app.use('/auth', authRoute)
 

//   app.use((error, req, res, next))

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
