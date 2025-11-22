import express from 'express';
import cors from 'cors';
import TinyLinkRoutes from './routes/tinylink.routes.js';
import connectToDatabase from './server-config/database.js';

connectToDatabase()
const app=express();

// Middleware
app.use(cors({
    origin: '*',
    
}));
app.use(express.json());


// Health Check Endpoint
app.get('/healthz',(req,res)=>{
    return res.status(200).send({ "ok": true, "version": "1.0" });
});


app.use('/api/links',TinyLinkRoutes);



// Start the server
app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})