CREATE MIGRATION m1foxpxjsobohn6cl2xodmg55ke7gle4tbmdwpwkacbvwda7kgmuua
    ONTO m13nm3tz5fvsiwhvvqxh45tclqy4kxb3xtrdu5avuxywfum6yicwma
{
  CREATE TYPE default::PersonalPage EXTENDING default::WithCreatedAt {
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY pageUrl: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY public: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY title: std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK personalPages: default::PersonalPage {
          ON TARGET DELETE ALLOW;
      };
  };
};
