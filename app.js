require('dotenv').config();
const app = require('./backend/server');
const connectDB = require('./backend/config/database');

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB().then(() => {
    // Start Server
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`-----------------------------------`);
        console.log(`🚀 Server running on PORT ${PORT}`);
        console.log(`-----------------------------------`);
    });
}).catch(err => {
    console.error('❌ Database Connection Failed:', err);
    // process.exit(1); // Keep it running so logs show the error
});
