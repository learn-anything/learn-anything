import SolidMarkdown from "solid-markdown"
import MiniSidebar from "./MiniSidebar"
import TopBar from "./TopBar"
import { Setter, Show } from "solid-js"

interface Props {
  content: string
  setShowSidebar: Setter<boolean>
}

export default function TopicContent(props: Props) {
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
        font-size: 36px;
        font-weight: 600;
        margin-bottom: 30px;

      }
      p {
        font-weight: 500;
        margin-top: 16px;
        margin-bottom: 16px;
      }
      h2 {
        font-size: 28px;
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
     #TopicPage {
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
      #TopicPage {
        height: 90%;
      }
      #Topic {
        padding-left: 4rem;
        padding-top: 4rem;
        padding-bottom: 4rem;
        padding-right: 16rem;
      }
     }
      `}
      </style>

      <div class="relative h-full w-full flex flex-col">
        <div
          style={{
            height: "65px",
          }}
          class=" flex"
          id="Topbar"
        >
          <div
            class="Topbar fixed top-0 right-0 z-10"
            style={{
              height: "65px",
            }}
          >
            <TopBar></TopBar>
          </div>
          <div class="Divider p-6 absolute top-16 z-20 left-0 w-full"></div>
        </div>
        <div id="TopicPage" class=" flex items-start justify-end">
          <div style={{ width: "100% " }} class=" flex flex-col  h-full">
            <div id="PhoneTopbar" class="w-full ">
              <div
                style={{ height: "63px" }}
                class="w-full p-3  flex items-center border-b border-[rgba(60,60,67,0.12)] font-semibold justify-between text-sm"
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
                  props.setShowSidebar(true)
                }}
                class="text-xs p-2 sticky w-full top-0 px-3 flex items-center  border-b border-[rgba(60,60,67,0.12)]"
              >
                Menu
              </div>
            </div>

            <div
              id="Topic"
              style={{
                "word-spacing": "0px",
                "line-height": "30px",
                "font-size": "16px",
              }}
              class="h-full w-full py-16 pl-16 opacity-80 pr-80 font-light overflow-scroll"
            >
              <SolidMarkdown children={props.content} />
            </div>
          </div>
          <div
            id="MiniSidebar"
            class="fixed top-16 right-0"
            style={{ width: "15%" }}
          >
            <MiniSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
