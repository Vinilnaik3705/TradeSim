const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/tradesim';

        // Fix for unencoded special characters in password (specifically @)
        // If the URI contains multiple @ symbols in the authority section, we assume the last one is the host separator
        if (uri.includes('mongodb+srv://') && uri.split('@').length > 2) {
            try {
                const protocol = 'mongodb+srv://';
                const parts = uri.substring(protocol.length).split('/');
                const authAndHost = parts[0];
                const cleanAuthAndHost = authAndHost.split('?')[0]; // Handle case where / is missing but ? starts queries (unlikely in valid URI but possible in malformed)

                const lastAtIndex = cleanAuthAndHost.lastIndexOf('@');
                if (lastAtIndex !== -1) {
                    const credentials = cleanAuthAndHost.substring(0, lastAtIndex);
                    const host = cleanAuthAndHost.substring(lastAtIndex + 1);

                    const firstColonIndex = credentials.indexOf(':');
                    if (firstColonIndex !== -1) {
                        const username = credentials.substring(0, firstColonIndex);
                        const password = credentials.substring(firstColonIndex + 1);

                        // Check if password isn't already encoded (heuristic: contains @ but not %)
                        // Actually, safer to always encodeURIComponent the password component if we reconstructed it
                        // But standard encodeURIComponent encodes everything. We just need to ensure the URI format is valid.

                        // Reconstruct URI with encoded password
                        // We decodeFirst to avoid double encoding if it was partially encoded, essentially normalizing it.
                        const encodedPassword = encodeURIComponent(decodeURIComponent(password));

                        uri = `${protocol}${username}:${encodedPassword}@${host}`;
                        if (parts.length > 1) {
                            uri += '/' + parts.slice(1).join('/');
                        }
                        console.log('⚠️  Detected and fixed unencoded characters in MongoDB connection string.');
                    }
                }
            } catch (e) {
                console.error('Failed to auto-fix URI:', e.message);
            }
        }

        console.log(`Attempting to connect to MongoDB with URI: ${uri.replace(/:([^:@]+)@/, ':****@')}`); // Mask credentials

        await mongoose.connect(uri, {
            // New Mongoose 6+ defaults render these options unnecessary but adding for clarity if using older versions or specific needs
            // useStylesParser and useUnifiedTopology are now default true
        });

        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`❌ Error : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
