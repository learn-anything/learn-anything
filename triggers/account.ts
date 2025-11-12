import { getAccountTriggers } from "blade/auth/triggers"
import { sendAuthEmail } from "../server/auth/mailer"

export default getAccountTriggers({
  sendEmail: async ({ account, token, type }) => {
    await sendAuthEmail({ account, token, type })
  },
})
