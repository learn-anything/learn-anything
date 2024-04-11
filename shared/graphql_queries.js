/*

This file is generated by `bun graphql` command. Do not edit it manually.
To regenerate this file, run `bun graphql`.

*/

/** @typedef {string     } String */
/** @typedef {string & {}} ID */
/** @typedef {number     } Int */
/** @typedef {number     } Float */
/** @typedef {boolean    } Boolean */

/**
 * @template T
 * @typedef {T | null} Maybe
 */

/**
 * @template TVars
 * @callback Query_Get_Body
 * @param   {TVars} vars
 * @returns {string}
 */

/**
 * @enum {(typeof Operation_Kind)[keyof typeof Operation_Kind]} */
export const Operation_Kind = /** @type {const} */({
	Query   : "query",
	Mutation: "mutation",
})

/**
 * @template TVars
 * @template TValue
 * @typedef  {object               } Query_Data
 * @property {string               } name
 * @property {Operation_Kind       } kind
 * @property {Query_Get_Body<TVars>} get_body
 * @property {TValue               } initial_value
 * @property {TVars                } _type_vars
 * @property {TValue               } _type_value
 */

/**
 * @typedef  {Object} Query_Location
 * @property {Int} column
 * @property {Int} line
 */

class Query_Error extends Error {
	/**
	 * @param {string          } message
	 * @param {Query_Location[]} locations
	 */
	constructor(message, locations) {
		super(message)
		this.locations = locations
	}
}
class Fetch_Error extends Error {
	/**
	 * @param {string} message
	 */
	constructor(message) {super(message)}
}

/**
 * @typedef  {object} Raw_Request_Result
 * @property {any   } data
 * @property {(Query_Error | Fetch_Error)[]} errors
 */

/** @typedef {RequestInit} Request_Init */

/**
 * @param   {Request_Init       } request_init `RequestInit` object to modify
 * @param   {string             } query        GraphQL query string
 * @returns {void} */
export function request_init_init(request_init, query) {
	request_init.method  ??= "POST"
	request_init.headers ??= {"Content-Type": "application/json"}
	request_init.body      = '{"query":'+JSON.stringify(query)+'}'
}


/**
 * @param   {string} query
 * @returns {string} */
export function query_to_requestinit_body(query) {
	return '{"query":'+JSON.stringify(query)+'}'
}

/**
 * @param   {string | URL | Request} url
 * @param   {Request_Init          } request_init
 * @returns {Promise<Raw_Request_Result>} */
export async function raw_request(url, request_init) {
	try {
		const res  = await fetch(url, request_init)
		const json = await res.json()

		if (Array.isArray(json.errors)) {
			for (let i = 0; i < json.errors.length; i++) {
				const err = json.errors[i]
				json.errors[i] = new Query_Error(err.message, err.locations)
			}
		}
		return json
	} catch (err) {
		if (err instanceof Error) {
			err = new Fetch_Error(err.message)
		} else if (typeof err === "string") {
			err = new Fetch_Error(err)
		} else {
			err = new Fetch_Error("Unknown error")
		}
		return {data: null, errors: [/** @type {*} */(err)]}
	}
}

/*

TYPES:

*/

/**
 * Initial value: {@link initial_Inline0}
 *
 * @typedef  {object} Inline0
 * @property {String} name
 * @property {String} prettyName
 * @property {Array<String>} connections
 */
/** @type {Inline0} */
export const initial_Inline0 = {
	name: "",
	prettyName: "",
	connections: [],
}

/**
 * Initial value: {@link initial_Inline1}
 *
 * @typedef  {object} Inline1
 * @property {Array<Inline0>} latestGlobalTopicGraph
 */
/** @type {Inline1} */
export const initial_Inline1 = {
	latestGlobalTopicGraph: [],
}

/**
 * Initial value: {@link initial_Link}
 *
 * @typedef  {object} Link
 * @property {Maybe<String>} title
 * @property {Maybe<String>} url
 */
/** @type {Link} */
export const initial_Link = {
	title: null,
	url: null,
}

/**
 * Initial value: {@link initial_Inline2}
 *
 * @typedef  {object} Inline2
 * @property {Maybe<String>} username
 * @property {Maybe<String>} bio
 * @property {Array<Link>} links
 */
/** @type {Inline2} */
export const initial_Inline2 = {
	username: null,
	bio: null,
	links: [],
}

/**
 * Initial value: {@link initial_Inline3}
 *
 * @typedef  {object} Inline3
 * @property {Maybe<Inline1>} public
 * @property {Maybe<Inline2>} auth
 */
/** @type {Inline3} */
export const initial_Inline3 = {
	public: null,
	auth: null,
}

/**
 * Initial value: {@link initial_Inline4}
 *
 * @typedef  {object} Inline4
 * @property {String} email
 * @property {String} name
 */
/** @type {Inline4} */
export const initial_Inline4 = {
	email: "",
	name: "",
}

/**
 * Initial value: {@link initial_Inline5}
 *
 * @typedef  {object} Inline5
 * @property {Maybe<String>} id
 * @property {Maybe<String>} url
 * @property {Maybe<String>} title
 * @property {Maybe<String>} topic
 */
/** @type {Inline5} */
export const initial_Inline5 = {
	id: null,
	url: null,
	title: null,
	topic: null,
}

