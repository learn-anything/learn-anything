CREATE MIGRATION m1rpx5dk3ptbq3rnebam7qzeeolkufa2sak5k46bgof3uvolqpgleq
    ONTO m1foxpxjsobohn6cl2xodmg55ke7gle4tbmdwpwkacbvwda7kgmuua
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY name: std::str {
          SET REQUIRED USING (<std::str>{});
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY profileImage {
          RENAME TO place;
      };
  };
  ALTER TYPE default::User {
      CREATE PROPERTY profilePhotoUrl: std::str;
  };
};
