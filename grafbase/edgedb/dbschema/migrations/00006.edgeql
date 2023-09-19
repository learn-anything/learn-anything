CREATE MIGRATION m1fszg7hh6t6ii2f3dl77ofjpsutufgz4bl47cw3w6owndslqch33a
    ONTO m1cma4mahifvuwiqjpehuq2ub5vdbixbbzg5igddmvx27uk34uud5q
{
  ALTER TYPE default::GlobalTopic {
      ALTER LINK latestGlobalGuide {
          SET REQUIRED USING (<default::GlobalGuide>{});
      };
  };
};
