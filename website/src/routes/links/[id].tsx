import { createSignal, onMount } from "solid-js"
import { useParams } from "solid-start"
import { useMobius } from "../../root"

export default function GlobalLinkEdit() {
  const params = useParams()
  const mobius = useMobius()
  const [linkData, setLinkData] = createSignal()

  onMount(async () => {
    const link = await mobius.query({
      getGlobalLink: {
        where: {
          linkId: params.id!,
        },
        select: {
          title: true,
          url: true,
          fullUrl: true,
          mainTopicAsString: true,
          protocol: true,
          verified: true,
          public: true,
          description: true,
          urlTitle: true,
          year: true,
        },
      },
    })
    console.log(link, "link")
    // TODO: super annoying having to do this, figure out how to get stuff type safe
    // from queries..
    // @ts-ignore
    setLinkData(link.data.getGlobalLink)
    console.log(linkData(), "link data")
  })

  return <div>link data inputs</div>
}
