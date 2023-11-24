# schema that defines entire LA data model
# User type is at the center of it
# there are `GlobalThings` and `PersonalThings`
# such as GlobalTopic and Topic (will be named PersonalTopic in future)
# GlobalTopic is viewed by all and many can edit it
# PersonalTopic is part of user's PersonalWiki and only that user can edit it (at least for now)
# being edited as we figure out how to best store personal user data and integrate it well
# into the global knowledge graph that is LA
# figjam going over the architecture:
# https://www.figma.com/file/GelB3DWCdjQ2tU4v3kbHOj/LA-architecture?type=whiteboard&node-id=0%3A1&t=nL3VXI1ztTo7ohmd-1

module default {
  type User {
    # unique email
    required email: str {
      constraint exclusive;
    };
    # User is authorised by `hankoToken` which comes from Hanko JWT token
    # its unique and is created on signup
    hankoId: str {
        constraint exclusive;
    };
    # unique username
    name: str {
      constraint exclusive;
    };
    admin: bool;
    # custom name user can choose for themselves similar to X
    displayName: str;
    # aws s3 or cloudflare r2 url with image
    profileImage: str;
    # TODO: in future can consider `GlobalWiki` as concept maybe as a wiki that multiple users can edit
    # user owns one personal wiki
    link wiki := .<user[is PersonalWiki];
    # topics user wants to learn
    multi topicsToLearn: GlobalTopic;
    # topics user is learning
    multi topicsLearning: GlobalTopic;
    # topics user learned
    multi topicsLearned: GlobalTopic;
    property topicsTracked := count(.topicsToLearn) + count(.topicsLearning) + count(.topicsLearned);
    # links user wants to complete
    multi linksToComplete: GlobalLink;
    # links user is currently trying to complete
    multi linksInProgress: GlobalLink;
    # links user has completed
    multi completedLinks: GlobalLink;
    # links user has completed and liked
    multi likedLinks: GlobalLink;
    # personal links user has added
    multi personalLinks: PersonalLink {
      on target delete allow;
    };
    # links user has disliked (not used currently)
    multi dislikedLinks: GlobalLink;
    # notes user has liked
    # TODO: what happens when user deletes note? should it be deleted from here too?
    # or moved to global note?
    multi likedNotes: Note;
    # notes user has disliked
    multi dislikedNotes: Note;
    # list of topics user is moderating
    multi topicsModerated: GlobalTopic;
    # products user is selling
    multi productsSelling: Product;
    # products user bought
    multi productsBought: Product;
    # date until user has paid membership for
    memberUntil: datetime;
    # month / year
    stripePlan: str;
    # after stripe payment works, you get back subscription object id (can be used to cancel subscription)
    stripeSubscriptionObjectId: str;
    # whether user has stopped subscription and won't be be charged again
    subscriptionStopped: bool;
    # limit of actions non member user can do (can be reset every day after to 10 or similar number)
    # TODO: not used as instead model of just limiting actions for some operations is used instead (simpler)
    # this can be useful for doing AI actions limits as they will cost money
    # freeActions: int16 {
    #   default := 50;
    #   constraint min_value(0);
    # };
  }
  # other users can `like` or `follow` PersonalWiki
  type PersonalWiki {
    # TODO: is `required link user` the best way to store this relationship of a user owning one wiki
    # owner of this wiki
    required link user: User;
    # all topics belonging to this wiki
    multi link topics := .<wiki[is Topic];
    # TODO: everything below is questionable (maybe no need to store it)
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
    # TODO: perhaps there is better way to do this?8
    # TODO: probably computed from the topics, can also compute it as part of query
    # so maybe no need to store it?
    topicSidebar: json;
    # used to generate local interactive graph of topics for wiki
    # TODO: find out structure needed for this
    # TODO: same for this, can be computed as part of query
    topicGraph: json;
  }
  # TODO: should be called PersonalTopic
  type Topic {
    # wiki this topic belongs to
    required link wiki: PersonalWiki;
    # url friendly unique name of topic. i.e. 'physics' or 'linear-algebra'
    # lowercase + dash separate words
    # the connected .md file name of topic is also this name
    required name: str {
      constraint exclusive;
    };
    # pretty version of `name`, uppercased nicely, proper capitalisation
    # i.e. Physics
    required prettyName: str;
    # markdown content of topic (user's knowledge/thoughts on the topic)
    required content: str;
    # true = anyone can see the topic. false = only user can see topic
    public: bool;
    # non published content will be end to end encrypted
    required published: bool;
    # each published topic is part of a global topic
    # TODO: not sure how to best do it
    # TODO: probably best to just do it by `name`, if `name` matches, its part of that global topic
    globalTopic: GlobalTopic;
    # optional path of topic: /physics/quantum-physics where each GlobalTopic name is separated by /
    # for start, do the folder/file structure and have that be the topicPath
    # optional for users to define
    topicPath: str;
    # TODO: there should probably be a GlobalNote and PersonalNote
    # all notes belonging to this topic
    multi link notes := .<topic[is Note];
    # all links belonging to this topic
    # TODO: should probably be PersonalLink, not Link (need to check properly)
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
    # unique url of the link (without protocol)
    required url: str {
      constraint exclusive;
    };
    # http / https
    required protocol: str;
    # full url of the link as saved initially by user
    fullUrl: str;
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
  type PersonalLink {
    # nice title from url
    required title: str;
    # unique url of the link (without protocol)
    required url: str {
      constraint exclusive;
    };
    # http / https
    required protocol: str;
    # link description
    description: str;
    year: str;
    # optionally have a main topic that personal link belongs to
    link mainTopic: GlobalTopic;
  }
  type GlobalNote {
    required content: str;
    url: str;
    # optionally have a main topic that the note belongs to
    link mainTopic: GlobalTopic;
  }
  type GlobalTopic {
    # url friendly unique name of topic. i.e. 'physics' or 'linear-algebra'
    # lowercase + dash separate words
    required name: str {
      constraint exclusive;
    };
    # pretty version of `name`, uppercased nicely, proper capitalisation i.e. Physics
    required prettyName: str;
    # detailed summary of the topic (in html, due to https://github.com/SaltyAom/mobius/issues/4)
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
    # true = topic was verified
    required verified: bool;
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
    latestGlobalGuide: GlobalGuide;
    description: str;
    topicWebsiteLink: str;
    wikipediaLink: str;
    githubLink: str;
    xLink: str;
    redditLink: str;
    aiSummary: str;
  }
  type GlobalGuide {
    required created_at: datetime {
      readonly := true;
      default := datetime_of_statement();
    }
    # guide is split by sections
    multi sections: GlobalGuideSection {
      on target delete allow;
    }
  }
  type GlobalGuideSection {
    # title of section
    required title: str;
    # summary of the section (in html, due to https://github.com/SaltyAom/mobius/issues/4)
    summary: str;
    # list of links in a section
    multi links: GlobalLink {
      order: int16;
    };
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
  }
  # TODO: think through how useful this is
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
  # digital marketplace (anything from above can in theory be a product that can have a price attached)
  # or be gated to certain members that user decides on
  type Product {
    required name: str;
    description: str;
    imageUrl: str;
    websiteUrl: str;
    priceInUsdCents: int16;
  }
}
# TODO: think through more
# users should be able to favorite some instance of NeuralCache
# it should be tied to some mainTopic too
# type NeuralCache {
#   question: str;
#   answer: str;
# }
