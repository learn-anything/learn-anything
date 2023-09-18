CREATE MIGRATION m1d7e3lweqtzhstgkkru6wz6xajdaly6n7mvc3k4a6uno4yhzuxdnq
    ONTO m1xt5nphi4qxozan2ag3int5illondxsm3mwsuzyyhlobc6vbwrozq
{
  ALTER TYPE default::User {
      ALTER PROPERTY hankoUuid {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
