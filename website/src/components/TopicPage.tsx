import { Show } from "solid-js"
import { SolidMarkdown } from "solid-markdown"
import MiniSidebar from "./MiniSidebar"
import TopBar from "./TopBar"

type Note = {
  url: string
  content: string
}

type Link = {
  url: string
  title: string
}

interface Props {
  content: string
  // setShowSidebar: Setter<boolean>
  notes: Note[]
  links: Link[]
}

export default function TopicPage(props: Props) {
  return (
    <>
      <style>
        {`
       #Topic::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 0;
        height: 0;
      }
      h1 {
        font-size: 32px;
        font-weight: 600;
        height: 40px;
        display: flex;
        align-items: center

      }
      p {
        font-weight: 500;
        margin-top: 16px;
        margin-bottom: 16px;
      }
      h2 {
        font-size: 24px;
        font-weight: 600;
        margin-top: 80px;
        border-top: solid 1px rgba(154,154,154,0.5);
        padding: 20px 0 20px 0
      }
      .Topbar {
        background-color: white;
      }
      .Divider {
        background: linear-gradient( #ffffff,  rgba(30,30,32, 0))
      }
      @media (prefers-color-scheme: dark) {
       .Topbar {
         background-color: #1e1e20;
       }
       .Divider {
        background: linear-gradient( rgb(30,30,32),  rgba(30,30,32, 0))
       }
     }
     #Topbar {
      display:none;

     }
     #TopicContentWrapper {
      height: 100%;
     }
     #MiniSidebar {
      display: none;
     }
     #Topic{
      padding: 70px 30px 70px 30px;
     }
     #PhoneTopbar {
      display: inline;
     }
     #TopicPage {
      padding-left: 0px
     }
     @media (min-width: 800px) {
      #Topbar {
        display: block;
      }
      #PhoneTopbar {
        display: none;
      }
      #MiniSidebar {
        display:block;
      }
      #TopicContentWrapper {
        height: 100%;

      }
      #Topic {
        padding-left: 4rem;
        padding-top: 6rem;
        padding-bottom: 4rem;
        padding-right: 32px;
      }
      #TopicPage {
        padding-left: 250px
      }
     }
      `}
      </style>

      <div
        id="TopicPage"
        class="relative h-full w-full flex flex-col"
        // style={{ "padding-left": "250px" }}
      >
        <div
          style={{
            height: "65px"
          }}
          class="fixed w-full z-20   top-0 right-0 flex "
          id="Topbar"
        >
          <div
            class="Topbar z-10"
            style={{
              height: "65px"
            }}
          >
            <TopBar></TopBar>
          </div>
          <div class="Divider p-6 absolute top-16  left-0 w-full"></div>
        </div>
        <div id="TopicContentWrapper" class="h-full flex ">
          <div style={{ width: "100% " }} class=" flex flex-col  h-full">
            <div id="PhoneTopbar" class="w-full ">
              <div
                style={{ height: "63px" }}
                class="w-full p-3  flex items-center border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(85,85,95,0.48)] font-semibold justify-between text-sm"
              >
                Title
                <div class="flex text-xs gap-4 font-normal">
                  <div>Search</div>
                  <div>Settings</div>
                </div>
              </div>
              <div
                style={{ height: "49px" }}
                onClick={() => {
                  // props.setShowSidebar(true)
                }}
                class="text-xs p-2 sticky w-full top-0 px-3 flex items-center  border-b border-[rgba(60,60,67,0.12)] dark:border-[rgba(85,85,95,0.48)]"
              >
                Menu
              </div>
            </div>

            <div
              id="Topic"
              style={{
                "word-spacing": "0px",
                "line-height": "30px",
                "font-size": "16px"
              }}
              class="h-full w-full py-16 pl-16 opacity-80 pr-80 font-light overflow-scroll"
            >
              <div id="Main">
                <SolidMarkdown children={props.content} />
              </div>
              <div style={{ width: "100%" }} class="bullet h-full">
                <Show when={props.notes}>
                  <h2>Notes</h2>
                  <div id="Notes" class="flex flex-col justify-center gap-2">
                    {/* <For each={props.notes}>
                      {(note) => {
                        if (note.url) {
                          return (
                            <div class="flex items-start gap-1">
                              <div class="w-2 h-2 pt-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="6px"
                                  height="6px"
                                  fill="white"
                                  class="bi bi-circle-fill opacity-40 "
                                  viewBox="0 0 16 16"
                                >
                                  <circle cx="8" cy="8" r="8" />
                                </svg>
                              </div>
                              <a href={note.url} class="w-full">
                                {note.content}
                              </a>
                            </div>
                          )
                        }
                        return <div>{note.content}</div>
                      }}
                    </For> */}
                  </div>
                </Show>
                <Show when={props.links}>
                  <h2>Links</h2>
                  <div id="Links" class="flex flex-col justify-center gap-2">
                    {/* <For each={props.links}>
                      {(link) => {
                        return (
                          <div class="w-full flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6px"
                              height="6px"
                              fill="white"
                              class="bi bi-circle-fill opacity-40"
                              viewBox="0 0 16 16"
                            >
                              <circle cx="8" cy="8" r="8" />
                            </svg>
                            <a href={link.url} class="w-full">
                              {link.title}
                            </a>
                          </div>
                        )
                      }}
                    </For> */}
                  </div>
                </Show>
              </div>
            </div>
          </div>
          <div
            id="MiniSidebar"
            class="pl-8"
            style={{ width: "30%", "padding-top": "6rem" }}
          >
            <MiniSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
