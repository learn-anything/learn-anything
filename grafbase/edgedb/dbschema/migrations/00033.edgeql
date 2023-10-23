CREATE MIGRATION m1wmfddjwgidxflb2ihmdclfymmrnvaag2heytvyqfesttuvltmjrq
    ONTO m1rman6o3y3ufdqlzrfb7zckcj7g25763gxx74i7tdgbhdttchl36q
{
  ALTER TYPE default::User {
      CREATE PROPERTY subscriptionStopped: std::bool;
  };
};
