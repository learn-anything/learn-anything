import { Label, StackLayout } from "@nativescript/core"

const App = () => {
  return (
    <>
      <StackLayout backgroundColor="#3c495e">
        <Label text="first" height="70" backgroundColor="#43B3F4" />
        <Label text="second" height="70" backgroundColor="#1089CA" />
        <Label text="third" height="70" backgroundColor="#075B88" />
      </StackLayout>
    </>
  )
}

export { App }
