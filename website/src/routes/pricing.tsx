import { Show, createSignal } from "solid-js"
import { useNavigate } from "solid-start"
import clsx from "clsx"
import { useMobius } from "../root"
import Icon from "../components/Icon"
import ModalWithMessageAndButton from "../components/ModalWithMessageAndButton"
import { useUser } from "../GlobalContext/user"

export default function Pricing() {
  const [planChosen, setPlanChosen] = createSignal("monthly")
  const navigate = useNavigate()
  const mobius = useMobius()
  const user = useUser()
  const [showModalWithSignUpMessage, setShowModalWithSignUpMessage] =
    createSignal(false)

  return (
    <>
      <style>
        {`
        #PayCard {
          flex-direction: column;
          height: fit-content;
          border-radius: 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.3);
          border-top: 1px solid rgba(148, 163, 184, 0.3);
        }

        #PayInfo {
          flex-direction: column;
          gap: 24px;
          padding: 0 10%;
        }
        #InfoFree {
          border-bottom: 1px solid rgba(148, 163, 184, 0.3);
        }
        #Plans {
          flex-direction: column;
          padding: 0 10%;
        }
        #PayMain {
          padding: 0;
        }
        @media (min-width: 700px) {
          #PayCard {
            flex-direction: row;
            height: 100%;
            border: 1px solid rgba(148, 163, 184, 0.3);
            border-radius: 15px;
          }
          #PayInfo {
            flex-direction: row;
            gap: 0;
            padding: 0;
          }
          #InfoFree {
            border-right: 1px solid rgba(148, 163, 184, 0.3);
            border-bottom: 0px;
          }
          #Plans {
            flex-direction: row;
            padding: 0px;
          }
          #PayMain {
            padding: 0 15%;
          }
        }
      `}
      </style>
      <div class="h-full w-screen flex flex-col gap-10 dark:bg-neutral-900 dark:text-white bg-[#fafafa] text-black pb-[50px]">
        <Show when={showModalWithSignUpMessage()}>
          <ModalWithMessageAndButton
            message="You need to sign up first to become a member"
            buttonText="Sign Up"
            buttonAction={() => {
              navigate("/auth")
            }}
            onClose={() => {
              setShowModalWithSignUpMessage(false)
            }}
          />
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
          <Show when={!user.user.signedIn}>
            <div
              class="cursor-pointer bg-black text-white px-4 p-1 rounded-full hover:scale-[1.1]"
              onClick={() => {
                localStorage.setItem("pageBeforeSignIn", location.pathname)
                navigate("/auth")
              }}
            >
              Log In
            </div>
          </Show>
        </div>
        <div id="PayMain" class="h-full w-full px-[15%] flex flex-col gap-6">
          <div id="Plans" class="flex gap-4  justify-between">
            <div class="font-bold text-2xl px-1">Choose a plan</div>
            <div class="flex w-fit dark:bg-neutral-800 bg-[#f2f2f2] p-0.5 rounded-full items-center gap-1 text-sm font-light">
              <div
                class={clsx(
                  "p-0.5 px-2 rounded-full cursor-pointer",
                  planChosen() === "monthly" && "bg-white dark:bg-neutral-900"
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
                  planChosen() === "yearly" && "bg-white dark:bg-neutral-900"
                )}
                onClick={() => {
                  setPlanChosen("yearly")
                }}
              >
                Yearly -20%
              </div>
            </div>
          </div>
          <div
            id="PayCard"
            class="w-full h-full rounded-xl bg-white dark:bg-neutral-900 flex"
          >
            <div
              id="InfoFree"
              class="w-full min-h-full p-8 flex flex-col gap-6 justify-between"
            >
              <div class="border border-slate-400 border-opacity-30 px-2 p-0.5 w-fit rounded-full font-light text-sm">
                Free
              </div>
              <div class="w-full h-full flex flex-col gap-4">
                <div class="text-2xl font-semibold">
                  $0{" "}
                  <span class="opacity-90 font-light text-sm">per month</span>
                </div>
                <div class="font-light h-[280px] opacity-60 flex flex-col gap-3">
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
                  "flex items-center justify-center rounded-lg bg-black w-full p-3 opacity-80 text-white",
                  true && "bg-neutral-800 opacity-80 text-gray-300"
                )}
              >
                Current plan
              </div>
            </div>
            <div class="w-full h-full p-8 flex flex-col gap-6 justify-between">
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
                <div class="font-light h-fit opacity-60 flex flex-col gap-3">
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
                class="flex items-center justify-center rounded-lg bg-black w-full p-3 opacity-80 text-white cursor-pointer"
                onClick={async () => {
                  if (user.user.signedIn) {
                    if (planChosen() === "monthly") {
                      const res = await mobius.query({
                        stripe: {
                          where: {
                            plan: "month",
                            userEmail: user.user.email
                          },
                          select: true
                        }
                      })
                      console.log(res, "res")
                      // @ts-ignore
                      const stripeCheckout = res.data.stripe
                      window.location.href = stripeCheckout
                    } else {
                      const res = await mobius.query({
                        stripe: {
                          where: {
                            plan: "year",
                            userEmail: user.user.email
                          },
                          select: true
                        }
                      })
                      // @ts-ignore
                      const stripeCheckout = res.data.stripe
                      window.location.href = stripeCheckout
                    }
                  } else {
                    setShowModalWithSignUpMessage(true)
                  }
                }}
              >
                Become member
              </div>
            </div>
          </div>
          <div id="PayInfo" class="flex w-full h-full relative">
            <div id="InfoTitle" class="w-full font-light text-3xl sticky">
              <div
                onClick={() => {
                  // TODO: grafbase call to do stripe checkout
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                }}
              >
                Become a member
              </div>
              <div class="opacity-50 text-xl">
                Unlock premium features and help us build the future of
                education together ♥️
              </div>
            </div>
            <div class="w-full flex flex-col gap-4 text-lg font-light opacity-60 text-[14px]">
              <div>
                Learn Anything is a{" "}
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
                the community. Each change you request is reviewed by experts of
                the topic and if the change is good, it gets merged. You can
                create your own guides and publish them on your own too.
              </div>
              <div>
                This is all just the beginning. Learn Anything aims to be the
                first to create personalised AGI in a fully open way. Not
                controlled by any entity. No closed code/data.
              </div>
              <div>
                In future, LA will also be a better and open source version of{" "}
                <a href="https://www.google.com">Google</a> (will create our own
                crawler and index the web). Better and cheaper version of{" "}
                <a href="https://gumroad.com">Gumroad</a> (0.5 % comission +{" "}
                <a href="https://solana.com">Solana</a> support). Open source
                and better version of <a href="https://obsidian.md">Obsidian</a>{" "}
                (keep your content in markdown, just have first class sync to
                LA, automatic indexing of all your notes and creation of{" "}
                <a href="https://chat.openai.com">ChatGPT</a> like AI interface
                to all your knowledge with different privacy controls). Better
                version of <a href="https://x.com">X</a> with full control of
                the algorithm, the client and all the data flowing through the
                system with payouts to creators done in instant and not monthly.
                And a lot lot more. The code is open. The data is open. It's up
                to you what this project can become.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
