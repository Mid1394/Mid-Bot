module.exports = {
    config: {
        name: "info",
        version: "1.0",
        author: "Midun",
        role: 4,
        usePrefix: true,
        description: "Give admin and bot information",
        category: "For users",
        cooldowns: 3
    },
    onStart: async function({ api, event, args, globalData, commands }) {
        const namebot = "Midun Bot";
        const prefix = ".";
        const dateNow = Date.now();

        // Uptime calculation
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // Message content
        const msg = `🍀---- ${namebot} ----🍀

┏━━•❅•••❈•••❈•••❅•━━┓

「 ${namebot} 」

┗━━•❅•••❈•••❈•••❅•━━┛ 

______________________________

↓↓ BOT SYSTEM INFO ↓↓

» Prefix System: Enabled
» Prefix: ${prefix}
» Total Commands: ${commands.size}
» Ping: ${Date.now() - dateNow}ms

______________________________

↓↓ BOT OWNER INFO ↓↓

Name: Furushim Islam Midun
Owner ID: https://www.facebook.com/share/173egNEVhm/

______________________________

----↓↓ BOT ACTIVE TIME ↓↓----

${hours}h : ${minutes}m : ${seconds}s

______________________________

» Total Users: ${globalData.allUserID.length}
» Total Groups: ${globalData.allThreadID.length}

______________________________`;

        // Send message
        api.sendMessage(msg, event.threadID, event.messageID);
    }
};
