update User
  filter .email = <str>$email
  if <str>$arg === "learning"
  set {
    topicsLearning += (select GlobalTopic filter .id = <uuid>$globalTopicId)
  }
  if <str>$arg === "to learn"
  set {
    topicsToLearn += (select GlobalTopic filter .id = <uuid>$globalTopicId)
  }
