const fs = require("fs");
const path = require("path");
const { io } = require("socket.io-client");

const SOCKET_URL = "wss://hrmsocketonly.haremaltin.com";

const TARGET_PATH =
  "assets/files/R4e415320426f727361/DovizKapanisFiyat.json";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  path: "/socket.io/",
  forceNew: true,
  reconnection: false
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err);
  process.exit(1);
});

socket.on("price_changed", (payload) => {
  try {
    if (!payload || !payload.data) {
      throw new Error("Payload data is empty");
    }

    const prices = {};

    Object.keys(payload.data).forEach((key) => {
      const item = payload.data[key];

      if (item && item.satis !== undefined && item.satis !== null) {
        const satis = parseFloat(item.satis);

        if (!isNaN(satis)) {
          prices[key] = satis;
        }
      }
    });

    const date = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Europe/Istanbul"
    });

    const output = {
      date,
      prices
    };

    fs.mkdirSync(path.dirname(TARGET_PATH), { recursive: true });

    fs.writeFileSync(
      TARGET_PATH,
      JSON.stringify(output, null, 2),
      "utf-8"
    );

    console.log(
      `✅ Opening prices written (${Object.keys(prices).length} items)`
    );

    socket.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Data parse error:", err);
    process.exit(1);
  }
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});
