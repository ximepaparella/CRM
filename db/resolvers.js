const User = require("./../models/User");
const Product = require("./../models/Product");
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
    getAllProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProduct: async (_, { id }, ctx) => {
      //Check if Product Exists
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
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
    newProduct: async (_, { input }, ctx) => {
      try {
        const newProduct = new Product(input);
        // almacenar en la base de datos
        const result = await newProduct.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }, ctx) => {
      //Check if Product Exists
      let product = await Product.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }

      // save in database
      product = await Product.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return product;
    },
    deleteProduct: async (_, { id }, ctx) => {
      //Check if Product Exists
      let product = await Product.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }

      // Delete from database

      product = await Product.findOneAndDelete({ _id: id });
      return "Product Deleted";
    },
  },
};

module.exports = resolvers;
