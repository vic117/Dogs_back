require( 'dotenv' ).config();
const { GraphQLServer } = require('graphql-yoga');
const { importSchema } = require('graphql-import');
// const resolvers = require('./src/resolvers');
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true});
const mongo =  mongoose.connection;

mongo.on('error', (error) => console.log(error))
    .once('open',() => console.log('Connected to database'));

const typeDefs = importSchema(__dirname + '/schema.graphql');

   
const users = [];

const resolvers = {
    Query:{
        hello:(root,params,context,info) => `Hola ${params.name}`,//interpolacion
        getUsers:(root,params,context,info) => users,
       
    },
    Mutation:{
        createUser:(root,params,context,info) => {
            const user  = {id:users.length+1,name:params.name,age:params.age};
            users.push(user);
            return user;
        },
    }
};


const server = new GraphQLServer({typeDefs, resolvers});//schema de graphql

server.start(() => console.log('Works in port 4000 :)'));
