const User = require("./../models/User");
const Product = require("./../models/Product");
const Client = require("./../models/Client");
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
    getAllClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClientByVendor: async (_, {}, ctx) => {
      try {
        const clients = await Client.find({
          vendor: ctx.user.id.toString(),
        });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      //Check if Client exists
      const client = await Client.findById(id);
      if (!client) {
        throw new Error("The client doesn't exists");
      }

      // Show only to correct vendor
      if (client.vendor.toString() !== ctx.user.id) {
        throw new Error("You don't have access to this client information");
      }
      return client;
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
    newClient: async (_, { input }, ctx) => {
      console.log(ctx);
      // check if client exists
      const { email } = input;
      const client = await Client.findOne({ email });
      if (client) {
        throw new Error("The client is already register");
      }
      const newClient = new Client(input);

      // asignar al vendedor
      newClient.vendor = ctx.user.id;

      // guardar en la DB
      try {
        const result = await newClient.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      //Check if Client Exists
      let client = await Client.findById(id);
      if (!client) {
        throw new Error("Client not found");
      }

      //Check if the editor is the correct Vendor
      if (client.vendor.toString() !== ctx.user.id) {
        throw new Error("You don't have access to this client information");
      }

      // save in database
      client = await Client.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return client;
    },
    deleteClient: async (_, { id }, ctx) => {
      //Check if client exists
      let client = await Client.findById(id);
      if (!client) {
        throw new Error("Client not found");
      }

      //Check if the editor is the correct Vendor
      if (client.vendor.toString() !== ctx.user.id) {
        throw new Error("You don't have access to this client information");
      }

      // save in database
      client = await Client.findOneAndDelete({ _id: id });
      return "Client deleted";
    },
  },
};

module.exports = resolvers;
