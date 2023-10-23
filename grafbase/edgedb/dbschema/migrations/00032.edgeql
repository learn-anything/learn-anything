CREATE MIGRATION m1rman6o3y3ufdqlzrfb7zckcj7g25763gxx74i7tdgbhdttchl36q
    ONTO m1rlr7cga5ghyxq662vvdlyszibncbzllf632ejph6udmshfbxb7cq
{
  ALTER TYPE default::User {
      CREATE PROPERTY stripeSubscriptionObjectId: std::str;
  };
};
