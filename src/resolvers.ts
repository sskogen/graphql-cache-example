import {getAllBooksCached, getAuthorCached} from "./services.js";
import {Author, Book, Resolvers} from "./__generated__/resolvers-types";
import {ContextCache} from "./index";

const withContextCache = (fn) => async (context: ContextCache, params?: any) => {
    const { cache } = context;
    const key = `${fn.name}(${params ? JSON.stringify(params) : ""})`;
    if (cache[key]) {
        return cache[key];
    }
    const result = await fn(params);
    cache[key] = result;
    return result;
};

export const resolvers : Resolvers = {
    Query: {
        books: async (_, __, context): Promise<Book[]> => {
            return await withContextCache(getAllBooksCached)(context);
        }
    },
    Book: {
        author: async (parent, __, context): Promise<Author> => {
            return await withContextCache(getAuthorCached)(context, parent.author_id);
        }
    },
    Author: {
        books: async (parent, __, context): Promise<Book[]> => {
            const allBooks: Book[] = await withContextCache(getAllBooksCached)(context);
            return allBooks.filter(book => parent.book_ids.includes(book.id));
        }
    }
};
