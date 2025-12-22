require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./backend/config/database');

// Initialize app
const app = express();

console.log('-----------------------------------');
console.log('🚀 Starting APP.JS (Hostinger File)...');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log('-----------------------------------');

// Health Check Route (No DB dependency)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', server_time: new Date() });
});

// Middleware to ensure DB is connected (especially for Serverless)
app.use(async (req, res, next) => {
    if (require.main !== module) {
        await connectDB();
    }
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));

app.use('/api/employees', require('./backend/routes/employees'));
app.use('/api/projects', require('./backend/routes/projects'));
app.use('/api/tickets', require('./backend/routes/tickets'));
app.use('/api/announcements', require('./backend/routes/announcements'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/admin', express.static(path.join(__dirname, 'frontend/admin')));

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/admin/index.html'));
});

// Root route - Serve Employee Portal Index (was frontend/index.html)
app.get('/', (req, res) => {
    console.log('📄 Root route hit - sending index.html');
    const indexPath = path.join(__dirname, 'frontend/index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('❌ Frontend Error:', err);
            res.status(500).send(`<h1>Startup Error</h1><p>Failed to load frontend.</p><pre>${err.message}</pre><p>Path: ${indexPath}</p>`);
        } else {
            console.log('✅ index.html sent successfully');
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }

    if (err.name === 'CastError') {
        return res.status(404).json({
            success: false,
            message: 'Resource not found'
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

// Connect to database and then start server
// Connect to database and then start server
if (require.main === module) {
    // 1. Start Server IMMEDIATELY to satisfy Hostinger Health Checks
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('-----------------------------------');
        console.log(`✅ Server is running on port: ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('-----------------------------------');
    });

    // 2. Connect to Database in Background
    connectDB().then(() => {
        console.log('✅ Database connected successfully after server start');
    }).catch(err => {
        console.error('❌ Failed to connect to Database (Background process):', err);
        // Do NOT exit process, just log error so server stays alive for logs
    });
} else {
    // For Serverless environment
    connectDB();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

module.exports = app;
