interface Props {
  children: any
  label: string
}

export default function Tooltip(props: Props) {
  return (
    <>
      <style>
        {`
      .tooltip {
        @apply invisible absolute;
      }

      .has-tooltip:hover .tooltip {
        @apply visible z-50;
      }
      `}
      </style>
      <div class="has-tooltip relative">
        <div class="tooltip dark:text-white text-black font-light text-[14px] top-[-100%] right-[-170%] border-[0.5px] dark:border-neutral-700 border-gray-400 bg-white dark:bg-black px-2 p-0.5 rounded-[4px]">
          {props.label}
        </div>
        <div>{props.children}</div>
      </div>
    </>
  )
}
