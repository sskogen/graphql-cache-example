const promiseCache = new Map();

function memoizeAsyncFunction(fn) {
    return async function(...args) {
        const key = JSON.stringify(args);

        if (!promiseCache.has(key)) {
            // Cache the promise, not the result
            promiseCache.set(key, fn(...args).finally(() => {
                // Remove the promise from the cache when it's settled (either resolved or rejected)
                promiseCache.delete(key);
            }));
        }
        return promiseCache.get(key);
    };
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function getAllBooks() {
    console.log("getAllBooks");
    await sleep(2000);
    return [
        {
            id: 1,
            title: "The Awakening",
            author_id: 1
        },
        {
            id: 2,
            title: "City of Glass",
            author_id: 2
        },
        {
            id: 3,
            title: "The Demon",
            author_id: 2
        }
    ];
}
export const getAllBooksCached = memoizeAsyncFunction(getAllBooks);

export async function getAuthor(author_id: number) {
    console.log("getAuthor", author_id);
    await sleep(1000);
    if (author_id === 1) {
        return {
            id: 1,
            name: "Kate Chopin",
            book_ids: [1]
        };
    } else {
        return {
            id: 2,
            name: "Kafka",
            book_ids: [2, 3]
        };
    }
}

export const getAuthorCached = memoizeAsyncFunction(getAuthor);