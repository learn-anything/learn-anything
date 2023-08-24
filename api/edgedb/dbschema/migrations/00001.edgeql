CREATE MIGRATION m15lvjcybtbzssb5t3eh42es5lavqmw3vgzuul7ykqogltcrxj5aga
    ONTO initial
{
  CREATE TYPE default::GlobalTopic {
      CREATE LINK parentTopic: default::GlobalTopic;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY prettyName: std::str;
      CREATE PROPERTY public: std::bool;
      CREATE PROPERTY topicGraph: std::json;
  };
  CREATE TYPE default::Guide {
      CREATE PROPERTY lastUpdateTime: std::str;
      CREATE REQUIRED PROPERTY topicSummary: std::str;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE LINK guide: default::Guide;
  };
  CREATE TYPE default::Link {
      CREATE MULTI LINK relatedLinks: default::Link;
      CREATE PROPERTY author: std::str;
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY timeEstimate: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE PROPERTY type: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE MULTI LINK relatedLinks: default::Link;
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
      CREATE PROPERTY name: std::str;
      CREATE MULTI LINK mentionedTopics: default::Topic;
      CREATE LINK parentTopic: default::Topic;
      CREATE MULTI LINK topicBacklinks: default::Topic;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY public: std::bool;
      CREATE PROPERTY topicAsMarkdown: std::str;
  };
  ALTER TYPE default::GlobalTopic {
      CREATE MULTI LINK relatedTopics: default::Topic;
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK topicsLearned: default::GlobalTopic;
      CREATE MULTI LINK topicsLearning: default::GlobalTopic;
      CREATE MULTI LINK topicsModerated: default::GlobalTopic;
      CREATE MULTI LINK topicsToLearn: default::GlobalTopic;
      CREATE MULTI LINK completedLinks: default::Link;
      CREATE MULTI LINK reportedLinks: default::Link;
      CREATE MULTI LINK reportedNotes: default::Note;
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY proMemberUntil: std::datetime;
      CREATE PROPERTY profileImage: std::str;
  };
  CREATE TYPE default::GuideSection {
      CREATE MULTI LINK links: default::Link;
      CREATE PROPERTY order: std::int16;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  ALTER TYPE default::Guide {
      CREATE MULTI LINK sections: default::GuideSection;
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
