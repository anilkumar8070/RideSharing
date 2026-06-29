const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// db config
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/auth.routes');
const rideRoutes = require('./routes/ride.routes');
const matchRoutes = require('./routes/match.routes');
const reviewRoutes = require('./routes/review.routes');
const notificationRoutes = require('./routes/notification.routes');
const supportRoutes = require('./routes/support.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet()); // Set security HTTP headers

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/users', userRoutes);

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running...' });
});

// Handle undefined routes
app.use((req, res, next) => {
    const AppError = require('./utils/AppError');
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

// Initialize Socket.io
const initializeSocket = require('./config/socket');
initializeSocket(server);

// Port configuration
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
