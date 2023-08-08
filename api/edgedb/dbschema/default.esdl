module default {
  type User {
    required name: str;
    required email: str;
    profileImage: str; # aws s3 image
    link wiki: Wiki # wiki of this user
  }
  type Wiki {
    required link user: User; # owner of this wiki
    topicSidebar: json; # topic names and their children (alphabetical order)
    topicConnections: json; # topic names and their connections (alphabetical order)
    multi link topics := .<wiki[is Topic]; # all topics belonging to this wiki
  }
  type Topic {
    required link wiki: Wiki; # wiki this topic belongs to
    required public: bool; # true = anyone can see the topic
    required name: str; # name of topic in form of `topic-name`
    required content: str; # markdown
    prettyName: str; # name of topic in form of `Topic Name`
    parentTopic: Topic; # parent topic
    multi mentionedTopics: Topic; # topic mentions
    multi topicBacklinks: Topic; # mentions of this topic in other topics
    multi link notes := .<topic[is Note];
    multi link links := .<topic[is Link];
    constraint exclusive on ((.name, .wiki)); # users can't have two topics with same name
  }
  type Note {
    required topic: Topic; # topic this note belongs to
    required public: bool; # if true, anyone can see the note
    required content: str;
    url: str;
  }
  type Link {
    required topic: Topic; # topic this note belongs to
    required public: bool; # if true, anyone can see the note
    required title: str;
    required url: str;
  }
  type GlobalTopic {
    required name: str; # name of topic in form of `topic-name`
    verified: bool; # if true, topic is valid global topic
  }
}
