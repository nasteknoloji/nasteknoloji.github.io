const fs = require("fs");
const path = require("path");
const { io } = require("socket.io-client");

const SOCKET_URL = "wss://hrmsocketonly.haremaltin.com";

const TARGET_PATH =
  "assets/files/R4e415320426f727361/DovizKapanisFiyat.json";

const SYMBOLS = ["USDTRY", "ALTIN"];

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

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});

socket.on("price_changed", (payload) => {
  try {
    const prices = {};

    SYMBOLS.forEach((symbol) => {
      if (payload.data[symbol]) {
        prices[symbol] = parseFloat(payload.data[symbol].satis);
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

    console.log("✅ Opening prices written:", output);

    socket.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Data parse error:", err);
    process.exit(1);
  }
});
