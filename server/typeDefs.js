export const typeDefs = `#graphql

    type Query {
        product(name: String!): Product
        products: [Product]
    }
    
    type Product {
        name: String!
    }
`;
