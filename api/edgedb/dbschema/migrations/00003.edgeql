CREATE MIGRATION m1scqp5eh6musewto3en7ams6oaezno3ilzvghho3c5rmcam2zlwkq
    ONTO m1flqfcltj3reuytjqehns2zexxryr6zdz7fu6rvoetft3lojipcla
{
  ALTER TYPE default::User {
      CREATE PROPERTY bio: std::str;
  };
};
