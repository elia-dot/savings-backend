require('dotenv').config()
const express = require('express') 

const cors = require('cors');
const app = express()

const connectDb = require('./utils/conectDb')
const userRouter = require('./routes/userRoutes')
const goalRouter = require('./routes/goalRoutes')
const savingRouter = require('./routes/savingRoutes')

app.use(express.json())
app.use(cors());
app.options('*', cors());

connectDb()

app.use('/users', userRouter)
app.use('/goals', goalRouter)
app.use('/savings', savingRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {console.log(`Server running on port ${3000}`)})