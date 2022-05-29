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

  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    client: ID
    vendor: ID
    created: String
    state: OrderStatus
  }

  type OrderGroup {
    id: ID
    quantity: Int
  }

  type TopClient {
    total: Float
    client: [Client]
  }

  type TopVendor {
    total: Float
    vendor: [User]
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

  input OrderProductInput {
    id: ID
    quantity: Int
  }

  input OrderInput {
    order: [OrderProductInput]
    total: Float
    client: ID!
    state: OrderStatus
  }

  enum OrderStatus {
    Pending
    Completed
    Canceled
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

    #Orders
    getAllOrders: [Order]
    getOrderByVendor: [Order]
    getOrder(id: ID!): Order
    getOrderByState(state: String!): [Order]

    #Advanced Searchs
    bestClients: [TopClient]
    bestVendors: [TopVendor]
    searchProduct(text: String!): [Product]
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

    #Orders
    newOrder(input: OrderInput): Order
    updateOrder(id: ID!, input: OrderInput): Order
    deleteOrder(id: ID!): String
  }
`;

module.exports = typeDefs;
