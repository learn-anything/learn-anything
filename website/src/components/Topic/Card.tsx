import { For, Match, Switch } from "solid-js"
import { useGlobalTopic } from "../../GlobalContext/global-topic"

type Link = {
  title: string
  url: string
  year?: string
  type?: string
  author?: string
  time?: string
  relatedLinks?: Link[]
}

type Props = {
  name: string
  links?: Link[]
}

export default function Card(props: Props) {
  const globalTopic = useGlobalTopic()

  // TODO: finish component, uncomment
  // currently commented as we don't have the data from db for users who learned topic
  return (
    <>
      <div
        class="w-full relative flex flex-col gap-2 border border-[#EAEAEA] rounded-[4px] overflow-auto"
        style={{
          "max-height": "280px",
        }}
      >
        <Switch>
          <Match when={props.name === "Learners"}>
            <div class="">
              <div class="flex items-center">
                <div class="font-semibold p-2 px-2 pl-4">{props.name}</div>
                {/* TODO: have the 1 come from the server */}
                <div class="px-1 mt-[0.8px] p-[1px] h-fit text-[12px] font-light bg-neutral-200 flex items-center justify-center rounded-full w-fit">
                  1
                </div>
              </div>
              <div class="flex font-light items-center p-1 px-4  gap-4 text-black">
                <div class="relative w-[90px] h-[35px]">
                  {/* <For each={topic.topic.usersWantToLearn}>
                  {(learner, i) => {
                    // only show 3 learners max
                    if (i() > 2) {
                      return
                    }
                    return (
                      <div
                        style={{
                          "z-index": i(),
                          transform: `translateX(${i() * 30}px)`,
                        }}
                        class="w-[35px] p-[2px] absolute flex items-center justify-center h-[35px] rounded-full bg-white"
                      >
                        <a href="">
                          <img
                            src={learner.image}
                            alt=""
                            class="rounded-full"
                          />
                        </a>
                      </div>
                    )
                  }}
                </For> */}
                </div>
                {/* <div>{topic.topic.usersWantToLearn.length} want to learn</div> */}
              </div>
              <div class="flex font-light items-center p-1 px-4 gap-4 text-black">
                <div class="relative w-[90px] h-[35px]">
                  {/* <For each={topic.topic.usersCurrentlyLearning}>
                  {(learner, i) => {
                    // only show 3 learners max
                    if (i() > 2) {
                      return
                    }
                    return (
                      <div
                        style={{
                          "z-index": i(),
                          transform: `translateX(${i() * 30}px)`,
                        }}
                        class="w-[35px] p-[2px] absolute flex items-center justify-center h-[35px] rounded-full bg-white"
                      >
                        <a href="">
                          <img
                            src={learner.image}
                            alt=""
                            class="rounded-full"
                          />
                        </a>
                      </div>
                    )
                  }}
                </For> */}
                </div>
                {/* <div>
                {topic.topic.usersCurrentlyLearning.length} currently learning
              </div> */}
              </div>
              <div class="flex font-light items-center p-1 px-4 gap-4 text-black">
                <div class="relative w-[90px] h-[35px]">
                  <For each={globalTopic.globalTopic.usersHaveLearned}>
                    {(learner, i) => {
                      // only show 3 learners max
                      if (i() > 2) {
                        return
                      }
                      return (
                        <div
                          style={{
                            "z-index": i(),
                            transform: `translateX(${i() * 30}px)`,
                          }}
                          class="w-[35px] p-[2px] absolute flex items-center justify-center h-[35px] rounded-full bg-white"
                        >
                          <a href="">
                            <img
                              src={learner.image}
                              alt=""
                              class="rounded-full"
                            />
                          </a>
                        </div>
                      )
                    }}
                  </For>
                </div>
                {/* <div>{topic.topic.usersHaveLearned.length} have learned</div> */}
              </div>
              <div class="flex  font-light items-center justify-between  px-4  border-t border-slate-400 border-opacity-30 p-3 gap-4 text-black">
                <div class="flex items-center gap-4">
                  <div class="relative w-[90px] h-[35px]">
                    {/* <For each={topic.topic.moderators}>
                    {(learner, i) => {
                      // only show 3 learners max
                      if (i() > 2) {
                        return
                      }
                      return (
                        <div
                          style={{
                            "z-index": i(),
                            transform: `translateX(${i() * 30}px)`,
                          }}
                          class="w-[35px] p-[2px] absolute flex items-center justify-center h-[35px] rounded-full bg-white"
                        >
                          <a href="">
                            <img
                              src={learner.image}
                              alt=""
                              class="rounded-full"
                            />
                          </a>
                        </div>
                      )
                    }}
                  </For> */}
                  </div>
                  {/* <div>{topic.topic.moderators.length} moderators</div> */}
                </div>
                <div class="text-blue-400 font-light text-[14px]">
                  request to join
                </div>
              </div>
            </div>
          </Match>
          <Match when={props.name === "Suggested"}>
            <div>
              <div class="flex items-center">
                <div class="font-semibold p-2 px-2 pl-4">{props.name}</div>
                <div class="px-1 mt-[0.8px] p-[1px] h-fit text-[12px] font-light bg-neutral-200 flex items-center justify-center rounded-full w-fit">
                  1
                </div>
              </div>
              <div class="px-4 p-2 flex items-center gap-2">
                <div class="h-[35px] w-[35px] rounded-full bg-neutral-200"></div>
                <div class="font-light text-black">Julius ceasar</div>
              </div>
              <div class="px-4 p-2 flex items-center gap-2">
                <div class="h-[35px] w-[35px] rounded-full bg-neutral-200"></div>
                <div class="font-light text-black">Julius ceasar</div>
              </div>
              <div class="px-4 p-2 flex items-center gap-2">
                <div class="h-[35px] w-[35px] rounded-full bg-neutral-200"></div>
                <div class="font-light text-black">Julius ceasar</div>
              </div>
            </div>
          </Match>
        </Switch>
      </div>
    </>
  )
}
