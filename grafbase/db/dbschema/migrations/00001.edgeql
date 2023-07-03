CREATE MIGRATION m13rpuanc5m7plhxje37igizmscbhlh43sttf6ite373x45yrxavyq
    ONTO initial
{
  CREATE TYPE default::GlobalTopic {
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY verified: std::bool;
  };
  CREATE TYPE default::Link {
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
  CREATE TYPE default::Topic {
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE LINK directParent: default::Topic;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE PROPERTY prettyName: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
  };
  ALTER TYPE default::Link {
      CREATE REQUIRED LINK topic: default::Topic;
  };
  ALTER TYPE default::Topic {
      CREATE MULTI LINK links := (.<topic[IS default::Link]);
  };
  CREATE TYPE default::Note {
      CREATE REQUIRED LINK topic: default::Topic;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY url: std::str;
  };
  ALTER TYPE default::Topic {
      CREATE MULTI LINK notes := (.<topic[IS default::Note]);
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY profileImage: std::str;
  };
  ALTER TYPE default::Topic {
      CREATE REQUIRED LINK user: default::User;
      CREATE CONSTRAINT std::exclusive ON ((.name, .user));
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK topics := (.<user[IS default::Topic]);
  };
};
