
const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', mode: 'simple' });
});

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Helpdesk Safe Mode</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ Server is RUNNING!</h1>
                <p>The website is live on Hostinger.</p>
                <hr/>
                <p>Status: <strong>Safe Mode (Database Disconnected)</strong></p>
                <p>If you see this, your Deployment settings are correct.</p>
            </body>
        </html>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Simple Server running on port ${PORT}`);
});
