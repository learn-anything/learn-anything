CREATE MIGRATION m1v6jpkyxahrenyxnabezzbnf4lj55senylzkeia3pb4t66i2qy7uq
    ONTO m1qkkogdnscl7wykrgbr6jyaqvtjutgywvscfotgy3msbq7bq5qfma
{
  ALTER TYPE default::User {
      CREATE MULTI LINK linksInProgress: default::GlobalLink;
      CREATE MULTI LINK linksToComplete: default::GlobalLink;
  };
};
