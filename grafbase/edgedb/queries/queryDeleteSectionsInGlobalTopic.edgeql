with topicName := <str>$topicName

delete GlobalGuideSection
filter .<sections[is GlobalGuide].<latestGlobalGuide[is GlobalTopic].name = topicName
