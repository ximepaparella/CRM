const User = require("./../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const createToken = (user, secret, expiresIn) => {
  //console.log(user);
  const { id, email, name, lastName } = user;
  return jwt.sign({ id, email, name, lastName }, secret, { expiresIn });
};

//Resolvers
const resolvers = {
  Query: {
    getUser: async (_, { token }, ctx) => {
      const userId = await jwt.verify(token, process.env.JWT_SECRET_WORD);
      return userId;
    },
  },
  Mutation: {
    newUser: async (_, { input }, ctx) => {
      const { email, password } = input;
      const userExists = await User.findOne({ email });
      console.log(userExists);
      // Revisar si el usuario ya esta registrado
      if (userExists) {
        throw new Error("El usuario ya esta registrado");
      }

      //Hashear password
      const salt = await bcryptjs.genSaltSync(10);
      input.password = await bcryptjs.hash(password, salt);

      //Guardar en la DB (try catch para capturar si hay error)
      try {
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    authUser: async (_, { input, ctx }) => {
      const { email, password } = input;

      // Check user exists
      const userExists = await User.findOne({ email });
      if (!userExists) {
        throw new Error("El usuario no está registrado");
      }

      // Check correct password
      const correctPassword = await bcryptjs.compare(
        password,
        userExists.password
      );

      if (!correctPassword) {
        throw new Error("El password es incorrecto");
      }

      // Create token
      return {
        // createToken(User (get in userExists), ENV de Secret Word, Expiration Time)
        token: createToken(userExists, process.env.JWT_SECRET_WORD, "24h"),
      };
    },
  },
};

module.exports = resolvers;
