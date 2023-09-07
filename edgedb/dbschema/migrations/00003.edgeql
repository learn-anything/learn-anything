CREATE MIGRATION m1nlsqlkih6t3th4uloeqcq2bput7nsp45qp65qq2wbyu7sqtco23q
    ONTO m1jjj7bjhbtzv63fk2ccechj63uy5yxbsrl6kqfaptnk3fvh34am4a
{
  ALTER TYPE default::UserGuide {
      CREATE REQUIRED LINK user: default::User {
          SET REQUIRED USING (<default::User>{});
      };
  };
  ALTER TYPE default::UserGuide {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  ALTER TYPE default::UserGuide {
      DROP PROPERTY lastUpdateTime;
  };
};
