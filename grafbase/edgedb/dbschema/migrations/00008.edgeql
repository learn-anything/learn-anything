CREATE MIGRATION m1xt5nphi4qxozan2ag3int5illondxsm3mwsuzyyhlobc6vbwrozq
    ONTO m1psqqs7d4brzm55zsplc6kl4yy4yndyv4zeeqmhz6zkf6wvld6yfa
{
  ALTER TYPE default::User {
      CREATE PROPERTY hankoUuid: std::uuid;
  };
};
