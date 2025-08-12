const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "info",
        aliases: ["botinfo"],
        version: "3.0",
        author: "Midun",
        countDown: 5,
        role: 0,
        shortDescription: "Show bot system & owner info",
        longDescription: "Displays bot, owner, and performance info",
        category: "info",
        guide: { en: "{pn}" }
    },

    onStart: async function ({ message, api, event }) {
        try {
            const start = Date.now();
            await api.getUserInfo(event.senderID);
            const ping = Date.now() - start;

            // Fake values if not available
            const totalModules = 15; // change manually if needed
            const totalUsers = 320;  // change manually if needed
            const totalGroups = 12;  // change manually if needed

            const hours = Math.floor(process.uptime() / 3600);
            const minutes = Math.floor((process.uptime() % 3600) / 60);
            const seconds = Math.floor(process.uptime() % 60);

            const namebot = "Midun Bot";
            const PREFIX = ".";
            const prefixBox = ".";

            const msg = `🍀----Huiii Puii 👀🤳----🍀

┏━━•❅•••❈•••❈•••❅•━━┓
「 ${namebot} 」
┗━━•❅•••❈•••❈•••❅•━━┛

↓↓ 𝗥𝗢𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 ↓↓

» Prefix system: ${PREFIX}
» Prefix box: ${prefixBox}
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

            // Download profile picture to temp folder
            const imgPath = path.join(__dirname, "owner.jpg");
            const ownerPicURL = "https://graph.facebook.com/100070726067257/picture?height=500&width=500";
            const imgData = await axios.get(ownerPicURL, { responseType: "arraybuffer" });
            fs.writeFileSync(imgPath, Buffer.from(imgData.data, "binary"));

            message.reply({
                body: msg,
                attachment: fs.createReadStream(imgPath)
            }, () => fs.unlinkSync(imgPath)); // delete after sending

        } catch (error) {
            console.error(error);
            message.reply("❌ Bot info command failed. Check your internet or API permissions.");
        }
    }
};
