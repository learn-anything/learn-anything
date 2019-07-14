module Styles = {
  open Css;

  let home =
    style([
      background(Theme.colorBackground),
      color(Theme.colorTextPrimary),
    ]);
};

let component = ReasonReact.statelessComponent("Home");
let make = _children => {
  ...component,
  render: _self =>
    <div className=Styles.home> {ReasonReact.string("Home")} </div>,
};