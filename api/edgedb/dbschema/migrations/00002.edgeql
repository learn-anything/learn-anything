CREATE MIGRATION m1nzyo7y2nj65eufpsqoycvhh2pczg6ydepmsydxqed4nynyeu2iyq
    ONTO m1wukhe74lcuopzoqq5tfwyslmnmmsfjmm7rcjfsi57ssacphijhpa
{
  ALTER TYPE default::User {
      ALTER LINK wiki {
          USING (.<user[IS default::Wiki]);
      };
  };
};
