const withIcon = (icon) => {
  const Icon = ({ size = 24, color = "currentColor", fill = "none" }) => {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    )
  }

  return Icon
}

export default withIcon
