CREATE MIGRATION m1qkkogdnscl7wykrgbr6jyaqvtjutgywvscfotgy3msbq7bq5qfma
    ONTO m1pppmv4yqgxywd7s5ojlsbocfisxqtjlhjcxlwo36hgwpsnsgdjda
{
  ALTER TYPE default::User {
      CREATE PROPERTY topicsTracked := (((std::count(.topicsToLearn) + std::count(.topicsLearning)) + std::count(.topicsLearned)));
  };
};
