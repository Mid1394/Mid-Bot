module.exports = {
    config: {
        name: "info",
        aliases: ["botinfo"],
        version: "2.0",
        author: "Midun",
        countDown: 5,
        role: 0,
        shortDescription: "Show bot system & owner info",
        longDescription: "Displays detailed information about the bot, owner, and performance",
        category: "info",
        guide: {
            en: "{pn}"
        }
    },

    onStart: async function ({ message, api, event, client }) {
        try {
            const start = Date.now();
            await api.getUserInfo(event.senderID); // ping measure
            const ping = Date.now() - start;

            // Fetch bot stats
            const totalModules = client?.commands ? client.commands.size : 0;
            const totalUsers = global?.data?.allUserID?.length || 0;
            const totalGroups = global?.data?.allThreadID?.length || 0;

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

            // Owner profile pic (your UID)
            const ownerID = "100070726067257";
            const ownerPic = `https://graph.facebook.com/${ownerID}/picture?height=500&width=500&access_token=6628568379%7C6a2e1b3c0230f1d3275f04a0ea4b09d8`;

            message.reply({
                body: msg,
                attachment: await global.utils.getStreamFromURL(ownerPic)
            });

        } catch (error) {
            message.reply("❌ An error occurred while fetching bot info.");
            console.error(error);
        }
    }
};
