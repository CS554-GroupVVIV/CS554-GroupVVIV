import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    product: async (_, args) => {
      return { name: args.name };
    },
  },
};
