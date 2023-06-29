CREATE MIGRATION m1hkdxpkezummjgs4ti3mragaimqkbhziekk73cixp4zzoeplo7usq
    ONTO initial
{
  CREATE TYPE default::Topic {
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
  };
};
