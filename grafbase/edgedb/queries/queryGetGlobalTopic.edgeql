with topicName := <str>$topicName,
     hankoId := <str>$hankoId
select User {
  learningStatus := "to_learn" if topicName in .topicsToLearn.name
  else "learning" if topicName in .topicsLearning.name
  else "learned" if topicName in .topicsLearned.name
  else "none",
  linksBookmarkedIds := (
    select User.linksBookmarked
    filter .mainTopic.name = topicName
  ).id,
  linksInProgressIds := (
    select User.linksInProgress
    filter .mainTopic.name = topicName
  ).id,
  linksCompletedIds := (
    select User.linksCompleted
    filter .mainTopic.name = topicName
  ).id,
  linksLikedIds := (
    select User.linksLiked
    filter .mainTopic.name = topicName
  ).id
}
filter .hankoId = hankoId
