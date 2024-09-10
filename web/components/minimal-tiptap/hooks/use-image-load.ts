import * as React from 'react'

export const useImageLoad = (src: string) => {
  const [imgSize, setImgSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgSize({ width: img.width, height: img.height })
    }
  }, [src])

  return imgSize
}
