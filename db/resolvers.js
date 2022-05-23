const User = require("./../models/User");
const bcryptjs = require("bcryptjs");

//Resolvers
const resolvers = {
  Query: {
    obtenerCurso: () => "Algo",
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
  },
};

module.exports = resolvers;
