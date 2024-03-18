import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from '@apollo/server/standalone'

import { typeDefs } from "./schema.js";
import db from './_db.js'


const resolvers ={
    Query: {
        games() {
        return db.games
        },
        game(_,args){
            return db.games.find((game) => game.id === args.id)
        },
        authors() {
            return db.authors
        },
        author(_,args){
            return db.authors.find((author) => author.id === args.id)
        },
        reviews() {
            return db.reviews
        },
        review(_,args){
            return db.reviews.find((review) => review.id === args.id)
        }
    },
    Game: {
        reviews(parent){
            return db.reviews.filter((review) => parent.id === review.game_id)
        },
    },
    Author: {
        reviews(parent){
            return db.reviews.filter((review) => parent.id === review.author_id)
        }
    },
    Review: {
        author(parent){
            return db.authors.find((author) => author.id === parent.author_id)
        },
        game(parent){
            return db.games.find((game) => game.id === parent.game_id)
        }
    },
    Mutation: {
        deleteGame(_,args){
            const db_games = db.games.filter((game)=> game.id !== args.id)
            return db_games
        },
        addGame(_,args){
            const game = {id: Math.floor(Math.random()*1000), ...args.game}
            db.games.push(game)
            return game
        },
        updateGame(_,args){
            db.games = db.games.map((game)=>{
                if(game.id === args.id){
                    return {...game,...args.game}
                }

                return game
            })

            return db.games.find((game)=> game.id == args.id)
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server,{
    listen: {port:4000}
})

console.log('Server ready at port', 4000)
