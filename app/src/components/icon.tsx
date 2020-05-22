const withIcon = (icon) => {
  const Icon = ({ size = 24, color = "currentColor" }) => {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        shapeRendering="geometricPrecision"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  };

  return Icon;
};

export default withIcon;
