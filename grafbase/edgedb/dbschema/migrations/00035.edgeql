CREATE MIGRATION m1kvuvqeooguezzper7eawobofomsuhetunrfxjosh56fiqfwlazwq
    ONTO m1q7vflzt454eoextksxwfxh4usabvxf4ers7ih6f46k3kqqip5q2a
{
  CREATE TYPE default::Product {
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY imageUrl: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY priceInUsd: std::float32;
      CREATE PROPERTY websiteUrl: std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK productsBought: default::Product;
      CREATE MULTI LINK productsSelling: default::Product;
  };
};
