import { Account, co, CoList, CoMap, Group, Profile } from "jazz-tools"

export class AccountRoot extends CoMap {
  websites = co.ref(ListOfWebsites)
  activeUrls = co.ref(ListOfUrls)
}

export class Website extends CoMap {
  url = co.string // unique
  name = co.string
  urls = co.ref(ListOfUrls)
}
export class ListOfWebsites extends CoList.Of(co.ref(Website)) {}

export class Url extends CoMap {
  absoluteUrl = co.string
  content = co.string
}
export class ListOfUrls extends CoList.Of(co.ref(Url)) {}

export class JazzAccount extends Account {
  root = co.ref(AccountRoot)
  migrate(this: JazzAccount) {
    if (this.root === undefined) {
      this.root = AccountRoot.create({
        websites: ListOfWebsites.create([]),
        activeUrls: ListOfUrls.create([]),
      })
    }
  }
}

declare module "jazz-react" {
  interface Register {
    Account: JazzAccount
  }
}
