import { Show, createSignal, onMount } from "solid-js"
import { useNavigate } from "solid-start"
import clsx from "clsx"
import { signedIn } from "../../lib/auth"
import { useMobius } from "../root"
import Icon from "../components/Icon"

export default function Pricing() {
  const [planChosen, setPlanChosen] = createSignal("monthly")
  const [showModal, setShowModal] = createSignal(false)
  const navigate = useNavigate()
  const [signedInSignal, setSignedInSignal] = createSignal(false)
  const mobius = useMobius()

  onMount(() => {
    if (signedIn()) {
      setSignedInSignal(true)
    }
  })

  return (
    <>
      <style></style>
      <div class="h-full w-screen flex flex-col gap-10 bg-[#fafafa] text-black pb-[50px]">
        <Show when={showModal()}>
          <div class="fixed h-screen w-screen flex top-0 right-0 items-center z-10 justify-center">
            <div
              class="absolute w-screen h-screen top-0 left-0 backdrop-blur-sm z-20"
              onClick={() => {
                setShowModal(false)
              }}
            ></div>
            <div class="h-fit w-[375px] z-30 rounded-lg border bg-white border-slate-400 border-opacity-30 flex flex-col justify-between gap-6 p-6">
              <div class="text-xl font-light">Create new profile</div>
              <button
                class="cursor-pointer bg-black text-white text-sm px-4 p-2 rounded-lg hover:scale-[1.1]"
                onClick={() => {
                  navigate("/auth")
                }}
              >
                Sign up / log in with email
              </button>
            </div>
          </div>
        </Show>
        <div class="h-[80px] px-[15%] w-full flex items-center justify-between gap-6 font-semibold">
          <div
            class="w-[30px] h-[30px] cursor-pointer"
            onClick={() => {
              navigate("/")
            }}
          >
            {/* <img class="rounded-full" src="/logo.png" alt="" /> */}
            <Icon name="Home" />
          </div>
          <Show when={!signedInSignal()}>
            <div
              class="cursor-pointer bg-black text-white px-4 p-1 rounded-full hover:scale-[1.1]"
              onClick={() => {
                navigate("/auth")
              }}
            >
              Log In
            </div>
          </Show>
        </div>
        <div class="h-full w-full px-[15%] flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="font-bold text-2xl">Choose a plan</div>
            <div class="flex bg-[#f2f2f2] p-0.5 rounded-full items-center gap-1 text-sm font-light">
              <div
                class={clsx(
                  "p-0.5 px-2 rounded-full cursor-pointer",
                  planChosen() === "monthly" && "bg-white"
                )}
                onClick={() => {
                  setPlanChosen("monthly")
                }}
              >
                Monthly
              </div>
              <div
                class={clsx(
                  "p-0.5 px-2 cursor-pointer rounded-full",
                  planChosen() === "yearly" && "bg-white"
                )}
                onClick={() => {
                  setPlanChosen("yearly")
                }}
              >
                Yearly -20%
              </div>
            </div>
          </div>
          <div class="w-full h-[500px] border border-slate-400 border-opacity-30 rounded-xl bg-white flex">
            <div class="w-full h-full border-r border-slate-400 border-opacity-30 p-8 flex flex-col gap-6 justify-between">
              <div class="border border-slate-400 border-opacity-30 px-2 p-0.5 w-fit rounded-full font-light text-sm">
                Free
              </div>
              <div class="w-full h-full flex flex-col gap-4">
                <div class="text-2xl font-semibold">
                  $0{" "}
                  <span class="opacity-90 font-light text-sm">per month</span>
                </div>
                <div class="font-light opacity-60 flex flex-col gap-3">
                  <div>
                    • Free{" "}
                    <a href="https://github.com/learn-anything/learn-anything.xyz">
                      open source
                    </a>{" "}
                    desktop app to edit your notes like Obsidian
                  </div>
                  <div>
                    • See parts of guides available. Explore the topic graph.
                  </div>
                </div>
              </div>
              <div
                class={clsx(
                  "flex items-center justify-center rounded-lg bg-black w-full h-16 opacity-80 text-white",
                  true && "bg-neutral-800 opacity-80 text-gray-300"
                )}
              >
                Current plan
              </div>
            </div>
            <div class="w-full h-full p-8 flex flex-col gap-6">
              <div class="px-2 p-0.5 w-fit rounded-full font-light text-sm bg-[#E7EBF9] text-[#3B5CCC]">
                ♥️ Member
              </div>
              <div class="w-full h-full flex flex-col gap-4">
                <Show when={planChosen() === "monthly"}>
                  <div class="text-2xl font-semibold gap-2">
                    $6{" "}
                    <span class="opacity-90 font-light text-sm">per month</span>
                  </div>
                </Show>
                <Show when={planChosen() === "yearly"}>
                  <div class="text-2xl font-semibold gap-2">
                    $60{" "}
                    <span class="opacity-90 font-light text-sm">
                      per year (5$ / month)
                    </span>
                  </div>
                </Show>
                <div class="font-light opacity-60 flex flex-col gap-2 h-[250px] overflow-auto">
                  <div>
                    • See in full 1,000+ high quality guides on various topics
                  </div>
                  <div>• Mark any topic as learned / to learn / learning</div>
                  <div>• Publish your notes to your own personal wiki page</div>
                  <div>
                    • Mark any link you find in LA as completed or to complete
                    later
                  </div>
                  <div>
                    • Sync all your private/public notes with a mobile app
                    (soon)
                  </div>
                  <div>• AI interface to all your notes (soon) </div>
                </div>
              </div>
              <div
                class="flex items-center justify-center rounded-lg bg-black w-full h-16 opacity-80 text-white cursor-pointer"
                onClick={async () => {
                  if (signedInSignal()) {
                    if (planChosen() === "monthly") {
                      await mobius.query({
                        stripe: {
                          where: {
                            plan: "month"
                          },
                          select: true
                        }
                      })
                    } else {
                      await mobius.query({
                        stripe: {
                          where: {
                            plan: "year"
                          },
                          select: true
                        }
                      })
                    }
                  } else {
                    setShowModal(true)
                  }
                }}
              >
                Select this plan
              </div>
            </div>
          </div>
          <div class="flex w-full h-full relative">
            <div class="w-full font-light text-3xl sticky">
              <div>Become a member</div>
              <div class="opacity-50 text-xl">
                Unlock premium features and help us build the future of
                education together ♥️
              </div>
            </div>
            <div class="w-full flex flex-col gap-4 text-lg font-light">
              <div>
                Learn Anything first came to existence in{" "}
                <a href="https://wiki.nikiv.dev/looking-back/2017">2017</a> to
                solve the problem of how does knowledge connect.
              </div>
              <div>
                Since day 1 it has been a{" "}
                <a href="https://github.com/learn-anything/learn-anything.xyz">
                  fully open source project
                </a>{" "}
                with an active community on{" "}
                <a href="https://discord.com/invite/bxtD8x6aNF">Discord</a>.
              </div>
              <div>
                The end goal of Learn Anything is to become the best place and
                tool for keeping track of what you know. What ideas you have.
                What you want to learn next. What you don't know yet. And how
                you can learn that in the most optimal way possible given what
                you know already.
              </div>
              <div>
                All this is achieved by using a powerful graph database that
                connects everything together. LA consists of many topics. Users
                create topics and connect them to other topics in their own
                notes. LA takes these connections and constructs a powerful
                graph. The first version of it you can already see on the site.
              </div>
              <div>
                Each topic has an official guide. This guide is contributed by
                the community. You. Each change you request is reviewed by
                experts of the topic and if the change is good it gets merged.
                You can create your own guides and publish them on your own too.
              </div>
              <div>
                Each topic has an official guide. This guide is contributed by
                the community. You. Each change you request is reviewed by
                experts of the topic and if the change is good it gets merged.
                You can create your own guides and publish them on your own too.
              </div>
              <div>
                This is all just the beginning. Learn Anything will be the first
                to create AGI in a fully open way. Not controlled by any entity.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
