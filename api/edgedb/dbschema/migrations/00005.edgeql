CREATE MIGRATION m13nm3tz5fvsiwhvvqxh45tclqy4kxb3xtrdu5avuxywfum6yicwma
    ONTO m1pyp6o7uwkjf3eyg6ouwcf22fgt4a4s2rx4xzftw7rxe3bcyrwq6a
{
  ALTER TYPE default::User {
      ALTER LINK linksCompleted {
          ON TARGET DELETE ALLOW;
      };
      ALTER LINK linksInProgress {
          ON TARGET DELETE ALLOW;
      };
      ALTER LINK linksToComplete {
          ON TARGET DELETE ALLOW;
      };
      ALTER LINK linksWithoutLearningStatus {
          ON TARGET DELETE ALLOW;
      };
  };
};
