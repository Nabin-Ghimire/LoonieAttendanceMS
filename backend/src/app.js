import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import attendanceRoute from './routes/attendance.js'
import officeRoute from './routes/office.js'

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://loonieattendancemsfrontend3.onrender.com"
        ],
        credentials: true,
    })
);




app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/attendance', attendanceRoute)
app.use('/api/office', officeRoute);
app.get('/', (req, res) => {
    res.send('Welcome to LoonieTech Attendance Management System');
});


app.use(globalErrorHandler);

export default app;
