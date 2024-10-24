import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
const model = require('./models/user')

// Enable CORS

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!); // No need to pass the options
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

// Initialize DB connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware (optional)
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
  });
});

app.post("/register", (req, res)=>{
  const data = new model({
      "name":req.body.name, 
      "email":req.body.email,
      "password":req.body.password
  })
  data.save().then(()=>res.send({"message":"data saved"})).catch((err: any)=>console.log(err))
})
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
