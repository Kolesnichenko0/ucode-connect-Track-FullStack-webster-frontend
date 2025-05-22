import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CanvasObject } from '../types/CanvasObject';
import useImage from 'use-image';
import { Stage, Layer, Rect, Text, Image, Transformer } from 'react-konva';

export default function Canvas() {
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const shapeRefs = useRef({});
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const { isDarkMode } = useTheme();

  const initialObjects: CanvasObject[] = [
    {
      id: 'rect1',
      type: 'rect',
      x: 50,
      y: 60,
      width: 100,
      height: 100,
      fill: 'red',
    },
    {
      id: 'text1',
      type: 'text',
      x: 200,
      y: 100,
      text: 'Hello World',
      fontSize: 24,
      fill: 'black',
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('canvas-objects');
    if (saved) {
      setObjects(JSON.parse(saved));
    } else {
      setObjects(initialObjects);
    }
  }, []);

  useEffect(() => {
    if (selectedId && trRef.current && shapeRefs.current[selectedId]) {
      trRef.current.nodes([shapeRefs.current[selectedId]]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, objects]);

  const handleDragEnd = (id, e) => {
    const updated = objects.map(obj =>
      obj.id === id ? { ...obj, x: e.target.x(), y: e.target.y() } : obj
    );
    setObjects(updated);
  };

  const deselectElement = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleTransformEnd = (id, e) => {
    const node = shapeRefs.current[id];
    const updated = objects.map(obj => {
      if (obj.id === id) {
        return {
          ...obj,
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
        };
      }
      return obj;
    });
    node.scaleX(1);
    node.scaleY(1);
    setObjects(updated);
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = uri;
    link.click();
  };

  return (<>
    <div className='toolbar'>
        <button><img id='undo-icon' src={`/images/editor/undo-icon${isDarkMode? '_white': ''}.png`}alt='Undo' /></button>
        <button><img id='redo-icon' src={`/images/editor/redo-icon${isDarkMode? '_white': ''}.png`} alt='Redo' /></button>
        <button className='save'><img id='save-icon' src={`/images/editor/save${isDarkMode? '_white': ''}.png`} alt='Save' /></button>
        <button onClick={handleExport}><img id='download-icon' src={`/images/editor/download${isDarkMode? '_white': ''}.png`} alt='Download' /></button>
    </div>
    <div className='canvas' >
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const src = e.dataTransfer.getData('image-src');
                if (src) {
                    const stage = stageRef.current;
                    const pointerPosition = stage.getPointerPosition();
                    const newImage: CanvasObject = {
                        id: `img-${Date.now()}`,
                        type: 'image',
                        x: pointerPosition.x,
                        y: pointerPosition.y,
                        src,
                    };
                    setObjects(prev => [...prev, newImage]);
                }
            }}
        ></div>
      <Stage ref={stageRef} width={1080} height={720} onMouseDown={deselectElement} onTouchStart={deselectElement}>
        <Layer>
          {objects.map(obj => {
            const commonProps = {
              key: obj.id,
              ref: (node: any) => { shapeRefs.current[obj.id] = node },
              draggable: true,
              onClick: (e: any) => {
                e.cancelBubble = true;
                setSelectedId(obj.id);
              },
              onDragEnd: (e: any) => handleDragEnd(obj.id, e),
              onTransformEnd: (e: any) => handleTransformEnd(obj.id, e),
            };

            if (obj.type === 'rect') {
              return <Rect {...obj} {...commonProps} />;
            } else if (obj.type === 'text') {
              return <Text {...obj} {...commonProps} />;
            }
            return null;
          })}
           {selectedId && <Transformer ref={trRef} />}
        </Layer>
      </Stage>
    </div>
  </>);
}
