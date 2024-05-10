CREATE MIGRATION m1gvujtsnjxvuqnr7o4rezomjr3zbcjsitbszpg7gcyeuv5rbp6wca
    ONTO m1rpx5dk3ptbq3rnebam7qzeeolkufa2sak5k46bgof3uvolqpgleq
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  ALTER TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          SET REQUIRED USING (<ext::auth::Identity>{});
      };
      ALTER PROPERTY name {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::User {
      CREATE PROPERTY created: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::User {
      CREATE PROPERTY updated: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE SCALAR TYPE default::Role EXTENDING enum<admin, user>;
  ALTER TYPE default::User {
      CREATE PROPERTY userRole: default::Role {
          SET default := 'user';
      };
      DROP PROPERTY username;
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id,
          name,
          email
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
