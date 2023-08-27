# Short summary:
# User: user of the app. owns one wiki
# Wiki: collection of topics
# Topic: contains markdown content (user's knowledge on the topic) + notes/links
# GlobalTopic: public GlobalTopic is found on learn-anything.xyz/<GlobalTopic>
module default {
  type User {
    # unique username
    required name: str {
      constraint exclusive;
    };
    # unique email
    required email: str {
      constraint exclusive;
    };
    # custom name user can choose for themselves similar to X
    displayName: str;
    # aws s3 url with image
    profileImage: str;
    # user owns one wiki
    link wiki: Wiki;
    # topics user wants to learn
    multi topicsToLearn: GlobalTopic;
    # topics user is learning
    multi topicsLearning: GlobalTopic;
    # topics user learned
    multi topicsLearned: GlobalTopic;
    # links user has `completed` in some way
    multi completedLinks: Link;
    # links user has reported
    multi reportedLinks: Link;
    # notes user has reported
    multi reportedNotes: Note;
    # list of topics user is moderating
    multi topicsModerated: GlobalTopic;
    # date until user has paid membership for
    # TODO: not sure if type should be datetime
    proMemberUntil: datetime;
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
    prettyName: str;
    # true = anyone can see the topic. false = only user can see topic
    required public: bool;
    # each published topic is part of a global topic
    globalTopic: GlobalTopic;
    # markdown content of topic (user's knowledge/thoughts on the topic)
    required content: str;
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
    # main topic this note belongs to
    required topic: Topic;
    # title of the link
    required title: str;
    # url of the link
    required url: str;
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
    # related links to this link
    # could be link to `Code` or `Tweet` or some other Link
    multi relatedLinks: Link;
  }
  type GlobalTopic {
    # url friendly unique name of topic. i.e. 'physics' or 'linear-algebra'
    # lowercase + dash separate words
    required name: str {
      constraint exclusive;
    };
    # pretty version of `name`, uppercased nicely, proper capitalisation
    # i.e. Physics
    prettyName: str;
    # true = topic is available to anyone to see
    # i.e. learn-anything.xyz/physics
    # false = not available for all to see
    # global topics are first reviewed by LA before becoming public
    public: bool;
    # parent topic if there is one
    parentTopic: GlobalTopic;
    # guide for the topic, improved by community
    guide: Guide;
    # used to generate interactive graph of topics for the global topic
    # TODO: find out structure needed for this
    topicGraph: json;
    # related topics to this global topic
    multi relatedTopics: Topic;
    # all links related to the global topic
    multi relatedLinks: Link;
    # all notes related to the global topic
    multi relatedNotes: Note;
  }
  type Guide {
    # summary of the topic
    required topicSummary: str;
    # guide can be modified by submitting changes to it
    # when changes land to guide, a new revision with time stamp is created
    # there is a way to view history of the guide as it improves by picking time stamps
    lastUpdateTime: str;
    # guide is split by sections
    multi sections: GuideSection;
  }
  type GuideSection {
    # title of section
    required title: str;
    # list of links in a section
    multi links: Link;
    # position of the section in the guide
    order: int16;
  }
}
