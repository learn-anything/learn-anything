with topicName := <str>$topicName,
     hankoId := <str>$hankoId
select User {
  learningStatus := "to_learn" if topicName in .topicsToLearn.name
  else "learning" if topicName in .topicsLearning.name
  else "learned" if topicName in .topicsLearned.name
  else "none"
}
filter .hankoId = hankoId
