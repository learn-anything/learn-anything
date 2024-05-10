CREATE MIGRATION m1q3cjyo5xgwozd3hhnhbyn3on5wjamvbxxfsxucvxj6tqrfklblba
    ONTO initial
{
  CREATE ABSTRACT TYPE default::WithCreatedAt {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
  };
  CREATE TYPE default::Events EXTENDING default::WithCreatedAt {
      CREATE PROPERTY mutation: std::json;
  };
  CREATE TYPE default::GlobalGuide EXTENDING default::WithCreatedAt;
  CREATE TYPE default::GlobalTopic EXTENDING default::WithCreatedAt {
      CREATE LINK latestGlobalGuide: default::GlobalGuide;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY prettyName: std::str;
      CREATE REQUIRED PROPERTY public: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY verified: std::bool {
          SET default := false;
      };
  };
  CREATE TYPE default::GlobalLink EXTENDING default::WithCreatedAt {
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY protocol: std::str {
          SET default := 'https';
      };
      CREATE REQUIRED PROPERTY public: std::bool {
          SET default := false;
      };
      CREATE PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY url: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY urlTitle: std::str;
      CREATE REQUIRED PROPERTY verified: std::bool {
          SET default := false;
      };
      CREATE PROPERTY year: std::int16;
  };
  CREATE TYPE default::GlobalGuideSection EXTENDING default::WithCreatedAt {
      CREATE MULTI LINK links: default::GlobalLink {
          CREATE PROPERTY order: std::int16;
      };
      CREATE REQUIRED PROPERTY title: std::str;
  };
  ALTER TYPE default::GlobalGuide {
      CREATE MULTI LINK sections: default::GlobalGuideSection {
          ON TARGET DELETE ALLOW;
      };
  };
  CREATE TYPE default::PersonalLink EXTENDING default::WithCreatedAt {
      CREATE REQUIRED LINK globalLink: default::GlobalLink {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY note: std::str;
      CREATE PROPERTY title: std::str;
      CREATE PROPERTY year: std::int16;
  };
  CREATE TYPE default::User EXTENDING default::WithCreatedAt {
      CREATE MULTI LINK topicsLearned: default::GlobalTopic;
      CREATE MULTI LINK topicsLearning: default::GlobalTopic;
      CREATE MULTI LINK topicsToLearn: default::GlobalTopic;
      CREATE PROPERTY topicsTracked := (((std::count(.topicsToLearn) + std::count(.topicsLearning)) + std::count(.topicsLearned)));
      CREATE MULTI LINK linksCompleted: default::PersonalLink;
      CREATE MULTI LINK linksInProgress: default::PersonalLink;
      CREATE MULTI LINK linksLiked: default::PersonalLink;
      CREATE MULTI LINK linksToComplete: default::PersonalLink;
      CREATE PROPERTY displayName: std::str;
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY memberUntil: std::datetime;
      CREATE PROPERTY profileImage: std::str;
      CREATE PROPERTY stripePlan: std::str;
      CREATE PROPERTY stripeSubscriptionObjectId: std::str;
      CREATE PROPERTY subscriptionStopped: std::bool;
      CREATE PROPERTY username: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::GlobalTopicGraph {
      CREATE MULTI PROPERTY connections: std::str;
      CREATE PROPERTY name: std::str;
      CREATE PROPERTY prettyName: std::str;
  };
  CREATE TYPE default::Other EXTENDING default::WithCreatedAt {
      CREATE LINK latestGlobalTopicGraph: default::GlobalTopicGraph;
  };
};
