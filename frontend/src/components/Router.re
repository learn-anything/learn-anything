module Router = ReasonReact.Router;

type action =
  | Home
  | NotFound;
type state = {page: ReasonReact.reactElement};
/* This type is used to extract functions accessing self from inside
   the component. In this particular case, it's used by the matchURL function,
   which uses self to dispatch actions. */
type self = ReasonReact.self(state, ReasonReact.noRetainedProps, action);

let initialState = () => {page: ReasonReact.null};
let reducer = action =>
  switch (action) {
  | Home => (_state => ReasonReact.Update({page: <Home />}))
  | NotFound => (
      _state => ReasonReact.Update({page: <Redirect path="/app/" />})
    )
  };

let matchURL = (self: self, url: Router.url) =>
  switch (url.path) {
  | ["app"] => self.send(Home)
  | _ => self.send(NotFound)
  };

let component = ReasonReact.reducerComponent("Router");
let make = _children => {
  ...component,
  initialState,
  reducer,
  didMount: self => {
    let watcherID = Router.watchUrl(url => matchURL(self, url));
    /* This is marked as "dangerous" because you technically shouldn't be
       accessing the URL outside of watchUrl's callback; you'd read a potentially
       stale url, instead of the fresh one inside watchUrl.
       But this helper is sometimes needed, if you'd like to initialize a page
       whose display/state depends on the URL, instead of reading from it in
       watchUrl's callback, which you'd probably have put inside didMount (aka
       too late, the page's already rendered).
       So, the correct (and idiomatic) usage of this helper is to only use it in
       a component that's also subscribed to watchUrl. */
    let initialURL = Router.dangerouslyGetInitialUrl();
    matchURL(self, initialURL);

    self.onUnmount(() => Router.unwatchUrl(watcherID));
  },
  render: self => self.state.page,
};