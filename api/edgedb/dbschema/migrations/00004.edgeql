CREATE MIGRATION m1pyp6o7uwkjf3eyg6ouwcf22fgt4a4s2rx4xzftw7rxe3bcyrwq6a
    ONTO m1scqp5eh6musewto3en7ams6oaezno3ilzvghho3c5rmcam2zlwkq
{
  ALTER TYPE default::User {
      CREATE MULTI LINK linksWithoutLearningStatus: default::PersonalLink;
  };
};
