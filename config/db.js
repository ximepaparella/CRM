const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useFindAndModify: false,
      //   useCreateIndex: true,
    });
    console.log("DB conectada");
  } catch (error) {
    console.log("Hubo un error");
    console.log(error);
    process.exit(1); // si hay error detengo la aplicación
  }
};

module.exports = connectDB;
