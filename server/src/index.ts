("use strict");
const { Server } = require("socket.io"); // Use CommonJS syntax

module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap(/*{ strapi }*/) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", function (socket) {
      socket.on("join", ({ username, sessionId }) => {
        console.log("user connected");
        console.log("username is ", username);
        if (username) {
          socket.join(sessionId);
        } else {
          console.log("An error occurred");
        }
      });

      socket.on("sendMessage", async (data) => {
        const axios = require("axios");
        const userMessageData = {
          data: {
            senderType: "USER",
            text: data.text,
            session: data.sessionId,
          },
        };

        const serverMessageData = {
          ...userMessageData,
          data: {
            ...userMessageData.data,
            senderType: "SERVER",
          },
        };

        await axios
          .post("http://localhost:1337/api/messages", userMessageData)
          .then(() => {
            socket.broadcast
              .to(data.sessionId)
              .emit("message", userMessageData);
          })
          .catch((e) => console.log("error", e.message));

        await axios
          .post("http://localhost:1337/api/messages", serverMessageData)
          .then(() => {
            socket.broadcast
              .to(data.sessionId)
              .emit("message", serverMessageData);
          })
          .catch((e) => console.log("error", e.message));
      });
    });
  },
};
