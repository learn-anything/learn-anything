import { createContext, createEffect, createMemo, useContext } from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"
import { useLocation } from "solid-start"
import { SearchResult } from "../components/Search"

type GlobalLink = {
  id: string
  title: string
  url: string
  year?: string | null
}
export type Section = {
  summary: string
  title: string
  links: GlobalLink[]
}
type LatestGlobalGuide = {
  summary: string
  sections: Section[]
}
export type GlobalTopic = {
  prettyName: string
  topicSummary?: string
  topicPath?: string
  latestGlobalGuide?: LatestGlobalGuide
  links?: GlobalLink[]
}

function extractTopicFromPath(inputStr: string) {
  const segments = inputStr
    .split("/")
    .filter((segment: string) => segment.trim() !== "")
  return segments.length > 0 ? segments[0] : null
}

// state for rendering global topic found in learn-anything.xyz/<topic>
export default function createGlobalTopic(mobius: MobiusType) {
  const [globalTopic, setGlobalTopic] = createStore<GlobalTopic>({
    prettyName: "",
    topicPath: "",
    topicSummary: "",
    latestGlobalGuide: {
      summary: "",
      sections: [
        {
          title: "Intro",
          summary: "Great",
          links: [
            {
              id: "1",
              title: "Zine Machine",
              url: "zine-machine.glitch.me",
            },
            {
              id: "2",
              title: "CuraEngine",
              url: "curaengine.com",
            },
            {
              id: "3",
              title: "Learn Anything",
              url: "learn-anything.xyz",
            },
          ],
        },
        {
          title: "Intro",
          summary: "Great",
          links: [],
        },
        {
          title: "Intro",
          summary: "Great",
          links: [],
        },
      ],
    },
    links: [
      {
        id: "3384cb7c-45e3-11ee-8b19-7bcc350484ff",
        title: "Zine Machine",
        url: "hibred.pmvabf.org/zine-machine",
        year: null,
      },
      {
        id: "3384d900-45e3-11ee-8b19-7f4086612a69",
        title: "Debunking LIES about 3D printed concrete houses",
        url: "youtube.com/watch?v=sz1LM9kwRLY",
        year: "2021",
      },
      {
        id: "3384def0-45e3-11ee-8b19-9ba0f092f263",
        title: "CuraEngine",
        url: "github.com/Ultimaker/CuraEngine",
        year: null,
      },
      {
        id: "3384e95e-45e3-11ee-8b19-ab3ad84f5e42",
        title: "Great 3D printers",
        url: "twitter.com/fatih/status/1521048072322748417",
        year: "2022",
      },
      {
        id: "3384f836-45e3-11ee-8b19-0f9d85d869a5",
        title: "Prototyping - Metal 3D Printing",
        url: "youtube.com/watch?v=nyYcomX7Lus",
        year: "2019",
      },
      {
        id: "3384b61e-45e3-11ee-8b19-73e7133a7162",
        title: "Pepr3D",
        url: "github.com/tomasiser/pepr3d",
        year: null,
      },
      {
        id: "3384b952-45e3-11ee-8b19-0b750cb00331",
        title: "Voron 2 CoreXY 3D Printer design",
        url: "github.com/VoronDesign/Voron-2",
        year: null,
      },
      {
        id: "3384bd94-45e3-11ee-8b19-6341440029d4",
        title: "Ask HN: Why are there no open source 2d printers?",
        url: "news.ycombinator.com/item?id=24786721",
        year: "2020",
      },
      {
        id: "3384bf2e-45e3-11ee-8b19-5b163f55728a",
        title: "Marlin 3D Printer Firmware",
        url: "github.com/MarlinFirmware/Marlin",
        year: null,
      },
      {
        id: "3384c3d4-45e3-11ee-8b19-57785edb3f61",
        title: "SuperSlicer",
        url: "github.com/supermerill/SuperSlicer",
        year: null,
      },
      {
        id: "3384c9f6-45e3-11ee-8b19-734bb29db4e1",
        title: "printinator",
        url: "github.com/jessfraz/printinator",
        year: null,
      },
      {
        id: "3384ccf8-45e3-11ee-8b19-9735f7131d38",
        title: "OpenScan",
        url: "github.com/OpenScanEu/OpenScan",
        year: null,
      },
      {
        id: "3384d158-45e3-11ee-8b19-2f897f1a1cfb",
        title: "How I set up my 3D Printer",
        url: "github.com/geerlingguy/3d-printing",
        year: null,
      },
      {
        id: "3384d2de-45e3-11ee-8b19-b3bdc634e4db",
        title: "Rapid Prototyping with a $100 Inkjet Printer",
        url: "ygoliya.medium.com/rapid-prototyping-with-a-100-inkjet-printer-e9bf9ef1e0d3",
        year: "2021",
      },
      {
        id: "3384d45a-45e3-11ee-8b19-137138cae0ce",
        title: "Buddy",
        url: "github.com/prusa3d/Prusa-Firmware-Buddy",
        year: null,
      },
      {
        id: "3384dbf8-45e3-11ee-8b19-ff457b703d84",
        title: "Printrun",
        url: "github.com/kliment/Printrun",
        year: null,
      },
      {
        id: "33850010-45e3-11ee-8b19-5f9092160100",
        title: "FDM 3d-printer simulator",
        url: "github.com/yjh0502/tdp-tl",
        year: null,
      },
      {
        id: "338505f6-45e3-11ee-8b19-e745dd69876f",
        title: "Octolamp",
        url: "github.com/martinwoodward/octolamp",
        year: null,
      },
      {
        id: "3384e06c-45e3-11ee-8b19-a3adf860dbde",
        title: "PUMA",
        url: "github.com/TadPath/PUMA",
        year: null,
      },
      {
        id: "3384e350-45e3-11ee-8b19-b3d070d6e67f",
        title: "Wasp 3D-prints eco-homes from local raw earth for $1K",
        url: "youtube.com/watch?v=4MLJs1KRa0Y",
        year: "2021",
      },
      {
        id: "3384e4cc-45e3-11ee-8b19-63d5bad9915f",
        title: "MicroscoPy",
        url: "github.com/IBM/MicroscoPy",
        year: null,
      },
      {
        id: "3384e65c-45e3-11ee-8b19-73405250f90e",
        title: "Open5x: Accessible 5-axis 3D printing and conformal slicing",
        url: "arxiv.org/abs/2202.11426",
        year: "2022",
      },
      {
        id: "3384e7e2-45e3-11ee-8b19-1f670b2da79f",
        title: "Making 3D printing truly 3D",
        url: "phys.org/news/2022-04-3d.html",
        year: "2022",
      },
      {
        id: "3384eada-45e3-11ee-8b19-232fd318a26a",
        title: "Hob3l",
        url: "github.com/moehriegitt/hob3l",
        year: null,
      },
      {
        id: "3384ec4c-45e3-11ee-8b19-f350eb42912b",
        title: "PositronV3",
        url: "github.com/KRALYN/PositronV3",
        year: null,
      },
      {
        id: "3384f188-45e3-11ee-8b19-c72192799eeb",
        title:
          "Voron Community mods, slicer profiles and firmware configurations",
        url: "github.com/VoronDesign/VoronUsers",
        year: null,
      },
      {
        id: "3384f3a4-45e3-11ee-8b19-3b1235bf0d10",
        title: "Snapmaker Luban",
        url: "snapmaker.com/snapmaker-luban",
        year: null,
      },
      {
        id: "3384f53e-45e3-11ee-8b19-bbf2697dcc3a",
        title: "Voron Zero 3D Printer",
        url: "github.com/VoronDesign/Voron-0",
        year: null,
      },
      {
        id: "3384f9b2-45e3-11ee-8b19-d38ab7b5cf0d",
        title: "Algorithm for 3D printer with new kinematics",
        url: "github.com/RotBotSlicer/Transform",
        year: null,
      },
      {
        id: "3384fb24-45e3-11ee-8b19-83a44f54827c",
        title: "Arc Overhang",
        url: "github.com/stmcculloch/arc-overhang",
        year: null,
      },
      {
        id: "3384fe8a-45e3-11ee-8b19-576b82706f95",
        title: "OctoPod",
        url: "github.com/gdombiak/OctoPod",
        year: null,
      },
      {
        id: "33850b8c-45e3-11ee-8b19-33ff5c35fd75",
        title: "LivePrinter",
        url: "github.com/pixelpusher/liveprinter",
        year: null,
      },
      {
        id: "4fdde7f4-6523-11ee-9773-5be84c9ae275",
        title: "ShapeWays",
        url: "shapeways.com",
        year: null,
      },
      {
        id: "3384ae12-45e3-11ee-8b19-2755ac7beaf9",
        title: "libfive",
        url: "github.com/libfive/libfive",
        year: null,
      },
      {
        id: "f3e1ea8e-6524-11ee-80d6-23706b53f80d",
        title: "Formlabs",
        url: "formlabs.com",
        year: null,
      },
      {
        id: "f3e38f06-6524-11ee-a86e-cfe7a92c1cbc",
        title: "Fiber",
        url: "desktopmetal.com",
        year: null,
      },
      {
        id: "3384b308-45e3-11ee-8b19-bf1aad3b09ec",
        title: "Origin",
        url: "origin.io",
        year: null,
      },
      {
        id: "f3e5584a-6524-11ee-a86e-e7cffcc9cb4b",
        title: "Klipper",
        url: "github.com/Klipper3d/klipper",
        year: null,
      },
      {
        id: "f40379c4-6524-11ee-a86e-0773c492b5d7",
        title: "A Tale of Two 3D Printers",
        url: "blog.jessfraz.com/post/a-tale-of-two-3d-printers",
        year: "2020",
      },
      {
        id: "f40504f6-6524-11ee-a86e-1b06259895cc",
        title: "VORON Design",
        url: "vorondesign.com",
        year: null,
      },
      {
        id: "3384c208-45e3-11ee-8b19-3bfbc0bc2f67",
        title: "PrusaSlicer",
        url: "github.com/prusa3d/PrusaSlicer",
        year: null,
      },
      {
        id: "f40a3340-6524-11ee-a86e-233e75d723ad",
        title: "3D printing boats is becoming standard practice",
        url: "3dprintingmedia.network/3d-printing-boats-is-becoming-standard-practice",
        year: "2020",
      },
      {
        id: "f40ad6c4-6524-11ee-a86e-3f0a36a3e9e7",
        title: "OctoPrint",
        url: "octoprint.org",
        year: null,
      },
      {
        id: "3384c87a-45e3-11ee-8b19-cf4d4e743951",
        title:
          "Multi-metal 4D printing with a desktop electrochemical 3D printer",
        url: "nature.com/articles/s41598-019-40774-5",
        year: "2019",
      },
      {
        id: "3384ce6a-45e3-11ee-8b19-9b14db6c8eea",
        title: "A house 3D printed from raw earth",
        url: "itsnicethat.com/news/tecla-house-mario-cucinella-wasp-architecture-270421",
        year: null,
      },
      {
        id: "f40e8314-6524-11ee-a86e-93ca4942dcf8",
        title: "MyMiniFactory",
        url: "myminifactory.com",
        year: null,
      },
      {
        id: "f4112218-6524-11ee-a86e-938b49448dcd",
        title: "Prusa3D",
        url: "prusa3d.com",
        year: null,
      },
      {
        id: "ea001dd6-45e6-11ee-aedd-cb5303f8e38e",
        title: "Anatomy of a CNC Router",
        url: "mattferraro.dev/posts/cnc-router",
        year: "2020",
      },
      {
        id: "f412f840-6524-11ee-a86e-6f6a061a6bbb",
        title: "Things I would like to 3D print",
        url: "jmtd.net/log/3d_print_list",
        year: null,
      },
      {
        id: "3384dd6a-45e3-11ee-8b19-8766a0943c37",
        title: "Cura",
        url: "github.com/Ultimaker/Cura",
        year: null,
      },
      {
        id: "f4162056-6524-11ee-a86e-83e703ef1b93",
        title: "Slic3r",
        url: "slic3r.org",
        year: null,
      },
      {
        id: "f41b0a6c-6524-11ee-a86e-338b89008a6e",
        title: "3D Printed Bluetooth Headphones",
        url: "homebrewheadphones.com/3d-printed-bluetooth-headphones",
        year: null,
      },
      {
        id: "3384ef3a-45e3-11ee-8b19-df1879f5e6e2",
        title: "Optimized firmware for Ender3 V2/S1 3D printers",
        url: "github.com/mriscoc/Ender3V2S1",
        year: null,
      },
      {
        id: "f41e145a-6524-11ee-a86e-7fb70668c7c8",
        title: "On CAD",
        url: "1299651405.com/cad",
        year: "2022",
      },
      {
        id: "3384fcaa-45e3-11ee-8b19-e73118a8d150",
        title: "3D Printed Film Video Camera",
        url: "joshuabird.com/blog/post/3d-printed-film-video-camera",
        year: "2022",
      },
      {
        id: "f42264e2-6524-11ee-a86e-3fb67b82475b",
        title: "3D Printing Reddit",
        url: "reddit.com/r/3Dprinting",
        year: null,
      },
      {
        id: "f422f5a6-6524-11ee-a86e-4b25edc1d2d0",
        title: "3D Printing Reddit Wiki",
        url: "reddit.com/r/3Dprinting/wiki/index",
        year: null,
      },
      {
        id: "f4239fd8-6524-11ee-a86e-8b0b671a47fc",
        title: "Functional 3D Printing Reddit",
        url: "reddit.com/r/functionalprint",
        year: null,
      },
      {
        id: "f42572b8-6524-11ee-a86e-6bbb012c6a96",
        title: "The state of open-source in 3D printing in 2023",
        url: "blog.prusa3d.com/the-state-of-open-source-in-3d-printing-in-2023_76659",
        year: null,
      },
      {
        id: "f4260f8e-6524-11ee-a86e-c3d6ec7b4881",
        title: "3D printing a full-size kayak",
        url: "nathanrooy.github.io/posts/2023-03-12/3d-printed-kayak",
        year: "2023",
      },
      {
        id: "f426a9a8-6524-11ee-a86e-e3726a0e5f53",
        title: "3D Printing Purchase Advice",
        url: "reddit.com/r/3Dprinting/comments/100ca9n/purchase_advice_megathread_january_2023",
        year: "2023",
      },
    ],
  })

  const currentTopicGlobalLinksSearch = createMemo(() => {
    if (!globalTopic.links) return []

    return globalTopic.links.map(
      (link): SearchResult => ({
        name: link.title,
      }),
    )
  })

  // TODO: do grafbase queries to get user learning status
  // check that user is authed, can use import { signedIn } from "../../../lib/auth" for this
  const location = useLocation()
  createEffect(async () => {
    return
    if (location.pathname && !(location.pathname === "/")) {
      const topicName = extractTopicFromPath(location.pathname)
      if (topicName) {
        const topic = await mobius.query({
          publicGetGlobalTopic: {
            where: { topicName: topicName },
            select: {
              prettyName: true,
              topicSummary: true,
              topicPath: true,
              links: {
                id: true,
                title: true,
                url: true,
                year: true,
              },
              latestGlobalGuide: {
                sections: {
                  title: true,
                  links: {
                    id: true,
                    title: true,
                    url: true,
                    year: true,
                  },
                },
              },
            },
          },
        })
        // @ts-ignore
        const topicData = topic.data.publicGetGlobalTopic
        setGlobalTopic({
          prettyName: topicData.prettyName,
          topicSummary: topicData.topicSummary,
          topicPath: topicData.topicPath,
          latestGlobalGuide: topicData.latestGlobalGuide,
          links: topicData.links,
        })
        // console.log(unwrap(globalTopic), "global topic")
      }
    }
  })

  return {
    globalTopic,
    set: (state: GlobalTopic) => {
      setGlobalTopic(state)
    },

    currentTopicGlobalLinksSearch,
    // topicGlobalLinksSearch,
    // setShowPage: (state: PageState) => {
    //   setGlobalTopic({ showPage: state })
    // },
    // TODO: use solid effect that listens on 'learning status' instead of below
    // setUserLearningStatus: async (state: LearningStatus) => {
    //   setGlobalTopic({ userLearningStatus: state })
    //   // await mobius.mutate()
    // },
  }
}

const GlobalTopicCtx = createContext<ReturnType<typeof createGlobalTopic>>()

export const GlobalTopicProvider = GlobalTopicCtx.Provider

export const useGlobalTopic = () => {
  const ctx = useContext(GlobalTopicCtx)
  if (!ctx) throw new Error("useGlobalTopic must be used within UserProvider")
  return ctx
}
