module default {
  type User {
    required name: str;
    required email: str;
    required profileImage: str; # aws s3 or cloudflare images url
    multi topics: Topic;
  }
  type Topic {
    required name: str;
    required content: str; # markdown
    multi notes: Note;
    multi links: Link;
  }
  type Note {
    required note: str;
    url: str;
  }
  type Link {
    required title: str;
    required url: str;
  }
}
