import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { useAccountOrGuest, useCoState } from "@/lib/providers/jazz-provider"
import {
  ContentHeader,
  SidebarToggleButton,
} from "@/components/custom/content-header"
import { Topic } from "@/lib/schema"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"
import { GuideCommunityToggle } from "./-toggle"
import { QuestionList } from "./-list"
import { QuestionThread } from "./-thread"

export const Route = createFileRoute(
  "/_layout/_pages/_protected/community/$topicName/",
)({
  component: () => <CommunityTopicComponent />,
})

interface Question {
  id: string
  title: string
  author: string
  timestamp: string
}

function CommunityTopicComponent() {
  const { topicName } = Route.useParams()
  const { me } = useAccountOrGuest()
  const topicID = useMemo(
    () => me && Topic.findUnique({ topicName }, JAZZ_GLOBAL_GROUP_ID, me),
    [topicName, me],
  )
  const topic = useCoState(Topic, topicID, {
    latestGlobalGuide: { sections: [] },
  })

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  )

  if (!topic) {
    return null
  }

  return (
    <div className="flex h-full flex-auto flex-col">
      <ContentHeader>
        <div className="flex min-w-0 shrink-0 items-center gap-1.5">
          <SidebarToggleButton />
          <div className="flex min-h-0 flex-col items-start">
            <p className="opacity-40">Topic</p>
            <span className="truncate text-left font-bold lg:text-xl">
              {topic.prettyName}
            </span>
          </div>
        </div>
        <div className="flex-grow" />
        <GuideCommunityToggle topicName={topic.name} />
      </ContentHeader>
      <div className="relative flex flex-1 justify-center overflow-hidden">
        <div
          className={`w-1/2 overflow-y-auto p-3 transition-all duration-300 ${
            selectedQuestion ? "opacity-700 translate-x-[-50%]" : ""
          }`}
        >
          <QuestionList
            topicName={topic.name}
            onSelectQuestion={(question: Question) =>
              setSelectedQuestion(question)
            }
          />
        </div>
        {selectedQuestion && (
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-y-auto">
            <QuestionThread
              question={{
                id: selectedQuestion.id,
                title: selectedQuestion.title,
                author: selectedQuestion.author,
                timestamp: selectedQuestion.timestamp,
              }}
              onClose={() => setSelectedQuestion(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
