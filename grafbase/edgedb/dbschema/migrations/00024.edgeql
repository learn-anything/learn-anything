CREATE MIGRATION m127o2h3gtlevx35tz2qtxdrhabiqksl2oynmmyecwinrm5lmrnxeq
    ONTO m1o3iqzewcnjsg5rbsyxpzzths2zkn7nbx7efe4czdgouvfv5mclda
{
  CREATE TYPE default::PersonalLink {
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY protocol: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY url: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY year: std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK personalLinks: default::PersonalLink;
  };
};
