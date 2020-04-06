const { GraphQLServer } = require('graphql-yoga');

/**
 * 
 * root: Información del server de gql
 * params: datos que envia el cliente y se definen en el type defs
 * context: objeto por el cual se comunican los resolvers
 * info: el query que se ejecutó por el cliente
 * 
 */

const typeDefs = `
    type Query{
        hello(name: String!): String!
        getUsers:[User]!
        getUser(id: ID!): User!
    }
    type Mutation{
        createUser(name:String!,age:Int!): User!
        deleteUser(id: ID!): String!

    }
    type User{
        id:Int!
        name:String!
        age:Int!
    }
`;

const users = [
    {id: 1, name: 'Jorge', age: 26 },
    {id: 2, name: 'Dina', age: 29 }
];
const resolvers = {

    Query:{
        hello: (root, params, context, info) => `Hola ${params.name} 
        - Root: ${root}  
        - Context: ${JSON.stringify(context)}
        - Info: ${JSON.stringify(info)}
        `,
        getUsers: () => users,
        getUser: ( {id}) => users.find(u => u.id == id),
    },

    Mutation:{
        createUser: (_, { name,  age}) => {
            let user = {
                id: users.length + 123214,
                name,
                age,
            };
            users.push(user);
            return user;
        },
        deleteUser: (_, { id }) => {
            let indexUserToDelete = users.findIndex(user =>  user.id === id);
            users.splice(indexUserToDelete, 1);
            return `Usuario con ID: ${id} Eliminado Exitosamente`;
        }
    },

};


const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: {
        a: 'Mali'
    }
});

server.start(()=> console.log('Server running on port 4000'));