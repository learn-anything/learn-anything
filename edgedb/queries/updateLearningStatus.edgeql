update User
  filter .email = $email
  set {
    topicsLearning += (select GlobalTopic filter .id = <uuid>$globalTopicId)
  }
