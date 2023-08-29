CREATE MIGRATION m1jjj7bjhbtzv63fk2ccechj63uy5yxbsrl6kqfaptnk3fvh34am4a
    ONTO m1ygq556iaizp32uxec5r6q67fgh6ghkf6uycz6t6evdsitqdhxooq
{
  ALTER TYPE default::GlobalGuide {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  ALTER TYPE default::GlobalGuide {
      DROP PROPERTY lastUpdateTime;
  };
  CREATE TYPE default::UserGuideSection {
      CREATE MULTI LINK links: default::GlobalLink;
      CREATE PROPERTY order: std::int16;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::UserGuide {
      CREATE REQUIRED LINK globalTopic: default::GlobalTopic;
      CREATE MULTI LINK sections: default::UserGuideSection;
      CREATE PROPERTY lastUpdateTime: std::str;
  };
};
