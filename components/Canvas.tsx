import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { useTheme } from '../contexts/ThemeContext';
import { CanvasObject } from '../types/CanvasObject';
import CanvasImage from './CanvasImage';
import { Stage, Layer, Rect, Text, Transformer, Circle, Star, Line, Arrow, Group } from 'react-konva';

export default function Canvas({ settings, activeTool, setActiveTool, objects, setObjects, selectedId, setSelectedId }) {
  /*const [objects, setObjects] = useState<CanvasObject[]>([]);*/
  const [newShape, setNewShape] = useState<CanvasObject | null>(null);
  /*const [selectedId, setSelectedId] = useState<string | null>(null);*/
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [zoom, setZoom] = useState(1);
  const shapeRefs = useRef({});
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const { isDarkMode } = useTheme();
  const {
    title,
    description,
    width,
    height,
    isTransparent,
    backgroundColor
  } = settings;

  const shapeMap = {
    rectangle: 'rect',
    square: 'rect',
    circle: 'circle',
    triangle: 'triangle',
    star: 'star',
    line: 'line',
    arrow: 'arrow',
    'curve-line': 'curve-line',
  };

  /*const initialObjects: CanvasObject[] = [
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
  ];*/

  useEffect(() => {
    const saved = localStorage.getItem('canvas-objects');
    if (saved) {
      setObjects(JSON.parse(saved));
    }/* else {
      setObjects(initialObjects);
    }*/
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (selectedId && trRef.current && shapeRefs.current[selectedId]) {
      trRef.current.nodes([shapeRefs.current[selectedId]]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, objects]);

  const handleDragStart = (id, e) => {
    const objectsCopy = objects.slice();
    const obj = objectsCopy.find((i) => i.id === id);
    if (!obj) return;
    const index = objectsCopy.indexOf(obj);
    objectsCopy.splice(index, 1);
    objectsCopy.push(obj);
    setObjects(objectsCopy);
  }

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

  const handleExportImg = (format) => {
    const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
    const uri = stageRef.current.toDataURL({mimeType, quality: 1});
    const link = document.createElement('a');
    link.download = `${title}.${format}`;
    link.href = uri;
    link.click();
  };

  const handleExportPDF = () => {
    const imgData = stageRef.current.toDataURL({mimeType: 'image/jpeg', quality: 1});
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [width, height],
    });
  
    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.save(`${title}.pdf`);
  }

  const changeZoom = (newZoom: number) => {
    setZoom(newZoom);
  };
  
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  };
  
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();

    /*const shapeType = e.dataTransfer.getData('shape');
    if (shapeType) {

      const konvaType = shapeMap[shapeType];
      if (konvaType) {
        const newShape: CanvasObject = {
          id: `shape-${Date.now()}`,
          type: konvaType,
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: 100,
          height: 100,
          fill: 'green',
        };
        setObjects(prev => [...prev, newShape]);
        return;
      }
    }*/

    const src = e.dataTransfer.getData('image-src');
    if (src) {
      const newImage: CanvasObject = {
        id: `img-${Date.now()}`,
        type: 'image',
        x: pointerPosition.x,
        y: pointerPosition.y,
        src,
      };
      setObjects(prev => [...prev, newImage]);
    }
  }

  const handleMouseDown = (e: any) => {
      if (activeTool) {
        const pointerPosition = stageRef.current.getPointerPosition();
  
        const newShape: CanvasObject = {
          id: `shape-${Date.now()}`,
          type: shapeMap[activeTool],
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: activeTool === 'rectangle' ? 200 : 100,
          height: 100,
          fill: 'black',
        };
  
        setObjects(prev => [...prev, newShape]);
        setActiveTool(null);
      } else {
        if( e.target === e.target.getStage()) {
          setSelectedId(null);
        }
        
      }
  };

  /*const handleMouseDown = (e) => {
    if (!activeTool) {
      setSelectedId(null);
    };

    const stage = stageRef.current;
    const point = stage.getPointerPosition();

    setNewShape({
      id: `shape-${new Date()}`,
      type: shapeMap[activeTool],
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      fill: 'green',
    });
  };

  const handleMouseMove = (e) => {
    if (!newShape) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();

    const newWidth = point.x - newShape.x;
    const newHeight = point.y - newShape.y;

    setNewShape({
      ...newShape,
      width: newWidth,
      height: newHeight,
    });
  };

  const handleMouseUp = () => {
    if (newShape && newShape.type !== 'text') {
      if (Math.abs(newShape.width) > 5 && Math.abs(newShape.height) > 5) {
        const x = newShape.width < 0 ? newShape.x + newShape.width : newShape.x;
        const y = newShape.height < 0 ? newShape.y + newShape.height : newShape.y;
        const width = Math.abs(newShape.width);
        const height = Math.abs(newShape.height);
        setObjects(prev => [...prev, newShape]);
      }
      setNewShape(null);
      setActiveTool(null); 
    }
  };*/

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedId) {
      const newObjects = objects.filter((o) => o.id !== selectedId);
      setObjects(newObjects);
      setSelectedId(null);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const handleSave = () => {
    localStorage.setItem('canvas-objects', JSON.stringify(objects));
  }

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('canvas-objects', JSON.stringify(objects));
    }
  }, [objects, hasLoaded]);

  return (<>
    <div className='toolbar'>
        <button><img id='undo-icon' src={`/images/editor/undo-icon${isDarkMode? '_white': ''}.png`}alt='Undo' /></button>
        <button><img id='redo-icon' src={`/images/editor/redo-icon${isDarkMode? '_white': ''}.png`} alt='Redo' /></button>
        <div className="zoom-controls">
          <button onClick={zoomOut}>
          <img id='zoom-in-icon' src={`/images/editor/zoom-out${isDarkMode ? '_white' : ''}.png`} alt="Zoom out" />
          </button>

          <select
            value={zoom}
            onChange={(e) => changeZoom(parseFloat(e.target.value))}
          >
            <option value={0.25}>25%</option>
            <option value={0.5}>50%</option>
            <option value={0.75}>75%</option>
            <option value={1}>100%</option>
            <option value={1.25}>125%</option>
            <option value={1.5}>150%</option>
            <option value={1.75}>175%</option>
            <option value={2}>200%</option>
          </select>

          <button onClick={zoomIn}>
            <img id='zoom-in-icon' src={`/images/editor/zoom-in${isDarkMode ? '_white' : ''}.png`} alt="Zoom in" />
          </button>
        </div>
        <button className='save' onClick={handleSave}>
          <img id='save-icon' src={`/images/editor/save${isDarkMode? '_white': ''}.png`} alt='Save' />
        </button>
        <div className='dropdown'>
          <button onClick={() => setShowFormats(!showFormats)}>
            <img id='download-icon' src={`/images/editor/download${isDarkMode? '_white': ''}.png`} alt='Download' />
          </button>
        
          { showFormats && <>
            <div className='dropdown-menu sort-dropdown'>
                <div className='dropdown-option' onClick={() => handleExportImg('png')}><img src='https://static.thenounproject.com/png/11204-200.png' alt=''/>PNG</div>
                <div className='dropdown-option' onClick={() => handleExportImg('jpg')}><img src='https://static.thenounproject.com/png/11204-200.png' alt=''/>JPG</div>
                <div className='dropdown-option' onClick={() => handleExportImg('webp')}><img src='https://static.thenounproject.com/png/11204-200.png' alt=''/>WEBP</div>
                <div className='dropdown-option' onClick={() => handleExportPDF()}><img  src='/images/editor/document.png' alt=''/>PDF</div>
            </div>
          </>}
        </div>
    </div>
    <div className='canvas' 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {e.preventDefault(); handleDrop(e);}}>
          {/*
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        */}
      <Stage  
        ref={stageRef} 
        width={width * zoom}
        height={height * zoom}
        scale={{ x: zoom, y: zoom }}
        onMouseDown={handleMouseDown}
        onTouchStart={deselectElement}>

        <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={isTransparent ? undefined : backgroundColor}
              listening={false}
            />
        </Layer>

        <Layer>
          {objects.map(obj => {
            const commonProps = {
              ...obj,
              ref: (node: any) => { shapeRefs.current[obj.id] = node },
              draggable: true,
              onClick: (e: any) => {
                e.cancelBubble = true;
                setSelectedId(obj.id);
              },
              onDragStart: (e: any) => handleDragStart(obj.id, e),
              onDragEnd: (e: any) => handleDragEnd(obj.id, e),
              onTransformEnd: (e: any) => handleTransformEnd(obj.id, e),
            };

            if (obj.type === 'rect') {
              return <Rect key={obj.id} {...commonProps} />;
            } else if (obj.type === 'text') {
              return <Text key={obj.id} {...commonProps} />;
            } else if (obj.type === 'image') {
              return <CanvasImage
                key={obj.id}
                obj={obj}
                {...commonProps}
              />;
            } else if (obj.type === 'circle') {
              return <Circle key={obj.id} radius={obj.width / 2} {...commonProps} />;
            } else if (obj.type === 'star') {
              return <Star key={obj.id} numPoints={5} innerRadius={obj.width / 3} outerRadius={obj.width / 2} {...commonProps} />;
            } else if (obj.type === 'triangle') {
              return (
                <Line
                  key={obj.id}
                  points={[
                    obj.width / 2, 0,        
                    0, obj.height,            
                    obj.width, obj.height  
                  ]}
                  closed
                  fill={obj.fill}
                  stroke="black"
                  {...commonProps}
                />
              );
            } else if (obj.type === 'line') {
              return <Line key={obj.id} points={[0, 0, obj.width, obj.height]} stroke="black" {...commonProps} />;
            } else if (obj.type === 'arrow') {
              return <Arrow key={obj.id} points={[0, 0, obj.width, obj.height]} fill="black" stroke="black" {...commonProps} />;
            } else if (obj.type === 'curve-line') {
              return <Line key={obj.id} tension={0.5} points={[
                0, 0,
                obj.width / 2, -Math.max(obj.height, 50) / 2,
                obj.width, 0,
              ]} stroke="black" {...commonProps} />;
            }
            return null;
          })}
           {selectedId && <Transformer ref={trRef} />}
        </Layer>

      </Stage>
    </div>
  </>);
}