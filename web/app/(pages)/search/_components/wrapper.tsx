"use client"

import { useAccount } from "@/lib/providers/jazz-provider"

export const SearchWrapper = () => {
  const account = useAccount()

  return (
    <div>
      <h2>{account.me.profile?.name}</h2>
      <p>Search Page</p>
    </div>
  )
}
