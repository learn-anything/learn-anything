module default {
  type User {
    required name: str;
    required email: str;
    profileImage: str; # aws s3 or cloudflare images url
    multi link topics := .<user[is Topic]; # all topics that have this user as author
  }
  type GlobalTopic {
    required name: str; # name of topic in form of `topic-name`
    verified: bool; # if true, topic is valid global topic
  }
  type Topic {
    required link user: User; # owner of this topic
    required public: bool; # if true, anyone can see the topic
    required name: str; # name of topic in form of `topic-name`
    required content: str; # markdown
    prettyName: str; # name of topic in form of `Topic Name`
    directParent: Topic; # parent topic
    multi link notes := .<topic[is Note];
    multi link links := .<topic[is Link];
    constraint exclusive on ((.name, .user)); # users can't have two topics with same name
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
}
