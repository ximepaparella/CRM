const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

// Conectar a la DB
connectDB();

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    //console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET_WORD);
        // console.log(user);
        return {
          user,
        };
      } catch (error) {
        console.log("Hubo un error", error);
      }
    }
  },
});

// Start server
server.listen().then(({ url }) => {
  console.log(`Servidor listo en la URL ${url}`);
});
