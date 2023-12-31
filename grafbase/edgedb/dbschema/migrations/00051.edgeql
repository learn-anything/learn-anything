CREATE MIGRATION m1kqptpi5yfk3nvgnmiezcg24ew6si6i7mzjhifphi7inyxpw6r5sa
    ONTO m15ewityi7r35mb7x27pdgv4rjdcrjnffb7u2djn5uqq7yz4a66ksq
{
  ALTER TYPE default::User {
      DROP LINK dislikedLinks;
      DROP LINK dislikedNotes;
      ALTER LINK linksBookmarked {
          SET TYPE default::PersonalLink USING (.linksBookmarked[IS default::PersonalLink]);
      };
      ALTER LINK linksCompleted {
          SET TYPE default::PersonalLink USING (.linksCompleted[IS default::PersonalLink]);
      };
      ALTER LINK linksInProgress {
          SET TYPE default::PersonalLink USING (.linksInProgress[IS default::PersonalLink]);
      };
      ALTER LINK linksLiked {
          SET TYPE default::PersonalLink USING (.linksLiked[IS default::PersonalLink]);
      };
  };
};
