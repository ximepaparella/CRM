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
    role: String
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

  type Client {
    id: ID
    name: String
    lastName: String
    email: String
    password: String
    institutionName: String
    institutionType: String
    country: String
    jobPosition: String
    role: String
    created: String
    status: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
    institutionName: String!
    role: String!
  }

  input ClientInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
    institutionName: String!
    institutionType: String
    country: String!
    jobPosition: String!
    role: String
    vendor: ID
    status: String!
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

    #Clients
    getAllClients: [Client]
    getClientByVendor: [Client]
    getClient(id: ID!): Client
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User
    authUser(input: AuthInput): Token

    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    #Clients
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String
  }
`;

module.exports = typeDefs;
