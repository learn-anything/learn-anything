CREATE MIGRATION m1fuckbrowgc5mvlbmxnnio5gaepwajn4ms7427d6rjoaahwtryvea
    ONTO m1ocj25vftkrf3ryuuckxe6y7jew6qxhl5topa5rv54fg7vwmu64sa
{
  ALTER TYPE default::Topic {
      CREATE PROPERTY published: std::bool;
      CREATE PROPERTY publishedContent: std::str;
  };
  ALTER TYPE default::User {
      ALTER PROPERTY freeActions {
          SET default := 10;
      };
  };
};
