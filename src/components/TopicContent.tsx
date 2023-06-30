import SolidMarkdown from "solid-markdown"
import MiniSidebar from "./MiniSidebar"
import TopBar from "./TopBar"
import { Setter } from "solid-js"

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
      padding: 100px 30px 100px 30px;
     }
     @media (min-width: 800px) {
      #Topbar {
        display: block;
      }
      #MiniSidebar {
        display:block;
      }
      #TopicPage {
        height: 90%;
      }
      #Topic {
        padding-left: 12rem;
        padding-top: 4rem;
        padding-bottom: 4rem;
        padding-right: 20rem;
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
          <div
            style={{ width: "100% " }}
            class=" flex flex-col  h-full overflow-auto"
          >
            <div
              id="PhoneTopbar"
              class="w-full flex items-center justify-center p-4"
            >
              <div></div>
              <div
                onClick={() => {
                  props.setShowSidebar(true)
                }}
              >
                Icon
              </div>
            </div>
            <div
              id="Topic"
              style={{
                "word-spacing": "0px",
                "line-height": "30px",
                "font-size": "16px",
              }}
              class="h-full w-full py-16 pl-48 opacity-80 pr-80 font-light overflow-scroll"
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
