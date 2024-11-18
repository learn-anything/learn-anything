import * as React from "react"
import { useAccountOrGuest, useCoState } from "@/lib/providers/jazz-provider"
import { LaIcon } from "@/components/custom/la-icon"
import { Topic, PersonalLink, PersonalPage } from "@/lib/schema"
import { PublicGlobalGroup } from "@/lib/schema/master/public-group"
import { JAZZ_GLOBAL_GROUP_ID } from "@/lib/constants"
import { createFileRoute } from "@tanstack/react-router"
import AiSearch from "~/components/custom/ai-search"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_pages/search/")({
  component: () => <SearchComponent />,
})

interface SearchTitleProps {
  title: string
  count: number
}
interface SearchItemProps {
  icon: string
  href: string
  title: string
  subtitle?: string
  topic?: Topic
}

const SearchTitle: React.FC<SearchTitleProps> = ({ title, count }) => (
  <div className="flex w-full items-center">
    <h2 className="text-md font-semibold">{title}</h2>
    <div className="mx-4 flex-grow">
      <div className="h-px bg-result"></div>
    </div>
    <span className="text-base font-light text-opacity-55">{count}</span>
  </div>
)

const SearchItem: React.FC<SearchItemProps> = ({
  icon,
  href,
  title,
  subtitle,
  topic,
}) => (
  <div className="group flex min-w-0 items-center gap-x-4 rounded-md p-2 hover:bg-result">
    <LaIcon
      name={icon as "Square"}
      className="size-4 flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-50"
    />
    <div className="group flex items-center justify-between">
      <Link
        to={href}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="text-sm font-medium hover:text-primary hover:opacity-70"
      >
        {title}
      </Link>
      {subtitle && (
        <Link
          to={href}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="ml-2 truncate text-xs text-muted-foreground hover:underline"
        >
          {subtitle}
        </Link>
      )}
      {topic && (
        <span className="ml-2 text-xs opacity-45">
          {topic.latestGlobalGuide?.sections?.reduce(
            (total, section) => total + (section?.links?.length || 0),
            0,
          ) || 0}{" "}
          links
        </span>
      )}
    </div>
  </div>
)

const SearchComponent = () => {
  const [searchText, setSearchText] = React.useState("")
  const [showAiSearch, setShowAiSearch] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<{
    topics: Topic[]
    links: PersonalLink[]
    pages: PersonalPage[]
  }>({ topics: [], links: [], pages: [] })

  const { me } = useAccountOrGuest()

  const globalGroup = useCoState(PublicGlobalGroup, JAZZ_GLOBAL_GROUP_ID, {
    root: {
      topics: [],
    },
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setSearchText(value)

    if (!value) {
      setSearchResults({ topics: [], links: [], pages: [] })
      return
    }
    setSearchResults({
      topics:
        globalGroup?.root.topics.filter(
          (topic: Topic | null): topic is Topic =>
            topic !== null && topic.prettyName.toLowerCase().startsWith(value),
        ) || [],
      links:
        me?._type === "Anonymous"
          ? []
          : me?.root?.personalLinks?.filter(
              (link: PersonalLink | null): link is PersonalLink =>
                link !== null && link.title.toLowerCase().startsWith(value),
            ) || [],
      pages:
        me?._type === "Anonymous"
          ? []
          : me?.root?.personalPages?.filter(
              (page): page is PersonalPage =>
                page !== null &&
                page.title !== undefined &&
                page.title.toLowerCase().startsWith(value),
            ) || [],
    })
  }

  const clearSearch = () => {
    setSearchText("")
    setSearchResults({ topics: [], links: [], pages: [] })
    setShowAiSearch(false)
  }

  return (
    <div className="flex h-full flex-auto flex-col overflow-hidden">
      <div className="flex h-full w-full justify-center overflow-y-auto">
        <div className="w-full max-w-[70%] sm:px-6 lg:px-8">
          <div className="relative mb-2 mt-5 flex w-full flex-row items-center transition-colors duration-300">
            <div className="relative my-5 flex w-full items-center space-x-2">
              <LaIcon
                name="Search"
                className="absolute left-4 size-4 flex-shrink-0 text-foreground"
              />
              <input
                autoFocus
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search topics, links, pages"
                className="w-full rounded-lg border border-neutral-300 p-2 pl-8 focus:outline-none dark:border-neutral-600 dark:bg-input"
              />
              {searchText && (
                <LaIcon
                  name="X"
                  className="absolute right-3 size-4 flex-shrink-0 cursor-pointer text-foreground/50"
                  onClick={clearSearch}
                />
              )}
            </div>
          </div>
          <div className="relative w-full pb-5">
            {Object.values(searchResults).some((arr) => arr.length > 0) ? (
              <div className="space-y-1">
                {searchResults.links.length > 0 && (
                  <>
                    <SearchTitle
                      title="Links"
                      count={searchResults.links.length}
                    />
                    {searchResults.links.map((link) => (
                      <SearchItem
                        key={link.id}
                        icon="Square"
                        href={link.url}
                        title={link.title}
                        subtitle={link.url}
                      />
                    ))}
                  </>
                )}
                {searchResults.pages.length > 0 && (
                  <>
                    <SearchTitle
                      title="Pages"
                      count={searchResults.pages.length}
                    />
                    {searchResults.pages.map((page) => (
                      <SearchItem
                        key={page.id}
                        icon="Square"
                        href={`/pages/${page.id}`}
                        title={page.title || ""}
                      />
                    ))}
                  </>
                )}
                {searchResults.topics.length > 0 && (
                  <>
                    <SearchTitle
                      title="Topics"
                      count={searchResults.topics.length}
                    />
                    {searchResults.topics.map((topic) => (
                      <SearchItem
                        key={topic.id}
                        icon="Square"
                        href={`/${topic.name}`}
                        title={topic.prettyName}
                        topic={topic}
                      />
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="mt-5">
                {/* {searchText && !showAiSearch && ( */}
                {searchText && (
                  <div
                    className="cursor-default rounded-lg bg-blue-700 p-4 font-semibold text-white"
                    // onClick={() => setShowAiSearch(true)}
                  >
                    ✨ Didn&apos;t find what you were looking for? Will soon
                    have AI assistant builtin
                  </div>
                )}
                {showAiSearch && <AiSearch searchQuery={searchText} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
