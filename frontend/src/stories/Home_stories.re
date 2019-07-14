open BsStorybook.Story;
let _module = [%bs.raw "module"];

storiesOf("Home", _module)->(add("default", () => <Home />));