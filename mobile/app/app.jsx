import { createSignal } from "solid-js"
import { Component } from "./component.jsx"

const App = () => {
  return (
    <>
      <Label textWrap="true">
        <FormattedString>
          <Span text="This text has a " />
          <Span text="red " style="color: red" />
          <Span text="piece of text. " />
          <Span text="Also, this bit is italic, " fontStyle="italic" />
          <Span text="and this bit is bold." fontWeight="bold" />
        </FormattedString>
      </Label>
    </>
  )
}

export { App }
