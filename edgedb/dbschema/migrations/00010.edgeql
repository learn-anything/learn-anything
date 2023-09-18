CREATE MIGRATION m1dbg5qphjotharb3f772n653on4qwjyysgur5hw3m32vcytk3iiea
    ONTO m1d7e3lweqtzhstgkkru6wz6xajdaly6n7mvc3k4a6uno4yhzuxdnq
{
  ALTER TYPE default::User {
      ALTER PROPERTY hankoUuid {
          SET TYPE std::str USING (<std::str>.hankoUuid);
      };
  };
};