/**
 * Initial value: {@link initial_User}
 *
 * @typedef  {object} User
 * @property {String} email
 * @property {String} name
 */
/** @type {User} */
export const initial_User = {
	email: "",
	name: "",
}

/**
 * Initial value: {@link initial_Inline6}
 *
 * @typedef  {object} Inline6
 * @property {String} showLinksStatus
 * @property {Maybe<Inline4>} user
 * @property {Array<Inline5>} links
 * @property {String} filterOrder
 * @property {String} filter
 * @property {Array<String>} userTopics
 * @property {User} userTest
 */
/** @type {Inline6} */
export const initial_Inline6 = {
	showLinksStatus: "",
	user: null,
	links: [],
	filterOrder: "",
	filter: "",
	userTopics: [],
	userTest: initial_User,
}

/**
 * @enum {(typeof LearningStatus)[keyof typeof LearningStatus]} */
export const LearningStatus = /** @type {const} */({
	Learn: "Learn",
	Learning: "Learning",
	Learned: "Learned",
})

/*

QUERIES:

*/


/**
 * @typedef  {object} Vars_webIndex
 *
 * @typedef  {Inline3} Value_webIndex
 */

/**
 * @param   {Vars_webIndex} vars
 * @returns {string} */
export function query_get_body_webIndex(vars) {
	return 'webIndex{public{latestGlobalTopicGraph{name prettyName connections}}auth{username bio links{title url}}}'
}

/**
 * query: `webIndex`\
 * vars : {@link Vars_webIndex }\
 * value: {@link Value_webIndex}
 * @type  {Query_Data<Vars_webIndex, Value_webIndex>}
 */
export const query_webIndex = /** @type {*} */({
	name         : "webIndex",
	kind         : "query",
	get_body     : query_get_body_webIndex,
	initial_value: initial_Inline3,
})


/**
 * @typedef  {object} Vars_mobileIndex
 *
 * @typedef  {Inline6} Value_mobileIndex
 */

/**
 * @param   {Vars_mobileIndex} vars
 * @returns {string} */
export function query_get_body_mobileIndex(vars) {
	return 'mobileIndex{showLinksStatus user{email name}links{id url title topic}filterOrder filter userTopics userTest{email name}}'
}

/**
 * query: `mobileIndex`\
 * vars : {@link Vars_mobileIndex }\
 * value: {@link Value_mobileIndex}
 * @type  {Query_Data<Vars_mobileIndex, Value_mobileIndex>}
 */
export const query_mobileIndex = /** @type {*} */({
	name         : "mobileIndex",
	kind         : "query",
	get_body     : query_get_body_mobileIndex,
	initial_value: initial_Inline6,
})

/*

MUTATIONS:

*/


/**
 * @typedef  {object} Vars_createUser
 * @property {String} email
 *
 * @typedef  {Boolean} Value_createUser
 */

/**
 * @param   {Vars_createUser} vars
 * @returns {string} */
export function query_get_body_createUser(vars) {
	return 'createUser(email:'+JSON.stringify(vars.email)+')'
}

/**
 * mutation: `createUser`\
 * vars : {@link Vars_createUser }\
 * value: {@link Value_createUser}
 * @type  {Query_Data<Vars_createUser, Value_createUser>}
 */
export const mutation_createUser = /** @type {*} */({
	name         : "createUser",
	kind         : "mutation",
	get_body     : query_get_body_createUser,
	initial_value: false,
})


/**
 * @typedef  {object} Vars_updateUserBio
 * @property {String} bio
 *
 * @typedef  {Boolean} Value_updateUserBio
 */

/**
 * @param   {Vars_updateUserBio} vars
 * @returns {string} */
export function query_get_body_updateUserBio(vars) {
	return 'updateUserBio(bio:'+JSON.stringify(vars.bio)+')'
}

/**
 * mutation: `updateUserBio`\
 * vars : {@link Vars_updateUserBio }\
 * value: {@link Value_updateUserBio}
 * @type  {Query_Data<Vars_updateUserBio, Value_updateUserBio>}
 */
export const mutation_updateUserBio = /** @type {*} */({
	name         : "updateUserBio",
	kind         : "mutation",
	get_body     : query_get_body_updateUserBio,
	initial_value: false,
})


/**
 * @typedef  {object} Vars_updatePersonalLink
 * @property {String} linkId
 * @property {LearningStatus} status
 *
 * @typedef  {Boolean} Value_updatePersonalLink
 */

/**
 * @param   {Vars_updatePersonalLink} vars
 * @returns {string} */
export function query_get_body_updatePersonalLink(vars) {
	return 'updatePersonalLink(linkId:'+JSON.stringify(vars.linkId)+' status:'+JSON.stringify(vars.status)+')'
}

/**
 * mutation: `updatePersonalLink`\
 * vars : {@link Vars_updatePersonalLink }\
 * value: {@link Value_updatePersonalLink}
 * @type  {Query_Data<Vars_updatePersonalLink, Value_updatePersonalLink>}
 */
export const mutation_updatePersonalLink = /** @type {*} */({
	name         : "updatePersonalLink",
	kind         : "mutation",
	get_body     : query_get_body_updatePersonalLink,
	initial_value: false,
})
