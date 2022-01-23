const graphql = require("graphql");
const db = require("../queries");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Type
const BookObjectType = new GraphQLObjectType({
  name: "BookObject",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    price: { type: GraphQLFloat },
    author: {
      type: AuthorObjectType,
      async resolve(parent, args) {
        // Add Relation
        try {
          const res = await db.query(
            `SELECT * FROM AUTHOR WHERE id = ${parent.author_id}`
          );
          return res.rows[0];
        } catch (error) {
          throw error;
        }
      },
    },
  }),
});

const AuthorObjectType = new GraphQLObjectType({
  name: "AuthorObject",
  fields: () => ({
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookObjectType),
      async resolve(parent, args) {
        try {
          const res = await db.query(
            `SELECT * FROM BOOK WHERE author_id = ${parent.id}`
          );
          return res.rows;
        } catch (error) {
          throw error;
        }
      },
    },
  }),
});

// Query for users
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookObjectType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        try {
          const res = await db.query(
            `SELECT * FROM BOOK WHERE id = ${args.id}`
          );

          return res.rows[0];
        } catch (error) {
          throw error;
        }
      },
    },
    //-------------------
    author: {
      type: AuthorObjectType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        try {
          const res = await db.query(
            `SELECT * FROM AUTHOR WHERE id = ${args.id}`
          );

          return res.rows[0];
        } catch (error) {
          throw error;
        }
      },
    },
    //-------------------
    books: {
      type: new GraphQLList(BookObjectType),
      async resolve(parent, args) {
        try {
          const res = await db.query(`SELECT * FROM BOOK`);

          return res.rows;
        } catch (error) {
          throw error;
        }
      },
    },
    //-------------------
    authors: {
      type: new GraphQLList(AuthorObjectType),
      async resolve(parent, args) {
        try {
          const res = await db.query(`SELECT * FROM AUTHOR`);

          return res.rows;
        } catch (error) {
          throw error;
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorObjectType,
      args: {
        firstname: { type: new GraphQLNonNull(GraphQLString) }, // Non null = required
        lastname: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        try {
          await db.query(
            `INSERT INTO AUTHOR (firstname, lastname, age) VALUES ('${args.firstname}', '${args.lastname}', '${args.age}')`
          );

          return args;
        } catch (error) {
          throw error;
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
