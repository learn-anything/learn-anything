import * as React from "react"
import { useAccount } from "@/lib/providers/jazz-provider"
import { NavItem } from "~/components/custom/nav-item"
import { ListOfTasks } from "~/lib/schema"

export const LinkCollection: React.FC = () => {
  // will delete soon after do the versioning
  const { me: tempMe } = useAccount()
  const { me } = useAccount({
    root: {
      personalLinks: [],
      personalPages: [],
      topicsWantToLearn: [],
      topicsLearning: [],
      topicsLearned: [],
      tasks: [],
    },
  })

  if (!tempMe.root?.tasks) {
    tempMe.root!.tasks = ListOfTasks.create([], { owner: tempMe })
  }

  const linkCount = me?.root.personalLinks?.length || 0
  const pageCount = me?.root.personalPages?.length || 0
  const taskCount = me?.root.tasks?.length || 0

  const topicCount =
    (me?.root.topicsWantToLearn?.length || 0) +
    (me?.root.topicsLearning?.length || 0) +
    (me?.root.topicsLearned?.length || 0)

  return (
    <div className="flex flex-col gap-px py-2">
      <NavItem to="/links" title="Links" icon="Link" count={linkCount} />
      <NavItem to="/topics" title="Topics" icon="Hash" count={topicCount} />
      <NavItem to="/pages" title="Pages" icon="Layers" count={pageCount} />
      <NavItem
        to="/tasks"
        title="Tasks"
        icon="BookOpenCheck"
        count={taskCount}
      />
    </div>
  )
}
