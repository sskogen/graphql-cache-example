# Apollo Server 4 + Redis cache + TypeScript and codegen

This is an example of how to use the new caching features of Apollo Server 4 with Redis, in addition to other performance improvements,
such as context caching and memoization of async fetches. This is especially useful when wrapping external REST APIs, where you want to
mimize the number of requests.

Also, this example uses TypeScript and codegen to generate types for the GraphQL schema and the resolvers. The schema or types can then be shared with the client for end-to-end type safety and better developer experience with autocompletion. 

## Prerequisites
You need a redis-server running locally on port 6379

## Run locally

```shell
npm install
npm start
```

Then open the GraphQL Playground (http://localhost:4000)


## Performance improvements

### Redis cache

Using an external cache like Redis is especially useful when you have multiple instances of your server running, so that the cache is shared between them.
This allows for stateless servers where session ids 


### Context caching

When queries are executed, the context is passed to all resolvers. This means that you can use the context to cache data that is used by multiple resolvers.

### Memoization

The resolvers for different fields might end up calling the same backend service with identical parameters. Memoization ensures that these redundant calls are merged into one.

### Example

```graphql
query ExampleQuery {
  books {
    title
    author {
      name
      book_ids
      books {
        title
        author {
          name
        }
      }
    }
  }
}
```

This query will result in 3 calls to the backend service (mocked), one for books and one for each of two authors. Despite the fact that the author is fetched on multiple levels, the backend service is only called once for each author, because of memoization and context caching.
The schema indicates that books and authors are cached for 5 seconds with the @cacheControl directive, so that subsequent calls withing that time-to-live will be served from the cache. Regardless of how deep the query is, the backend service will only be called once for all books and once for each author.


