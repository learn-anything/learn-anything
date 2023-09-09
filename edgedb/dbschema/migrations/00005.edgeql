CREATE MIGRATION m1cma4mahifvuwiqjpehuq2ub5vdbixbbzg5igddmvx27uk34uud5q
    ONTO m1p5rfsjifdv4lqkktk7yfyhli3ydudocktzqedupns4d2x4n455oa
{
  ALTER TYPE default::GlobalTopic {
      CREATE LINK latestGlobalGuide: default::GlobalGuide;
  };
};
