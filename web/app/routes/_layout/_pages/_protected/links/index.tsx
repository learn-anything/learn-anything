import { atom } from "jotai"
import { LinkBottomBar } from "./-bottom-bar"
import { createFileRoute } from "@tanstack/react-router"
import { LinkHeader } from "./-header"
import { LinkManage } from "./-manage"
import { LinkList } from "./-list"
import { z } from "zod"
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter"

const linkSearchSchema = z.object({
  state: fallback(
    z.enum(["all", "wantToLearn", "learning", "learned"]),
    "all",
  ).default("all"),
  create: fallback(z.boolean(), false).default(false),
  editId: fallback(z.string(), "").default(""),
})

export const Route = createFileRoute("/_layout/_pages/_protected/links/")({
  validateSearch: zodSearchValidator(linkSearchSchema),
  component: () => <LinkComponent />,
})

export const isDeleteConfirmShownAtom = atom(false)

function LinkComponent() {
  return (
    <>
      <LinkHeader />
      <LinkManage />
      <LinkList />
      <LinkBottomBar />
    </>
  )
}
