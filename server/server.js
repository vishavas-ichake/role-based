const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/mongo');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",  // frontend origin
  credentials: true                 // allow cookies (JWT)
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.get('/', (req,res)=>{
  res.send("Server is running properly")
})
// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
});
