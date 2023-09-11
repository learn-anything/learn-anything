Create/Read/Update/Delete functions for EdgeDB.

To be used from Grafbase resolvers.

Some functions are prefixed with `public..` to make it easier to know what to call from grafbase resolvers. As grafbase resolvers are either public (no auth token needed) or private (hanko token is first validated, then email is retrieved and edgedb mutations are used in context of extracted email address).
