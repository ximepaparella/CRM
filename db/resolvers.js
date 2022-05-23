// armo datos Mock para consultar con el resolver
const cursos = [
  {
    titulo: "Javacript Moderno Guía definitiva construye +10 proyectos",
    tecnologia: "Javacript ES6",
  },
  {
    titulo: "React- La guia completa: Hooks Context Redux MERN +15 Apps",
    tecnologia: "React",
  },
  {
    titulo: "Node.js - Bootcamp desarrollo web inc. MVC y REST APIs",
    tecnologia: "Node.js",
  },
  {
    titulo: "React JS Avazado - Fullstack React GraphQL y Apollo",
    tecnologia: "React",
  },
];

//Resolvers
const resolvers = {
  Query: {
    obtenerCursos: (_, { input }, ctx) => {
      const resultado = cursos.filter(
        (curso) => curso.tecnologia === input.tecnologia
      );
      return resultado;
    },
  },
};

module.exports = resolvers;
