const graphql = require("graphql");
const db = require("../queries");

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// Type
const TestObjectType = new GraphQLObjectType({
  name: "TestObject",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

// Query for users
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    test: {
      type: TestObjectType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args) {
        try {
          const res = await db.query(
            `SELECT * FROM TESTTABLE WHERE id = ${args.id}`
          );
          db.end();
          return res.rows[0];
        } catch (error) {
          throw error;
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
