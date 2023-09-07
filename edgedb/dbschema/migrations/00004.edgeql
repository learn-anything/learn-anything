CREATE MIGRATION m1p5rfsjifdv4lqkktk7yfyhli3ydudocktzqedupns4d2x4n455oa
    ONTO m1nlsqlkih6t3th4uloeqcq2bput7nsp45qp65qq2wbyu7sqtco23q
{
  ALTER TYPE default::GlobalGuide {
      DROP LINK globalTopic;
  };
  ALTER TYPE default::GlobalTopic {
      DROP LINK globalGuide;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE MULTI LINK globalGuides: default::GlobalGuide;
  };
  ALTER TYPE default::User {
      ALTER PROPERTY name {
          RESET OPTIONALITY;
      };
  };
};
