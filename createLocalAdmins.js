const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

const createDepartmentAdmins = async () => {
    try {
        // Connect to LOCAL Database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk');
        console.log('✅ Connected to Local DB');

        const admins = [
            {
                name: 'IT Support Admin',
                email: 'it.support@shubham.biz',
                password: 'password123',
                mobile: '1111111111',
                role: 'admin',
                department: 'IT', // Custom field if you plan to use logic later
                isActive: true
            },
            {
                name: 'ERP Support Admin',
                email: 'erp.support@shubham.biz',
                password: 'password123',
                mobile: '2222222222',
                role: 'admin',
                department: 'ERP',
                isActive: true
            }
        ];

        for (const admin of admins) {
            // Delete if exists to ensure password reset
            await User.deleteOne({ email: admin.email });

            await User.create(admin);
            console.log(`✅ Created Local Admin: ${admin.email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createDepartmentAdmins();
