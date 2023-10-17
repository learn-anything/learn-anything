with topicName := <str>$topicName,
     email := <str>$email
select User {
  learningStatus := "to_learn" if topicName in .topicsToLearn.name
  else "learning" if topicName in .topicsLearning.name
  else "learned" if topicName in .topicsLearned.name
  else "none",
  likedLinks: { id, url } filter .mainTopic.name = topicName
}
filter .email = email
