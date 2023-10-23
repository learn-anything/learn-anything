CREATE MIGRATION m1q7vflzt454eoextksxwfxh4usabvxf4ers7ih6f46k3kqqip5q2a
    ONTO m1wmfddjwgidxflb2ihmdclfymmrnvaag2heytvyqfesttuvltmjrq
{
  ALTER TYPE default::User {
      CREATE PROPERTY stripePlan: std::str;
  };
};
