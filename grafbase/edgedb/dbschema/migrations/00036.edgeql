CREATE MIGRATION m16sbj5tmkxsex6gs5wnpszuj67a6w47sddfeb4tjfwcvzjdyrtb2a
    ONTO m1kvuvqeooguezzper7eawobofomsuhetunrfxjosh56fiqfwlazwq
{
  ALTER TYPE default::Product {
      DROP PROPERTY priceInUsd;
  };
  ALTER TYPE default::Product {
      CREATE PROPERTY priceInUsdCents: std::int16;
  };
  ALTER TYPE default::User {
      CREATE PROPERTY freeActions: std::int16;
  };
};
