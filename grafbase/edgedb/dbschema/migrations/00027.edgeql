CREATE MIGRATION m1olq2zk2pcubmu2wwfkcx3ek2j6vccqweu4iqrgxjhypnisx355nq
    ONTO m1sy7sehe2ugyb3jkukkaaofttcqkav45gjy27ug733bnro6yf7tfq
{
  ALTER TYPE default::GlobalTopic {
      CREATE PROPERTY aiSummary: std::str;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY githubLink: std::str;
      CREATE PROPERTY redditLink: std::str;
      CREATE PROPERTY topicWebsiteLink: std::str;
      CREATE PROPERTY wikipediaLink: std::str;
      CREATE PROPERTY xLink: std::str;
  };
};
