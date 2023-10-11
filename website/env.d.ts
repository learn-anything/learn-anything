declare module "solid-js" {
  namespace JSX {
    /*
        Makes all html events available in JSX
        as on:eventname and oncapture:eventname attributes.
    */
    interface CustomEvents extends HTMLElementEventMap {}
    interface CustomCaptureEvents extends HTMLElementEventMap {}
    interface Directives {
      "use:droppable"?: any
      "use:draggable"?: any
    }
  }
}

export {}
