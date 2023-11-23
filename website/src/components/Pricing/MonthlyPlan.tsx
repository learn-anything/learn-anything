import { Show, createSignal } from "solid-js"
import clsx from "clsx"
import { useUser } from "../../GlobalContext/user"
import { ui } from "@la/shared"
import { useMobius } from "../../root"
import { toRelativeTime } from "../../lib/lib"
import { parseResponse } from "@la/shared/lib"

interface Props {
  setShowLetsTalkModal: (state: boolean) => void
  setShowModalWithSignUpMessage: (state: boolean) => void
}

export default function MonthlyPlan(props: Props) {
  const [waitingForStripe, setWaitingForStripe] = createSignal(false)
  const mobius = useMobius()
  const user = useUser()

  return (
    <div class="w-full h-full p-8 flex flex-col gap-6 justify-between">
      <div class="flex justify-between items-center">
        <div class="px-2 p-0.5 w-fit rounded-full font-light text-sm bg-[#E7EBF9] text-[#3B5CCC]">
          ♥️ Member
        </div>
        <Show
          when={
            user.user.stripePlan === "month" &&
            user.user.subscriptionStopped !== true
          }
          fallback={
            <Show when={user.user.stripePlan === "month"}>
              <div>plan ends {toRelativeTime(user.user.memberUntil!)}</div>
            </Show>
          }
        >
          <div
            onClick={() => {
              props.setShowLetsTalkModal(true)
            }}
            class="cursor-pointer border border-red-600 px-3 p-1 rounded-[4px] text-[14px] text-red-600 opacity-80 hover:bg-red-600 hover:text-white"
          >
            Cancel plan
          </div>
        </Show>
      </div>
      <div class="w-full h-full flex flex-col gap-4">
        <div class="text-2xl font-semibold gap-2">
          $3 <span class="opacity-90 font-light text-sm">per month</span>
        </div>

        <div class="font-light opacity-60 flex flex-col gap-3">
          <div>• See in full 1,100+ high quality guides on various topics</div>
          <div>• Mark any topic as learned / to learn / learning</div>
          <div>
            • Mark any link you find in LA as completed or to complete later
          </div>
          <div>• Add your own links and track progress on them</div>
          <div>• Publish your notes to your own personal wiki page</div>
          <div>
            • Sync all your private/public notes with a mobile app (beta)
          </div>
          <div>• AI interface to all your notes (beta) </div>
        </div>
      </div>

      <Show
        when={user.user.stripePlan !== "month"}
        fallback={
          <div
            class={clsx(
              "flex items-center justify-center rounded-lg bg-black w-full p-3 opacity-80 text-white",
              // TODO: remove this 'true', not sure why it's here
              true && "bg-neutral-800 opacity-80 text-gray-300"
            )}
          >
            Current plan
          </div>
        }
      >
        <div
          class="flex items-center justify-center rounded-lg bg-black w-full p-3 opacity-80 text-white cursor-pointer"
          onClick={async () => {
            if (!user.user.signedIn) {
              props.setShowModalWithSignUpMessage(true)
              return
            }
            setWaitingForStripe(true)
            const res = await mobius.query({
              stripe: {
                where: {
                  plan: "month",
                  userEmail: user.user.email
                },
                select: true
              }
            })
            const [data] = parseResponse(res)
            // @ts-ignore
            const stripeCheckout = data?.stripe
            // @ts-ignore
            window.location.href = stripeCheckout
          }}
        >
          <Show
            when={!waitingForStripe()}
            fallback={<ui.Icon name="Loader" border="white" />}
          >
            <div>Become member</div>
          </Show>
        </div>
      </Show>
    </div>
  )
}
