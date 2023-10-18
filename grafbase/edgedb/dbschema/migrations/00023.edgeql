CREATE MIGRATION m1o3iqzewcnjsg5rbsyxpzzths2zkn7nbx7efe4czdgouvfv5mclda
    ONTO m17ycidktbgnz6aktsjz2nefca6ghhwtgog7pvfvyaymtc72rw2xfq
{
  ALTER TYPE default::GlobalTopic {
      CREATE REQUIRED PROPERTY verified: std::bool {
          SET REQUIRED USING (true);
      };
  };
};
