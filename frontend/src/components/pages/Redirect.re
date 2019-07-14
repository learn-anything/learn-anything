let component = ReasonReact.statelessComponent("Redirect");
let make = (~path, _children) => {
  ...component,
  didMount: _self => ReasonReact.Router.push(path),
  render: _self => ReasonReact.null,
};