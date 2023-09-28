# Short summary:
# User: user of the app. owns one wiki
# Wiki: collection of topics
# Topic: contains markdown content (user's knowledge on the topic) + notes/links
# GlobalTopic: public GlobalTopic is found on learn-anything.xyz/<GlobalTopic>
module default {
  type User {
    # unique email
    required email: str {
      constraint exclusive;
    };
    # uniquie UUID for user, created on signup
    hankoId: str {
        constraint exclusive;
    };
    # unique username
    name: str {
      constraint exclusive;
    };
    # custom name user can choose for themselves similar to X
    displayName: str;
    # aws s3 or cloudflare r2 url with image
    profileImage: str;
    # user owns one wiki
    link wiki := .<user[is Wiki];
    # topics user wants to learn
    multi topicsToLearn: GlobalTopic;
    # topics user is learning
    multi topicsLearning: GlobalTopic;
    # topics user learned
    multi topicsLearned: GlobalTopic;
    # links user has `completed` in some way
    multi completedLinks: GlobalLink;
    # links user has liked
    multi likedLinks: GlobalLink;
    # links user has disliked
    multi dislikedLinks: GlobalLink;
    # notes user has liked
    multi likedNotes: Note;
    # notes user has disliked
    multi dislikedNotes: Note;
    # list of topics user is moderating
    multi topicsModerated: GlobalTopic;
    # date until user has paid membership for
    memberUntil: datetime;
  }
  type Wiki {
    # owner of this wiki
    required link user: User;
    # contains topic names + children of the topic(s)
    # is used to generate sidebar in wiki
    # indent is how to know which topics are children of which
    # sorted alphebetically
    # example:
    # {
    #   0: {name: 'Analytics', indent: 0},
    #   1: {name: 'Grafana', indent: 1},
    # }
    # TODO: should in theory just be array of objects above. but how?
    # TODO: perhaps there is better way to do this?
    topicSidebar: json;
    # used to generate local interactive graph of topics for wiki
    # TODO: find out structure needed for this
    topicGraph: json;
    # all topics belonging to this wiki
    multi link topics := .<wiki[is Topic];
  }
  type Topic {
    # wiki this topic belongs to
    required link wiki: Wiki;
    # url friendly unique name of topic. i.e. 'physics' or 'linear-algebra'
    # lowercase + dash separate words
    # the connected .md file name of topic is also this name
    required name: str {
      constraint exclusive;
    };
    # pretty version of `name`, uppercased nicely, proper capitalisation
    # i.e. Physics
    required prettyName: str;
    # true = anyone can see the topic. false = only user can see topic
    required public: bool;
    # markdown content of topic (user's knowledge/thoughts on the topic)
    required content: str;
    # each published topic is part of a global topic
    globalTopic: GlobalTopic;
    # optional path of topic: /physics/quantum-physics where each GlobalTopic name is separated by /
    topicPath: str;
    # all notes belonging to this topic
    multi link notes := .<topic[is Note];
    # all links belonging to this topic
    multi link links := .<topic[is Link];
    # parent topic if there is one
    parentTopic: Topic;
    # topics that are mentioned in this topic (computed every time topic changes)
    # TODO: maybe no need to save it but have it be derived?
    multi mentionedTopics: Topic;
    # mentions of this topic in other topics
    # TODO: maybe no need to save it but have it be derived?
    multi topicBacklinks: Topic;
    # users can't have two topics with same name
    constraint exclusive on ((.name, .wiki));
    # everything in the topic as markdown
    # recomputed on every change made to the topic
    topicAsMarkdown: str;
  }
  type Note {
    # main topic this note belongs to
    required topic: Topic;
    # main content of the note
    required content: str;
    # true = anyone can see the note. false = only user can see note
    required public: bool;
    # topics this note can also relate more loosely to
    # there is still one main topic a note belongs to as chosen by user
    multi relatedTopics: Topic;
    # additional content of the note
    # i.e.
    # - note
    #  - additional content in form of subnotes
    #  - another subnote
    additionalContent: str;
    # url from where the note was taken from or has reference to
    url: str;
  }
  type Link {
    # main topic this link belongs to
    required topic: Topic;
    # url of the link
    required url: str;
    # title as grabbed from the url
    urlTitle: str;
    # title of link as set by the user
    title: str;
    # true = anyone can see the link. false = only user can see link
    required public: bool;
    # type of the link: course/pdf/video/..
    # TODO: should be a new object as Type maybe?
    type: str;
    # link description
    description: str;
    # how long it takes to `process` the link
    # if its article, estimate content of article by average/user reading time
    # if video, it's time length of video. i.e. `12 min`
    timeEstimate: str;
    # author of the link
    author: str;
    # TODO: should probably be int, but keeping it str for now
    year: str;
    # related links to this link
    # could be link to `Code` or `Tweet` or some other Link
    multi relatedLinks: RelatedLink;
    # all links are mapped by unique URL to a global link
    link globalLink: GlobalLink {
      on target delete allow;
    };
  }
  type RelatedLink {
    url: str;
    title: str;
  }
  type GlobalLink {
    # nice title from url
    required title: str;
    # unique url of the link (without protocol) TODO: make it exclusive
    required url: str;
    # http / https
    protocol: str;
    # full url of the link as saved initially by user
    fullUrl: str;
    # temp used to know what is main topic of a link
    # TODO: will be reaplced with `mainTopic` once it's implemented well
    mainTopicAsString: str;
    # true = link was verified, its valid URL, good metadata was added etc.
    required verified: bool;
    # true = link is available for all to see/search. false = link is private
    required public: bool;
    # link description
    description: str;
    # title as grabbed from url
    urlTitle: str;
    # optionally have a main topic that the link belongs to
    link mainTopic: GlobalTopic;
    # TODO: should probably be int, but keeping it str for now
    year: str;
    # related links to this link
    # could be link to `Code` or `Tweet` or some other Link
    multi relatedLinks: RelatedLink;
    # connected topics for this link
    multi link links := .<globalLink[is Link];
  }
  type GlobalTopic {
    # url friendly unique name of topic. i.e. 'physics' or 'linear-algebra'
    # lowercase + dash separate words
    required name: str {
      constraint exclusive;
    };
    # pretty version of `name`, uppercased nicely, proper capitalisation i.e. Physics
    required prettyName: str;
    # detailed summary of the topic
    required topicSummary: str;
    # summary of the topic (short version)
    topicSummaryShort: str;
    # global guide for the topic, improved by community
    # required globalTopic := .<globalTopic[is GlobalTopic];
    # true = topic is available to anyone to see
    # i.e. learn-anything.xyz/physics
    # false = not available for all to see
    # global topics are first reviewed by LA before becoming public
    required public: bool;
    # optional path of topic: /physics/quantum-physics where each GlobalTopic name is separated by /
    topicPath: str;
    # used to generate interactive graph of topics for the global topic
    # check GlobalGraph type for structure
    similarTopicsGraph: json;
    # related topics to this global topic
    multi relatedTopics: GlobalTopic;
    # all links submitted to the global topic
    multi relatedLinks: GlobalLink;
    # all notes submitted to the global topic
    multi relatedNotes: Note;
    # link globalGuide: GlobalGuide {
    #   on target delete allow;
    # };
    # past changes to global guide versioned by time
    multi globalGuides: GlobalGuide;
    # there is one global guide attached to each global topic
    required latestGlobalGuide: GlobalGuide
  }
  type GlobalGuide {
    required created_at: datetime {
      readonly := true;
      default := datetime_of_statement();
    }
    # guide is split by sections
    multi sections: GlobalGuideSection;
  }
  type GlobalGuideSection {
    # title of section
    required title: str;
    # list of links in a section
    multi links: GlobalLink;
    # position of the section in the guide
    order: int16;
  }
  type UserGuide {
    # global topic
    required link globalTopic: GlobalTopic;
    required created_at: datetime {
      readonly := true;
      default := datetime_of_statement();
    }
    # guide is split by sections
    multi sections: UserGuideSection;
    # owner of guide
    required link user: User;
  }
  type UserGuideSection {
    # title of section
    required title: str;
    # list of links in a section
    multi links: GlobalLink;
    # position of the section in the guide
    order: int16;
  }
  type GlobalGraph {
    # JSON graph of all topics and connections
    # structure:
    # [
    #  {
    #     'topic': "physics",
    #     'links': [{"topic": "quantum-physics", "weight": 1}, {"topic": "relativity", "weight": 1}"}]
    #  }
    # ]
    # gets recomputed from how users in LA draw connections between topics
    required connections: json;
  }
}
