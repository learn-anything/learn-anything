import { GraphQLResolveInfo } from 'graphql'

export type GrafbaseContext = {
  request: {
    headers: Record<string, any>
  }
}

export type GrafbaseInfo = Pick<
  GraphQLResolveInfo,
  'fieldName' | 'path' | 'variableValues'
>
