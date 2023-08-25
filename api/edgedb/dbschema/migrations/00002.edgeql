CREATE MIGRATION m1xmyntn4pa6aaaawgvminauc3v2mx2udqflxnbdzrk3wq3ft5qqdq
    ONTO m15lvjcybtbzssb5t3eh42es5lavqmw3vgzuul7ykqogltcrxj5aga
{
  ALTER TYPE default::User {
      CREATE PROPERTY displayName: std::str;
  };
};
