const graphql = require("graphql");

const { GraphQLObjectType, GraphQlString } = graphql;

const TestObjectType = new GraphQLObjectType({
  name: "TestObject",
  fields: () => ({
    id: { type: GraphQlString },
    name: { type: GraphQlString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Test: {
      type: TestObjectType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args){
          
      }
    },
  },
});
