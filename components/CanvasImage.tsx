import { Image } from 'react-konva';
import React, { forwardRef,useState, useEffect, useRef} from 'react';
import useImage from 'use-image';
import Konva from 'konva';

interface CanvasImageProps {
  obj: any;
  imageRefs: React.MutableRefObject<Record<string, Konva.Image | null>>;
  x?: number;
  y?: number;
  width: number;
  height: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  offsetX?: number;
  offsetY?: number;
  draggable?: boolean;
  onClick?: (e: any) => void;
  onDragStart?: (e: any) => void;
  onDragEnd?: (e: any) => void;
  onTransform?: (e: any) => void;
  onTransformEnd?: (e: any) => void;
}

const CanvasImage = forwardRef<Konva.Image, CanvasImageProps>(({ obj, imageRefs, ...props }, ref) => { // Accept 'ref' as the second argument
  const [img] = useImage(obj.src, 'anonymous');
  
  const internalImageRef = useRef<any>(null); 

  const setRefs = (node: any) => {
    internalImageRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const filters = (obj.filters || []).map(
    (filterName: string) => Konva.Filters[filterName]
  );

  useEffect(() => {
    const node = internalImageRef.current;
    if (!img || !node) {
      console.log('No img or no node yet', { img, node });
      return;
    }

    node.clearCache();

    const activeFilterFunctions: ((imageData: ImageData) => void)[] = [];

    if (obj.filters?.includes('Grayscale')) activeFilterFunctions.push(Konva.Filters.Grayscale);
    if (obj.filters?.includes('Sepia')) activeFilterFunctions.push(Konva.Filters.Sepia);
    if (obj.filters?.includes('Invert')) activeFilterFunctions.push(Konva.Filters.Invert);
    if (obj.filters?.includes('Emboss')) activeFilterFunctions.push(Konva.Filters.Emboss);

    if (typeof obj.brightness === 'number' && obj.brightness !== 0) activeFilterFunctions.push(Konva.Filters.Brighten);
    if (typeof obj.contrast === 'number' && obj.contrast !== 0) activeFilterFunctions.push(Konva.Filters.Contrast);

    if (typeof obj.saturation === 'number' && obj.saturation !== 0) activeFilterFunctions.push(Konva.Filters.HSV);
    if (typeof obj.blurRadius === 'number' && obj.blurRadius !== 0) activeFilterFunctions.push(Konva.Filters.Blur);
    if (typeof obj.noise === 'number' && obj.noise !== 0) activeFilterFunctions.push(Konva.Filters.Noise);
    if (typeof obj.pixelSize === 'number' && obj.pixelSize !== 0) activeFilterFunctions.push(Konva.Filters.Pixelate);

    node.filters(activeFilterFunctions);

    node.brightness(obj.brightness ?? 0);
    node.contrast(obj.contrast ?? 0);
    node.saturation(obj.saturation ?? 0);
    node.blurRadius(obj.blurRadius ?? 0);
    node.noise(obj.noise ?? 0);
    node.pixelSize(obj.pixelSize ?? 0);

    node.cache();
    node.getLayer()?.batchDraw();

    if (imageRefs.current) {
      imageRefs.current[obj.id] = node;
    }
  }, [
    obj.brightness,
    obj.contrast,
    obj.saturation,
    obj.blurRadius,
    obj.noise,
    obj.pixelSize,
    obj.filters,
    obj.x, obj.y, obj.width, obj.height, obj.rotation, obj.scaleX, obj.scaleY, 
    obj.isBackground,
    img
  ]);

  if (!img) return null;

  return (
    <Image
      ref={setRefs} 
      image={img}
      {...props}
      x={obj.x}
      y={obj.y}
      width={obj.width ?? img.width}
      height={obj.height ?? img.height}
      
      rotation={obj.rotation || 0}
      offsetX={Math.round((obj.width ?? img.width) / 2)}
      offsetY={Math.round((obj.height ?? img.height) / 2)}
      scaleX={obj.scaleX || 1}
      scaleY={obj.scaleY || 1}
      brightness={obj.brightness ?? 0}
      contrast={obj.contrast ?? 0}
      saturation={obj.saturation ?? 0}
      blurRadius={obj.blurRadius ?? 0}
      noise={obj.noise ?? 0}
      pixelSize={obj.pixelSize ?? 0}
      draggable={obj.draggable ?? true}
    />
  );
});

export default CanvasImage;