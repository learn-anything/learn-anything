CREATE MIGRATION m1uozl6jhjyeqh5jm42vrcqrb5x7hoppl6svq2mrwypdybbssxrjiq
    ONTO m1xmyntn4pa6aaaawgvminauc3v2mx2udqflxnbdzrk3wq3ft5qqdq
{
  ALTER TYPE default::Topic {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
          SET REQUIRED USING (<std::str>{});
      };
      CREATE PROPERTY prettyName: std::str;
  };
};
