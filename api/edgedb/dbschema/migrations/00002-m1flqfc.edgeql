CREATE MIGRATION m1flqfcltj3reuytjqehns2zexxryr6zdz7fu6rvoetft3lojipcla
    ONTO m1q3cjyo5xgwozd3hhnhbyn3on5wjamvbxxfsxucvxj6tqrfklblba
{
  ALTER TYPE default::GlobalTopicGraph {
      ALTER PROPERTY connections {
          SET REQUIRED USING (<std::str>{});
      };
      ALTER PROPERTY name {
          SET REQUIRED USING (<std::str>{});
      };
      ALTER PROPERTY prettyName {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
