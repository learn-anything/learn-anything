module default {
  type User {
    required name: str;
    required email: str;
    profileImage: str; # aws s3 or cloudflare images url
    multi link topics := .<user[is Topic]; # all topics that have this user as author
  }
  type Topic {
    required link user: User; # owner of this topic
    required name: str;
    required content: str; # markdown
    multi notes: Note;
    multi links: Link;
    constraint exclusive on ((.name, .user)); # users can't have two topics with same name
  }
  type Note {
    required content: str;
    url: str;
  }
  type Link {
    required title: str;
    required url: str;
  }
}
