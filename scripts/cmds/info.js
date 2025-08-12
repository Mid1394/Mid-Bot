module.exports = {
    config: {
        name: "info",
        version: "2.0",
        author: "Midun",
        role: 0,
        usePrefix: true,
        description: "Show full information about Midun Bot and its owner",
        category: "For Users",
        cooldowns: 3
    },

    onStart: async function ({ api, event, threadsData, usersData }) {
        try {
            const botName = "Midun Bot";
            const adminName = "Midun";
            const adminFB = "https://facebook.com/your.profile.link"; // Change to your real FB link
            const prefix = ".";

            // 🔹 Get data directly from database (no undefined errors)
            let totalUsers = 0;
            let totalGroups = 0;

            try {
                totalUsers = await usersData.getAll();
                totalUsers = Array.isArray(totalUsers) ? totalUsers.length : 0;
            } catch (err) {
                totalUsers = 0;
            }

            try {
                totalGroups = await threadsData.getAll();
                totalGroups = Array.isArray(totalGroups) ? totalGroups.length : 0;
            } catch (err) {
                totalGroups = 0;
            }

            // 🔹 Uptime calculation
            const uptime = process.uptime(); // seconds
            const days = Math.floor(uptime / (3600 * 24));
            const hours = Math.floor((uptime % (3600 * 24)) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            const uptimeString =
                (days > 0 ? `${days}d ` : "") +
                (hours > 0 ? `${hours}h ` : "") +
                (minutes > 0 ? `${minutes}m ` : "") +
                `${seconds}s`;

            // 🔹 Bot ping (speed)
            const start = Date.now();
            await api.sendTypingIndicator(event.threadID);
            const ping = Date.now() - start;

            // 🔹 Final message
            const message =
`📢 ${botName} — Information
━━━━━━━━━━━━━━━━━━━━
👑 Owner: ${adminName}
🔗 Owner FB: ${adminFB}
📍 Prefix: ${prefix}

📊 Stats:
👥 Total Users: ${totalUsers}
💬 Total Groups: ${totalGroups}

⏳ Uptime: ${uptimeString}
⚡ Ping: ${ping}ms
━━━━━━━━━━━━━━━━━━━━
© 2025 ${adminName} | All rights reserved`;

            api.sendMessage(message, event.threadID, event.messageID);

        } catch (error) {
            api.sendMessage("❌ An error occurred while fetching bot info. Please try again later.", event.threadID, event.messageID);
            console.error("[INFO COMMAND ERROR]:", error);
        }
    }
};
