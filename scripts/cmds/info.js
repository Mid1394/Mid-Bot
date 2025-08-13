// scripts/cmds/info.js
const fs = require("fs");
const path = require("path");
let axios = null;
try { axios = require("axios"); } catch { /* axios not installed? we'll still send text */ }

const OWNER_UID = "100070726067257"; // <- your UID
const FALLBACK_AVATAR = "https://ui-avatars.com/api/?name=Furushim+Islam+Midun&size=512";

function safeReadJSON(p) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {}
  return {};
}

function countJsRec(dir) {
  try {
    if (!fs.existsSync(dir)) return 0;
    let total = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) total += countJsRec(full);
      else if (entry.isFile() && entry.name.endsWith(".js")) total++;
    }
    return total;
  } catch { return 0; }
}

async function getOwnerAvatar(tmpFile) {
  // Try Facebook Graph direct first; fall back to a generic avatar.
  const fbUrls = [
    // public graph (auto-redirects)
    `https://graph.facebook.com/${OWNER_UID}/picture?height=800&width=800`,
    `https://graph.facebook.com/${OWNER_UID}/picture?type=large`
  ];
  if (!axios) return null;
  for (const url of fbUrls) {
    try {
      const res = await axios.get(url, { responseType: "arraybuffer", maxRedirects: 5, timeout: 10000 });
      fs.writeFileSync(tmpFile, Buffer.from(res.data));
      return tmpFile;
    } catch {}
  }
  try {
    const res = await axios.get(FALLBACK_AVATAR, { responseType: "arraybuffer", timeout: 10000 });
    fs.writeFileSync(tmpFile, Buffer.from(res.data));
    return tmpFile;
  } catch {
    return null;
  }
}

module.exports = {
  config: {
    name: "info",
    version: "5.0.0",
    author: "Midun",
    role: 0,
    usePrefix: true,
    description: "Show bot system & owner info",
    guide: "{p}info",
    category: "For users",
    cooldowns: 3
  },

  onStart: async function (ctx) {
    const { message, api, event, threadsData, usersData } = ctx || {};
    try {
      const cwd = process.cwd();

      // Read config + version safely
      const conf = safeReadJSON(path.join(cwd, "config.json"));
      let botName = conf.BOTNAME || conf.botname || "Midun Bot";
      let systemPrefix = conf.PREFIX || conf.prefix || ".";
      let botVersion = "Unknown";
      try {
        const pkg = require(path.join(cwd, "package.json"));
        botVersion = pkg.version || "Unknown";
      } catch {}

      // Ping: try a cheap API call, else compute immediate
      let ping = 0;
      try {
        const t0 = Date.now();
        if (api && event?.senderID) {
          await api.getUserInfo(event.senderID);
        }
        ping = Date.now() - t0;
      } catch { ping = 0; }

      // Count modules (prefer live map; fall back to file system)
      let totalModules =
        (global?.GoatBot?.commands && global.GoatBot.commands.size) ||
        (global?.client?.commands && global.client.commands.size) || 0;
      if (!totalModules) {
        const cmdsDir = path.join(cwd, "scripts", "cmds");
        totalModules = countJsRec(cmdsDir);
      }

      // Users & groups: try multiple sources
      let totalUsers = 0;
      let totalGroups = 0;

      try {
        if (global?.data?.allUserID) totalUsers = global.data.allUserID.length;
        if (global?.data?.allThreadID) totalGroups = global.data.allThreadID.length;
      } catch {}

      try {
        if (!totalUsers && usersData?.getAll) {
          const u = await usersData.getAll();
          totalUsers = Array.isArray(u) ? u.length : (u?.length || u?.size || 0);
        }
      } catch {}

      try {
        if (!totalGroups && threadsData?.getAll) {
          const th = await threadsData.getAll();
          totalGroups = Array.isArray(th) ? th.length : (th?.length || th?.size || 0);
        }
      } catch {}

      // Box prefix (thread-specific) if available
      let boxPrefix = systemPrefix;
      try {
        if (threadsData?.get) {
          const data = await threadsData.get(event.threadID);
          boxPrefix = data?.data?.prefix || systemPrefix;
        }
      } catch {}

      // Uptime
      const up = Math.floor(process.uptime());
      const hours = Math.floor(up / 3600);
      const minutes = Math.floor((up % 3600) / 60);
      const seconds = up % 60;

      // Build message
      const msg =
`🍀----Huiii Puii 👀🤳----🍀

┏━━•❅•••❈•••❈•••❅•━━┓
    「 ${botName} 」
┗━━•❅•••❈•••❈•••❅•━━┛

______________________________

↓↓ 𝗥𝗢𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 ↓↓

» Prefix system: ${systemPrefix}
» Prefix box: ${boxPrefix}
» Bot Version: ${botVersion}
» Total Modules: ${totalModules}
» Ping: ${ping}ms

______________________________

↓↓ 𝗥𝗢𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ↓↓

NAME : Furushim Islam Midun
Owner Id link: https://www.facebook.com/share/1FufpxNvYt/

______________________________

----↓↓ 𝙍𝙤𝙗𝙤𝙩 𝙖𝙘𝙩𝙞𝙫𝙚 𝙩𝙞𝙢𝙚 ↓↓----

${hours} : ${minutes} : ${seconds} second(s)

______________________________

» TOTAL USERS: ${totalUsers}
» TOTAL GROUPS: ${totalGroups}
______________________________`;

      // Try to send with avatar; if anything fails, send text only
      let sent = false;
      try {
        const tmp = path.join(__dirname, `owner_${Date.now()}.jpg`);
        const file = await getOwnerAvatar(tmp);
        if (file && fs.existsSync(file)) {
          await message.reply({ body: msg, attachment: fs.createReadStream(file) });
          fs.unlink(file, () => {});
          sent = true;
        }
      } catch { /* ignore and fall back to text */ }

      if (!sent) await message.reply(msg);

    } catch (err) {
      console.error("info command error:", err);
      // Never crash — always reply something
      try {
        await ctx.message.reply("ℹ️ Bot is running. (Stats temporarily unavailable.)");
      } catch {}
    }
  }
};
