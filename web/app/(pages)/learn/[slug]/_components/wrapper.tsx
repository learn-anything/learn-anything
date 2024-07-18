"use client"

import { useAccount } from "@/lib/providers/jazz-provider"

export const LearnDetailWrapper: React.FC<{ slug: string }> = ({ slug }) => {
  const account = useAccount()

  return (
    <div>
      <h2>{account.me.profile?.name}</h2>
      <p>{slug}</p>
    </div>
  )
}
