CREATE MIGRATION m1sy7sehe2ugyb3jkukkaaofttcqkav45gjy27ug733bnro6yf7tfq
    ONTO m1sqlc5agffl4kg4q4u72d27pkaievp2suuuoxhw7hof4p2ftfzsda
{
  ALTER TYPE default::User {
      CREATE PROPERTY admin: std::bool;
  };
};
