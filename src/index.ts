import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone'
import {KeyvAdapter} from "@apollo/utils.keyvadapter";
import Keyv from "keyv";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import {resolvers} from "./resolvers.js";
import {readFileSync} from "fs";
import {fileURLToPath} from "node:url";
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const typeDefs = readFileSync(join(__dirname, './schema.graphql'), { encoding: 'utf-8' });


export interface ContextCache {
    cache: Map<string, any>;
}
const contextFunction = async (): Promise<ContextCache>  => {
    const cache = new Map();
    return { cache };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: new KeyvAdapter(new Keyv("redis://localhost:6379")),
    plugins: [responseCachePlugin()]
});

const {url} = await startStandaloneServer(server, {listen: {port: 4000}, context: contextFunction});

console.log(`🚀 Server listening at: ${url}`);
