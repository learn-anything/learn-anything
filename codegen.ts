import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: [
    {
      'http://127.0.0.1:4000/graphql': {
        headers: {
          'x-api-key': 'letmein'
        }
      }
    }
  ],
  generates: {
    'grafbase/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: './context#GrafbaseContext',
        customResolveInfo: './context#GrafbaseInfo',
        useIndexSignature: true
      }
    }
  }
}

export default config
