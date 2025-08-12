module.exports = {
    config: {
        name: "info",
        aliases: ["botinfo"],
        version: "1.0",
        author: "Midun",
        countDown: 5,
        role: 0,
        shortDescription: "Show bot system & owner info",
        longDescription: "Displays detailed information about the bot and its owner",
        category: "info",
        guide: {
            en: "{pn}"
        }
    },

    onStart: async function ({ message, api, event, commands, args, prefix }) {
        try {
            const namebot = "Midun Bot";
            const PREFIX = ".";
            const prefixBox = ".";
            const totalModules = commands?.size || 0;
            const dateNow = Date.now();
            const ping = Date.now() - dateNow;
            const hours = Math.floor(process.uptime() / 3600);
            const minutes = Math.floor((process.uptime() % 3600) / 60);
            const seconds = Math.floor(process.uptime() % 60);

            // Optional - Safe checks
            const totalUsers = global?.data?.allUserID?.length || 0;
            const totalGroups = global?.data?.allThreadID?.length || 0;

            const msg = `🍀----Huiii Puii 👀🤳----🍀

┏━━•❅•••❈•••❈•••❅•━━┓
「 ${namebot} 」
┗━━•❅•••❈•••❈•••❅•━━┛

______________________________

↓↓ 𝗥𝗢𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 ↓↓

» Prefix system: ${PREFIX}
» Prefix box: ${prefixBox}
» Total Modules: ${totalModules}
» Ping: ${ping}ms

______________________________

↓↓ 𝗥𝗢𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ↓↓

NAME : Furushim Islam Midun
Owner Id link: ☞ https://www.facebook.com/share/173egNEVhm/

______________________________

↓↓ 𝗥𝗼𝗯𝗼𝘁 𝗮𝗰𝘁𝗶𝘃𝗲 𝘁𝗶𝗺𝗲 ↓↓

${hours}h : ${minutes}m : ${seconds}s

______________________________

» TOTAL USERS: ${totalUsers}
» TOTAL GROUP: ${totalGroups}
______________________________`;

            message.reply(msg);

        } catch (error) {
            message.reply("❌ An error occurred while fetching bot info. (Safe mode enabled)");
            console.error(error);
        }
    }
};
