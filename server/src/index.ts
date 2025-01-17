"use strict";
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

module.exports = {
  register(/*{ strapi }*/) {},

  bootstrap(/*{ strapi }*/) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", function (socket) {
      const token = socket.handshake.auth.token;
      const jwtSecret = process.env.JWT_SECRET;

      if (token) {
        jwt.verify(token, jwtSecret, async (err, decoded) => {
          if (err) {
            socket.disconnect();
            return;
          }

          const user = await strapi
            .query("plugin::users-permissions.user")
            .findOne({
              where: { id: decoded.id },
            });

          if (user) {
            socket.user = user;

            socket.on("join", ({ sessionId }) => {
              socket.join(sessionId);
            });

            socket.on("sendMessage", async (data) => {
              try {
                const createdUserMessage = await strapi
                  .documents("api::message.message")
                  .create({
                    data: {
                      senderType: "USER",
                      text: data.text,
                      session: data.sessionId,
                      user: socket.user.id,
                    },
                    status: "published",
                  });

                socket.broadcast
                  .to(data.sessionId)
                  .emit("message", createdUserMessage);

                const createdServerMessage = await strapi
                  .documents("api::message.message")
                  .create({
                    data: {
                      senderType: "SERVER",
                      text: data.text,
                      session: data.sessionId,
                      user: socket.user.id,
                    },
                    status: "published",
                  });

                socket.broadcast
                  .to(data.sessionId)
                  .emit("message", createdServerMessage);

                await strapi.documents("api::session.session").update({
                  documentId: data.sessionId,
                  data: {
                    lastMessage: data.text,
                  },
                  status: "published",
                });
              } catch (e) {
                console.log("Error saving message:", e.message);
              }
            });
          } else {
            socket.disconnect();
          }
        });
      } else {
        socket.disconnect();
      }
    });
  },
};
