import { getAllGlobalLinks } from "../crud/global-link"
import { updateTopicLearningStatus } from "../crud/global-topic"
import { updateUserMemberUntilDate } from "../crud/user"

async function main() {
  // const links = await getAllGlobalLinks()
  // console.log(links, "links")
  await updateTopicLearningStatus(
    process.env.LOCAL_USER_HANKO_ID!,
    "3d-printing",
    "learning",
  )

  // let today = new Date()
  // let nextMonth = today.getMonth() + 1
  // let nextYear = today.getFullYear()
  // let nextMonthDate = new Date(nextYear, nextMonth, today.getDate())

  // await updateUserMemberUntilDate(
  //   process.env.LOCAL_USER_HANKO_ID!,
  //   nextMonthDate,
  // )
}

await main()
