import { Resolver } from "@grafbase/generated"
import { GraphQLError } from "graphql"
import { getPersonalTopic } from "../../edgedb/crud/personal-wiki"

const publicGetPersonalTopicResolver: Resolver["Query.publicGetPersonalTopic"] =
  async (parent, args, context, info) => {
    try {
      const personalTopic = await getPersonalTopic(args.user, args.topicName)
      return personalTopic
    } catch (err) {
      console.error(err)
      throw new GraphQLError(JSON.stringify(err))
    }
  }

export default publicGetPersonalTopicResolver
