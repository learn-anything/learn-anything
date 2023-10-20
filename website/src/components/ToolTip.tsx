interface Props {
  title: string
  children: any
}

export default function ToolTip(props: Props) {
  return (
    <>
      <div class="has-tooltip">
        <div class="tooltip top-[-70%] bg-white dark:bg-neutral-900 rounded-[4px] px-4 p-0.5 dark:text-white text-black text-opacity-70 dark:text-opacity-70 border dark:border-[#282828]  border-[#69696951] ">
          {props.title}
        </div>
        <div>{props.children}</div>
      </div>
    </>
  )
}
