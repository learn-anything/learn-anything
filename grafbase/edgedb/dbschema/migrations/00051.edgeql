CREATE MIGRATION m1424ptu5v3rhuxgqpmlncq4fqaytjhyua4j3r2qtqmse2na3uqzsq
    ONTO m15ewityi7r35mb7x27pdgv4rjdcrjnffb7u2djn5uqq7yz4a66ksq
{
  ALTER TYPE default::User {
      DROP LINK dislikedLinks;
      DROP LINK dislikedNotes;
      ALTER LINK linksBookmarked {
          SET TYPE default::PersonalLink USING (<default::PersonalLink>{});
      };
      ALTER LINK linksCompleted {
          SET TYPE default::PersonalLink USING (<default::PersonalLink>{});
      };
      ALTER LINK linksInProgress {
          SET TYPE default::PersonalLink USING (<default::PersonalLink>{});
      };
      ALTER LINK linksLiked {
          SET TYPE default::PersonalLink USING (<default::PersonalLink>{});
      };
  };
};
