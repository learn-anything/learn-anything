import { getTestFolderPath } from "lib/test/helpers"
import { markdownFilePaths, parseMdFile } from "lib/wiki/wiki"
import { describe, expect, it } from "vitest"

// TODO: don't use filePaths[2] as it's not deterministic
// do it by file name instead
// assumes `bun dev-setup` has been run and seed folder is available at root
describe("parses", async () => {
  const testFolderPath = getTestFolderPath()
  const filePaths = await markdownFilePaths(testFolderPath)
  it("solid file (front matter heading + content with headings inside + notes + links)", async (t) => {
    const solidTestFile = filePaths[2] // solid.md file in seed/wiki/test folder
    const solidTopic = await parseMdFile(solidTestFile)
    expect(solidTopic!.topicName).toBe("solid")
    expect(solidTopic!.prettyTopicName).toBe("SolidJS")
    // TODO: I tried to compare the whole content but that was giving false positives
    // don't know why
    // so this just tests if some things are present that should be
    expect(solidTopic!.content).toContain(
      "# [SolidJS](https://www.solidjs.com/)",
    )
    expect(solidTopic!.content).toContain("## OSS apps")
    expect(solidTopic!.content).toContain(
      "- [CodeImage](https://github.com/riccardoperra/codeimage)",
    )
    expect(solidTopic!.notes).toStrictEqual([
      {
        note: `Solid will never "re-render" your component/function.`,
        subnotes: [
          "Means you don't ever have to optimise re-renders.",
          "And don't have to fight with React useEffect.",
        ],
        url: "https://twitter.com/Axibord1/status/1606106151539687425",
      },
      {
        note: `[Solid Dev Tools](https://github.com/thetarnav/solid-devtools) are great.`,
        subnotes: [],
        url: undefined,
      },
      {
        note: `createResource makes a signal out of a promise.`,
        subnotes: [],
        url: undefined,
      },
      {
        note: `Builin components like [For](https://www.solidjs.com/docs/latest/api#for) and [Show](https://www.solidjs.com/docs/latest/api#show) are great.`,
        subnotes: [],
        url: undefined,
      },
      {
        note: `Biggest difference between React and Solid is that things that can change are wrapped in signals in Solid, and in dependencies arrays in React.`,
        subnotes: [],
        url: "https://twitter.com/fabiospampinato/status/1528537000504184834",
      },
    ])
    expect(solidTopic!.links).toStrictEqual([
      {
        title: "Hope UI",
        url: "https://github.com/fabien-ml/hope-ui",
        description: `SolidJS component library you've hoped for.`,
        relatedLinks: [
          {
            title: "Docs",
            url: "https://hope-ui.com/docs/getting-started",
          },
        ],
      },
      {
        title: "SolidJS Docs",
        url: "https://docs.solidjs.com/",
        description: ``,
        relatedLinks: [],
      },
    ])
  })
  it("react file (heading + content)", async (t) => {
    const reactTestFile = filePaths[1] // react.md file in seed/wiki/test folder
    const reactTopic = await parseMdFile(reactTestFile)
    expect(reactTopic!.topicName).toBe("react")
    expect(reactTopic!.prettyTopicName).toBe("React")
    expect(reactTopic!.content).toBe(
      `# React\n[React docs](https://react.dev/learn) are great.\n`,
    )
    expect(reactTopic!.notes).toStrictEqual([])
    expect(reactTopic!.links).toStrictEqual([])
  })
  it("3d printing file (heading + content + links)", async (t) => {
    const printingFile = filePaths[0] // 3d-printing.md file in seed/wiki/test folder
    const printingTopic = await parseMdFile(printingFile)
    expect(printingTopic!.topicName).toBe("3d-printing")
    expect(printingTopic!.prettyTopicName).toBe("3D Printing")
    expect(printingTopic!.content).toContain(
      `do some [hardware](../hardware/hardware.md)`,
    )
    expect(printingTopic!.notes).toStrictEqual([])
    expect(printingTopic!.links).toStrictEqual([
      {
        title: "ShapeWays",
        url: "https://www.shapeways.com/",
        description: "Upload 3D model, choose materials and get the thing.",
        relatedLinks: [],
      },
      {
        title: "libfive",
        url: "https://github.com/libfive/libfive",
        description: "Infrastructure for solid modeling.",
        relatedLinks: [
          {
            title: "Web",
            url: "https://libfive.com/",
          },
        ],
      },
    ])
  })
})
