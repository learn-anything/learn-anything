CREATE MIGRATION m14snolsqmamdocdqjiwudppiurdgh6p72ek22vyntmri6yvrreynq
    ONTO initial
{
  CREATE TYPE default::GlobalGraph {
      CREATE REQUIRED PROPERTY connections: std::json;
  };
  CREATE TYPE default::GlobalGuide {
      CREATE PROPERTY lastUpdateTime: std::str;
  };
  CREATE TYPE default::GlobalTopic {
      CREATE REQUIRED LINK globalGuide: default::GlobalGuide;
      CREATE MULTI LINK relatedTopics: default::GlobalTopic;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY prettyName: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY similarTopicsGraph: std::json;
      CREATE PROPERTY topicPath: std::str;
      CREATE REQUIRED PROPERTY topicSummary: std::str;
      CREATE PROPERTY topicSummaryShort: std::str;
  };
  ALTER TYPE default::GlobalGuide {
      CREATE REQUIRED LINK globalTopic: default::GlobalTopic;
  };
  CREATE TYPE default::GlobalGuideSection {
      CREATE PROPERTY order: std::int16;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  ALTER TYPE default::GlobalGuide {
      CREATE MULTI LINK sections: default::GlobalGuideSection;
  };
  CREATE TYPE default::GlobalLink {
      CREATE LINK mainTopic: default::GlobalTopic;
      CREATE PROPERTY prettyTitle: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE REQUIRED PROPERTY url: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY urlTitle: std::str;
  };
  ALTER TYPE default::GlobalGuideSection {
      CREATE MULTI LINK links: default::GlobalLink;
  };
  CREATE TYPE default::Link {
      CREATE REQUIRED LINK globalLink: default::GlobalLink;
      CREATE MULTI LINK relatedLinks: default::Link;
      CREATE PROPERTY author: std::str;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY prettyTitle: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY timeEstimate: std::str;
      CREATE PROPERTY type: std::str;
  };
  ALTER TYPE default::GlobalLink {
      CREATE MULTI LINK links := (.<globalLink[IS default::Link]);
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK completedLinks: default::GlobalLink;
      CREATE MULTI LINK dislikedLinks: default::GlobalLink;
      CREATE MULTI LINK likedLinks: default::GlobalLink;
      CREATE MULTI LINK topicsLearned: default::GlobalTopic;
      CREATE MULTI LINK topicsLearning: default::GlobalTopic;
      CREATE MULTI LINK topicsModerated: default::GlobalTopic;
      CREATE MULTI LINK topicsToLearn: default::GlobalTopic;
      CREATE PROPERTY displayName: std::str;
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY proMemberUntil: std::datetime;
      CREATE PROPERTY profileImage: std::str;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE MULTI LINK relatedLinks: default::GlobalLink;
  };
  CREATE TYPE default::Note {
      CREATE PROPERTY additionalContent: std::str;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY url: std::str;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE MULTI LINK relatedNotes: default::Note;
  };
  CREATE TYPE default::Topic {
      CREATE LINK globalTopic: default::GlobalTopic;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE MULTI LINK mentionedTopics: default::Topic;
      CREATE LINK parentTopic: default::Topic;
      CREATE MULTI LINK topicBacklinks: default::Topic;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY prettyName: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY topicAsMarkdown: std::str;
      CREATE PROPERTY topicPath: std::str;
  };
  ALTER TYPE default::Link {
      CREATE REQUIRED LINK topic: default::Topic;
  };
  ALTER TYPE default::Topic {
      CREATE MULTI LINK links := (.<topic[IS default::Link]);
  };
  ALTER TYPE default::Note {
      CREATE MULTI LINK relatedTopics: default::Topic;
      CREATE REQUIRED LINK topic: default::Topic;
  };
  ALTER TYPE default::Topic {
      CREATE MULTI LINK notes := (.<topic[IS default::Note]);
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK dislikedNotes: default::Note;
      CREATE MULTI LINK likedNotes: default::Note;
  };
  CREATE TYPE default::Wiki {
      CREATE REQUIRED LINK user: default::User;
      CREATE PROPERTY topicGraph: std::json;
      CREATE PROPERTY topicSidebar: std::json;
  };
  ALTER TYPE default::Topic {
      CREATE REQUIRED LINK wiki: default::Wiki;
      CREATE CONSTRAINT std::exclusive ON ((.name, .wiki));
  };
  ALTER TYPE default::Wiki {
      CREATE MULTI LINK topics := (.<wiki[IS default::Topic]);
  };
  ALTER TYPE default::User {
      CREATE LINK wiki: default::Wiki;
  };
};
