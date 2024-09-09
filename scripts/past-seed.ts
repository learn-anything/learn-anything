// @ts-nocheck
async function devSeed() {
	const { worker } = await startWorker({
		accountID: "co_zhvp7ryXJzDvQagX61F6RCZFJB9",
		accountSecret: JAZZ_WORKER_SECRET
	})
	const user = (await (
		await LaAccount.createAs(worker, {
			creationProps: { name: "nikiv" }
		})
	).ensureLoaded({ root: { personalLinks: [], pages: [], todos: [] } }))!
	const globalLinksGroup = Group.create({ owner: worker })
	globalLinksGroup.addMember("everyone", "reader")
	const globalLink1 = GlobalLink.create({ url: "https://google.com" }, { owner: globalLinksGroup })
	const globalLink2 = GlobalLink.create({ url: "https://jazz.tools" }, { owner: globalLinksGroup })
	// TODO: make note: optional
	const personalLink1 = PersonalLink.create(
		{ globalLink: globalLink1, type: "personalLink", note: "" },
		{ owner: user }
	)
	const personalLink2 = PersonalLink.create(
		{ globalLink: globalLink2, type: "personalLink", note: "Great framework" },
		{ owner: user }
	)
	user.root.personalLinks.push(personalLink1)
	user.root.personalLinks.push(personalLink2)
	const pageOneTitle = "Physics"
	const pageTwoTitle = "Karabiner"
	const page1 = PersonalPage.create(
		{ title: pageOneTitle, slug: generateUniqueSlug(pageOneTitle), content: "Physics is great" },
		{ owner: user }
	)
	const page2 = PersonalPage.create(
		{ title: pageTwoTitle, slug: generateUniqueSlug(pageTwoTitle), content: "Karabiner is great" },
		{ owner: user }
	)
	user.root.personalPages?.push(page1)
	user.root.personalPages?.push(page2)
	const page1 = Page.create({ title: "Physics", content: "Physics is great" }, { owner: user })
	const page2 = Page.create({ title: "Karabiner", content: "Karabiner is great" }, { owner: user })
	user.root.pages.push(page1)
	user.root.pages.push(page2)
	const credentials = {
		accountID: user.id,
		accountSecret: (user._raw as RawControlledAccount).agentSecret
	}
	await Bun.write(
		"./web/.env",
		`VITE_SEED_ACCOUNTS='${JSON.stringify({
			nikiv: credentials
		})}'`
	)
	await Bun.write(
		"./.env",
		`VITE_SEED_ACCOUNTS='${JSON.stringify({
			nikiv: credentials
		})}'`
	)
}
const globalLink = GlobalLink.create(
	{
		url: "https://google.com",
		urlTitle: "Google",
		protocol: "https"
	},
	{ owner: globalGroup }
)
const user = (await (
	await LaAccount.createAs(worker, {
		creationProps: { name: "nikiv" }
	})
).ensureLoaded({ root: { personalLinks: [], pages: [], todos: [] } }))!
console.log(process.env.JAZZ_GLOBAL_GROUP!, "group")
console.log(worker)
// TODO: type err
console.log(globalGroup, "group")
return
const currentFilePath = import.meta.path
const connectionsFilePath = `${currentFilePath.replace("seed.ts", "/seed/connections.json")}`
const file = Bun.file(connectionsFilePath)
const fileContent = await file.text()
const topicsWithConnections = JSON.parse(fileContent)
// let topicsWithConnections = JSON.stringify(obj, null, 2)
console.log(topicsWithConnections)
// TODO: type err
topicsWithConnections.map(topic => {
	const globalTopic = GlobalTopic.create({ name: topic.name, description: topic.description }, { owner: globalGroup })
})
