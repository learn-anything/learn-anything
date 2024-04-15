from __future__ import annotations

import typing
from dataclasses import dataclass

import edgedb

@dataclass
class EdgeDBConnection:
    dsn: typing.Optional[str] = None
    host: typing.Optional[str] = None
    port: int = 0000
    admin: typing.Optional[bool] = False
    user: typing.Optional[str] = None
    password: typing.Optional[str] = None
    database: typing.Optional[str] = None
    timeout: int = 60

    def connect_sync(
            self,
            connection: typing.Optional[EdgeDBConnection] = None,
        ) -> edgedb.BlockingIOConnection:
            return edgedb.connect(
                dsn=self.dsn,
                host=self.host,
                port=self.port,
                admin=bool(self.admin),
                user=self.user,
                password=self.password,
                database=self.database,
                timeout=self.timeout,
            )
    
    async def connect_async(
        self,
        connection: typing.Optional[EdgeDBConnection] = None,
    ) -> edgedb.AsyncIOConnection:
        return await edgedb.async_connect(
            dsn=self.dsn,
            host=self.host,
            port=self.port,
            admin=bool(self.admin),
            user=self.user,
            password=self.password,
            database=self.database,
            timeout=self.timeout,
        )