CREATE MIGRATION m1sqlc5agffl4kg4q4u72d27pkaievp2suuuoxhw7hof4p2ftfzsda
    ONTO m127o2h3gtlevx35tz2qtxdrhabiqksl2oynmmyecwinrm5lmrnxeq
{
  ALTER TYPE default::GlobalTopic {
      ALTER LINK latestGlobalGuide {
          RESET OPTIONALITY;
      };
  };
};
