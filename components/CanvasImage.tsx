import { Image } from 'react-konva';
import React from 'react';
import useImage from 'use-image';

export default function CanvasImage({ obj, ...props }) {
  const [img] = useImage(obj.src);

  if (!img) return null;

  return (
    <Image
      image={img}
      x={obj.x}
      y={obj.y}
      width={img?.width}
      height={img?.height}
      {...props}
    />
  );
}