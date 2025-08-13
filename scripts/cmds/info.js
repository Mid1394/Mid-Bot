const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "info",
        aliases: ["botinfo"],
        version: "4.5",
        author: "Midun",
        countDown: 5,
        role: 0,
        shortDescription: "Show bot system & owner info",
        category: "info",
    },

    onStart: async function ({ message, api, event }) {
        try {
            // Detect bot version from package.json
            let botVersion = "Unknown";
            try {
                const pkg = require(path.join(process.cwd(), "package.json"));
                botVersion = pkg.version || "Unknown";
            } catch { /* ignore */ }

            // Calculate ping
            const startPing = Date.now();
            await api.getUserInfo(event.senderID);
            const ping = Date.now() - startPing;

            // Stats
            let totalModules = global.client?.commands?.size || 0;
            let totalUsers = global.data?.allUserID?.length || 0;
            let totalGroups = global.data?.allThreadID?.length || 0;

            // Uptime
            const hours = Math.floor(process.uptime() / 3600);
            const minutes = Math.floor((process.uptime() % 3600) / 60);
            const seconds = Math.floor(process.uptime() % 60);

            // Info message
            const msg = `🍀----Huiii Puii 👀🤳----🍀

┏━━•❅•••❈•••❈•••❅•━━┓
「 Midun Bot 」
┗━━•❅•••❈•••❈•••❅•━━┛

↓↓ 𝗥𝗢𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 ↓↓

» Prefix system: .
» Prefix box: .
» Bot Version: ${botVersion}
» Total Modules: ${totalModules}
» Ping: ${ping}ms

↓↓ 𝗥𝗢𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ↓↓

NAME: Furushim Islam Midun
Owner FB: https://www.facebook.com/100070726067257

↓↓ 𝗥𝗼𝗯𝗼𝘁 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 ↓↓

${hours}h : ${minutes}m : ${seconds}s

↓↓ 𝗦𝗧𝗔𝗧𝗦 ↓↓

» TOTAL USERS: ${totalUsers}
» TOTAL GROUPS: ${totalGroups}
______________________________`;

            // Facebook Profile Picture
            const imgPath = path.join(__dirname, "owner.jpg");
            const ownerPicURL = `https://graph.facebook.com/100070726067257/picture?height=800&width=800&access_token=6628568379%7C2a17c5bd1eec4a6d5b0706e1d6e0c00f`;

            try {
                const response = await axios.get(ownerPicURL, {
                    responseType: "arraybuffer",
                    maxRedirects: 5
                });
                fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));
            } catch (err) {
                console.error("PFP fetch failed:", err.message);
                // fallback image
                const fallback = "https://i.imgur.com/uHcVv.png";
                const res = await axios.get(fallback, { responseType: "arraybuffer" });
                fs.writeFileSync(imgPath, Buffer.from(res.data, "binary"));
            }

            // Send message with attachment
            message.reply({
                body: msg,
                attachment: fs.createReadStream(imgPath)
            }, () => {
                fs.unlinkSync(imgPath); // cleanup
            });

        } catch (error) {
            console.error("Error in .info:", error);
            message.reply("❌ Could not fetch bot info, but bot is still running fine.");
        }
    }
};
