CREATE MIGRATION m17tlajhbdcmrk26aqealxrjqulez466r5oluhhh3sqwa2vlw55rrq
    ONTO initial
{
  CREATE TYPE default::Link {
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
  CREATE TYPE default::Note {
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE PROPERTY url: std::str;
  };
  CREATE TYPE default::Topic {
      CREATE MULTI LINK links: default::Link;
      CREATE MULTI LINK notes: default::Note;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY content: std::str;
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
