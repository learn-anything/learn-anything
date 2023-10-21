import { Match, Show, Switch } from "solid-js"

interface Props {
  name:
    | "Bug"
    | "Close"
    | "Minimise"
    | "Plus"
    | "Learn"
    | "Checkmark"
    | "UserProfile"
    | "Search"
    | "Options"
    | "Loading"
    | "Delete"
    | "Home"
    | "Heart"
    | "Menu"
    | "Loader"
    | "Github"
    | "Discord"
    | "Sparkles"
    | "X"
    | "Verified"

  width?: string
  height?: string
  fill?: string
  border?: string
  tooltip?: {
    content: string
    position: string
  }
}

export default function Icon(props: Props) {
  return (
    <>
      <style>{`
        #BottomLeft {
          top: 110%;
          left: -260%;
        }
        #BottomRight {
          top: 100%;
          left: 40%;
        }
        #TopLeft {
          top: -110%;
          left: -260%;
        }
        #TopRight {
          top: -100%;
          left: 40%;
        }
      `}</style>
      <div class="has-tooltip">
        <Show when={props.tooltip !== undefined}>
          <div
            id={props.tooltip?.position}
            class=" px-5 p-[1px] bg-zinc-100  dark:bg-neutral-950 rounded-full border  border-slate-400 border-opacity-50 tooltip"
          >
            {props.tooltip!.content}
          </div>
        </Show>
        <Switch>
          <Match when={props.name === "Verified"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="m9.75 12.75 1.5 1.5c.75-2.75 3-4.5 3-4.5m-4.713 8.197c-.986.143-1.967-.124-2.664-.82-.696-.697-.963-1.678-.82-2.664C5.255 13.867 4.75 12.985 4.75 12c0-.985.505-1.867 1.303-2.463-.142-.986.124-1.967.82-2.663.697-.697 1.678-.963 2.664-.82.596-.799 1.478-1.304 2.463-1.304.985 0 1.867.505 2.463 1.304.986-.143 1.967.123 2.664.82.696.696.963 1.677.82 2.663.798.596 1.303 1.478 1.303 2.463 0 .985-.505 1.867-1.303 2.463.143.986-.124 1.967-.82 2.664-.697.696-1.678.963-2.664.82-.596.798-1.478 1.303-2.463 1.303-.985 0-1.867-.505-2.463-1.303Z"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Home"}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6.75024 19.2502H17.2502C18.3548 19.2502 19.2502 18.3548 19.2502 17.2502V9.75025L12.0002 4.75024L4.75024 9.75025V17.2502C4.75024 18.3548 5.64568 19.2502 6.75024 19.2502Z"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.74963 15.7493C9.74963 14.6447 10.6451 13.7493 11.7496 13.7493H12.2496C13.3542 13.7493 14.2496 14.6447 14.2496 15.7493V19.2493H9.74963V15.7493Z"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "X"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="21px"
              height="21px"
            >
              <path
                fill="currentColor"
                d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
              />
            </svg>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="30px"
              height="30px"
            >
              <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" />
            </svg> */}
          </Match>
          <Match when={props.name === "Menu"}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4.75 5.75H19.25"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4.75 18.25H19.25"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4.75 12H19.25"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Sparkles"}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 4.75C17 5.89705 15.8971 7 14.75 7C15.8971 7 17 8.10295 17 9.25C17 8.10295 18.1029 7 19.25 7C18.1029 7 17 5.89705 17 4.75Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M17 14.75C17 15.8971 15.8971 17 14.75 17C15.8971 17 17 18.1029 17 19.25C17 18.1029 18.1029 17 19.25 17C18.1029 17 17 15.8971 17 14.75Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M9 7.75C9 9.91666 6.91666 12 4.75 12C6.91666 12 9 14.0833 9 16.25C9 14.0833 11.0833 12 13.25 12C11.0833 12 9 9.91666 9 7.75Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Heart"}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                fill={props.fill}
                stroke={props.border}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Options"}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
              ></path>
              <path
                fill="currentColor"
                d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z"
              ></path>
              <path
                fill="currentColor"
                d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Loading"}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>{`
        .spinner_P7sC {
            transformOrigin: center;
            animation: spinner_svv2 .75s infinite linear;
        }
        @keyframes spinner_svv2 {
            100% {
                transform: rotate(360deg);
            }
        }
    `}</style>
              <path
                d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                class="spinner_P7sC"
              />
            </svg>
          </Match>
          <Match when={props.name === "Search"}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Learn"}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.75 10L12 5.75L19.2501 10L12 14.25L4.75 10Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M12.5 10C12.5 10.2761 12.2761 10.5 12 10.5C11.7239 10.5 11.5 10.2761 11.5 10C11.5 9.72386 11.7239 9.5 12 9.5C12.2761 9.5 12.5 9.72386 12.5 10Z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M6.75 11.5V16.25C6.75 16.25 8 18.25 12 18.25C16 18.25 17.25 16.25 17.25 16.25V11.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "UserProfile"}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="8"
                r="3.25"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              ></circle>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6.8475 19.25H17.1525C18.2944 19.25 19.174 18.2681 18.6408 17.2584C17.8563 15.7731 16.068 14 12 14C7.93201 14 6.14367 15.7731 5.35924 17.2584C4.82597 18.2681 5.70558 19.25 6.8475 19.25Z"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Plus"}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 5.75V18.25"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M18.25 12L5.75 12"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Github"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              stroke={props.border ? props.border : "currentColor"}
              fill={props.fill ? props.fill : "currentColor"}
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Match>
          <Match when={props.name === "Discord"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z"
              />
            </svg>
          </Match>
          <Match when={props.name === "Loader"}>
            <svg
              width={props.width ? props.width : "24"}
              height={props.height ? props.height : "24"}
              stroke={props.border ? props.border : "black"}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>{`
          .spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}`}</style>
              <g class="spinner_V8m1">
                <circle
                  cx="12"
                  cy="12"
                  r="9.5"
                  fill="none"
                  stroke-width="3"
                ></circle>
              </g>
            </svg>
          </Match>
          <Match when={props.name === "Delete"}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6.75 7.75L7.59115 17.4233C7.68102 18.4568 8.54622 19.25 9.58363 19.25H14.4164C15.4538 19.25 16.319 18.4568 16.4088 17.4233L17.25 7.75"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.75 7.5V6.75C9.75 5.64543 10.6454 4.75 11.75 4.75H12.25C13.3546 4.75 14.25 5.64543 14.25 6.75V7.5"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 7.75H19"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Checkmark"}>
            <svg
              width={props.width ? props.width : "20"}
              height={props.height ? props.height : "20"}
              viewBox="0 0 24 24"
              fill={props.fill ? props.fill : "none"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.75 12.75L10 15.25L16.25 8.75"
                stroke={props.border ? props.border : "currentColor"}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </Match>
          <Match when={props.name === "Close"}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M17.25 6.75L6.75 17.25"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6.75 6.75L17.25 17.25"
              />
            </svg>
          </Match>
          <Match when={props.name === "Bug"}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.75 13C7.75 10.6528 9.65279 8.75 12 8.75C14.3472 8.75 16.25 10.6528 16.25 13V15C16.25 17.3472 14.3472 19.25 12 19.25C9.65279 19.25 7.75 17.3472 7.75 15V13Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 9V19"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.75 6.38333C8.75 5.48127 9.48127 4.75 10.3833 4.75H13.6167C14.5187 4.75 15.25 5.48127 15.25 6.38333C15.25 7.41426 14.4143 8.25 13.3833 8.25H10.6167C9.58574 8.25 8.75 7.41426 8.75 6.38333Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 14.75L6.06651 15.2713C5.27613 15.5587 4.75 16.3098 4.75 17.1509V19.25"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 11L5.8018 9.81635C5.15398 9.46753 4.75 8.79118 4.75 8.05541V5.75"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.5 14.75L17.9335 15.2713C18.7239 15.5587 19.25 16.3098 19.25 17.1509V19.25"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 11L18.1982 9.81635C18.846 9.46753 19.25 8.79118 19.25 8.05541V5.75"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Match>
          <Match when={props.name === "Minimise"}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.25 18.25V13.75H5.75"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.75 5.75V10.25H18.25"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.75 19.25L10.25 13.75"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19.25 4.75L13.75 10.25"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Match>
        </Switch>
      </div>
    </>
  )
}
