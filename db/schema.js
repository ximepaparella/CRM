const { gql } = require("apollo-server");

//Schema
const typeDefs = gql`
  type User {
    id: ID
    name: String
    lastName: String
    email: String
    created: String
    institutionName: String
  }

  type Token {
    token: String
  }

  type Product {
    id: ID
    productName: String
    stock: Int
    price: Float
    created: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
    institutionName: String!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input ProductInput {
    productName: String!
    stock: Int!
    price: Float!
  }

  type Query {
    #Users
    getUser(token: String!): User

    #Products
    getAllProducts: [Product]

    getProduct(id: ID!): Product
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User
    authUser(input: AuthInput): Token

    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String
  }
`;

module.exports = typeDefs;
