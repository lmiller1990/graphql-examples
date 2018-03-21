## Introduction

GraphQL is... 
- a query language for your API
- a server side runtime for executing queries, where you define a type system for your data

A GraphQL service is created by...
- defining types and fields on your backend
- providing functions for each field on each type

### Example: A service to check the logged in user

```
# query definition
type Query {
  me: User
}

type User {
  id: ID,,
  name: String
}
```

```
# functions
function Query_me(req) {
  return request.auth.user
}

function User_name(user) {
  return user.getName()
}
```

Once the service is running, it can be send a query to validated and execute. A query that uses the above type and functions:

```
# query that corresponds to the User_name function
# since we are only requesting the name field, the JSON response will only include that.
{
  me {
    name
  }
}

# response
{
  "me": {
    "name": "test_user"
  }
}
```

## Queries and Mutations

### Fields

At its most fundamental level, GraphQL is about asking for specific fields on objects. Here is another simple example:

```
# query
{
  role {
    name 
  }
}

# result
{
  "data": {
    "role": {
      "name": "top"
    }
  }
}
```

The result has __the same shape__ as the query. This is one of the fundamental concepts of GraphQL - the server knows exactly what fields the client is asking for. In contrast to REST, where the endpoint simply returns a preset data structure, regardless of the query shape or parameters.

We are just asking for the name of a champion - a String, but we can also ask for Objects. For example:

```
# query
{
  role {
    name
    champions
  }
}

# result
{
  "data": {
    "role": {
      "name": "top",
      "champions": [
        { 
          "name": "riven" 
        },
        { 
          "name": "malphite" 
        }
      ]
    }
  }
}
```

### Arguments

So far, some great ideas are already emerging from GraphQL. This is just the start. What if we want to specify some more options, or limit the result in some way? We can pass arguments:


```
# query
{
  champion(id: 1) {
    name
    attackDamage
    attackSpeed
  }
}

# result
{
  "data": {
    "champion": {
      "name: "ashe",
      "attackSpeed: "0.6",
      "attackDamage: "65"
    }
  }
}
```

### Aliases

What if we wanted the data for two fields with same name? 

```
# query
{
  champion(id: 1) {
    name
  }
  champion(id: 2) {
    name
  }
}

# result
{
  "data": {
    "champion": {
      "name: "ashe"
    },
    "champion": {
      "name: "vayne"
    }
  }
}
```

We have a problem - conflicting keys. What does `data.champion` return? GraphQL lets us provide aliases to solve this problem:

```
# query
{
  firstChampion: champion(id: 1) {
    name
  }
  secondChampion: champion(id: 2) {
    name
  }
}

# result
{
  "data": {
    "firstChampion": {
      "name: "ashe"
    },
    "secondChampion": {
      "name: "vayne"
    }
  }
}
```

### Fragments

If our app becomes complex, queries can get long and complicated. GraphQL provides __fragments__ to solve this problem. Fragments are predefined sets of fields, which can be used in queries when needed. 

Let's say we have a page in where the user can compare two champions and their items side by side. We can simplify the query like this:

```
{
  leftComparison: champion(role: ADC) {
    ...comparisonFields
  }
  rightComparison: champion(role: TOP) {
    ...comparisonFields
  }
}

fragment comparisonFields on Champion {
  name
  items {
    name
  }
}

# result
{
  "data": {
    "leftComparison": {
      "name": "ashe",
      "items": [
        { "name": "infinite edge" },
        { "name": "last whispher" } 
      ]
    },
    "rightComparison": {
      "name": "malphite",
      "items": [
        { "name": "sunfire cape" },
        { "name": "ninja tabi" } 
      ]
    }
  }
}
```

### Operation Name

Until now, we were omitting the operation __type__ and __name__. Here's how to specify both. `query` is the operation __type__ and `ChampionAndItems` is the operation __name__.

```
query ChampionAndItems {
  champion {
    name
    items {
      name
    }
  }
}
```

There are two other types - __mutation__ and __subscription__.

### Variables
  
So far we have been hard coding all the arguments in the query. However, most of the time the arguments will be dynamic - for example, some data from a form or a dropdown. GraphQL provides a nice syntax for to do this. These dynamic values are called __variables__.

To use a variable, three things are necessary:

1. Replace the static value with `$variableName`.
2. Declare `$variableName` as one of the variables accepted by the query.
3. Pass `variableName: value` in the query dictionary (usually JSON).

```
# query
# declare as an accepted variable
# `Role` is the __type__
query ChampionAndItems($role: Role) { 
  champion(role: $role) {
    name
    items {
      name
    }
  }
}

# variables
{
  "role": "ADC"
}

# response
{
  "data": {
    "name": "ashe",
    "items": [ /* ... */ ]
  }
}
```

`$role: Role` is an optional argument. Including a `!` after the variable makes it required. `$role: Role!`. It is also possible to include default variables: `$role: Role = 'ADC'`.

### Directives

Variables let us manipulate the properties in a dynamic fashion, but sometimes it is useful to change the shape of the query in the same way. This is where directives come in. Perhaps we want showing a champion's `items` optional.

```
query Champion($role: Role, $withItems: Boolean!) {
  champion(role: $role) {
    name
    # only include `items` in the query if `$withItems` is `true`
    items @include(if: $withItems) {
      name
    }
  }
}
```

The GraphQL spec defines two directives: `@include(if: Boolean)`, as shown above, and `@skip(if: Boolean)`.

## Mutations

So far we have only discussed fetching data. Now let's look at how to modify server side data.

Just like queries, you can request nested fields if the mutation returns an object.

``` 
# mutation
mutation AddMatchupForChampion($champion: Champion, $matchup: MatchupInput!) {
  createMatchupNote(champion: $champion, matchup: $matchup) {
    note
    opposingChampion
  }
}

# variables
{
  "champion": "ASHE",
  "matchup": {
    "note": "It's going to be tough. But you win lategame",
    "opposingChampion": "LUCIAN"
  }
}

# result
{
  "data": {
    "createMatchupNote": {
      "note": "It's going to be tough. But you win lategame",
      "opposingChampion": "LUCIAN"
    }
  }
}
```

We get the newly created matchup in the response.




 CREATE TABLE notes (
    -> id int NOT NULL AUTO_INCREMENT,
    -> title varchar(255),
    -> content text,
    -> PRIMARY KEY (id)
    -> );
