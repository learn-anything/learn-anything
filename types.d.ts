import "solid-js"

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "hanko-auth": any
      "hanko-profile": any
    }
  }
}
