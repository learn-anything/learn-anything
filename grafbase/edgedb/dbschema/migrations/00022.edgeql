CREATE MIGRATION m17ycidktbgnz6aktsjz2nefca6ghhwtgog7pvfvyaymtc72rw2xfq
    ONTO m17iund4zc6hq6uyqyzzqhys735elepdefwl6uwftucwy63samh6gq
{
  CREATE TYPE default::GlobalNote {
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE PROPERTY url: std::str;
  };
};
