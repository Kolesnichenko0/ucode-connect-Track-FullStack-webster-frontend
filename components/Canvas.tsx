import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { useTheme } from '../contexts/ThemeContext';
import { CanvasObject } from '../types/CanvasObject';
import CanvasImage from './CanvasImage';
import { Stage, Layer, Rect, Text, Transformer, Circle, Star, Line, Arrow } from 'react-konva';
import { useHistoryContext } from '../contexts/HistoryContext';
import DownloadModal from './DownloadModal';

type DrawingLineObject = {
  id: string;
  type: 'line';
  points: number[];
  stroke: string;
  strokeWidth: number;
  opacity: number;
  globalCompositeOperation: 'source-over' | 'destination-out';
};

export default function Canvas({ settings, activeTool, setActiveTool, paintTool, paintSettings, objects, setObjects, selectedId, setSelectedId, textSettings }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<DrawingLineObject | null>(null);
  const [zoom, setZoom] = useState(1);
  const shapeRefs = useRef({});
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const { isDarkMode } = useTheme();
  const { addHistoryStep, undo, redo, history, historyStep } = useHistoryContext();
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
    text: 'text',
  };

  useEffect(() => {
    const saved = localStorage.getItem('canvas-objects');
    if (saved) {
      const parsed = JSON.parse(saved);
      setObjects(parsed);
      history.current = [];
      history.current.push({
        objects: parsed,
        description: 'Initial state',
      });
      historyStep.current = 0;
    }
    else {
      history.current = [];
      history.current.push({
        objects: [],
        description: 'Initial empty canvas',
      });
      historyStep.current = 0;
    }

    const savedHistory = localStorage.getItem('canvas-history');
    const savedStep = localStorage.getItem('canvas-history-step');

    if (savedHistory) {
      history.current = JSON.parse(savedHistory);
      historyStep.current = savedStep ? parseInt(savedStep) : history.current.length - 1;
    } else {
      history.current = [{
        objects: [],
        description: 'Initial empty canvas',
      }];
      historyStep.current = 0;
    }

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
    addHistoryStep('Moved object' , objectsCopy);
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
    addHistoryStep('Transformed object' , updated);
  };

  const handleExportImg = (format, title) => {
    const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
    const uri = stageRef.current.toDataURL({mimeType, quality: 1});
    const link = document.createElement('a');
    link.download = `${title}.${format}`;
    link.href = uri;
    link.click();
  };

  const handleExportPDF = (title) => {
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
    const src = e.dataTransfer.getData('image-src');
    if (src) {
      const newImage: CanvasObject = {
        id: `img-${Date.now()}`,
        type: 'image',
        x: pointerPosition.x,
        y: pointerPosition.y,
        src,
      };
      const newObjects = [...objects, newImage];
      setObjects(newObjects);
      addHistoryStep(`Added image`, newObjects);
    }
  }

  const handleMouseDown = (e: any) => {
      if (activeTool) {
        const pointerPosition = stageRef.current.getPointerPosition();
  
        let newShape: CanvasObject;

        if (activeTool === 'text') {
          newShape = {
            id: `text-${Date.now()}`,
            type: 'text',
            x: pointerPosition.x,
            y: pointerPosition.y,
            text: textSettings?.text || 'Input text',
            fontSize: textSettings?.fontSize || 24,
            fill: textSettings?.fill || '#000000',
            fontFamily: textSettings?.fontFamily || 'Arial',
            fontStyle: textSettings?.fontStyle || 'normal',
            fontVariant: textSettings?.fontVariant || 'normal',
            textDecoration: textSettings?.textDecoration || 'none',
          };
        } else {
          newShape = {
            id: `shape-${Date.now()}`,
            type: shapeMap[activeTool],
            x: pointerPosition.x,
            y: pointerPosition.y,
            width: activeTool === 'rectangle' ? 200 : 100,
            height: 100,
            fill: 'black',
          };
        }

        const newObjects = [...objects, newShape];
        setObjects(newObjects);
        addHistoryStep(`Added ${activeTool}`, newObjects);
        setActiveTool(null);
      }
      else if ((paintTool === 'brush' || paintTool === 'eraser') && selectedId === null) {
        const stage = stageRef.current;
        const point = stage.getPointerPosition();

        const newLine: DrawingLineObject = {
          id: `line-${Date.now()}`,
          type: 'line',
          points: [point.x, point.y],
          stroke: paintTool === 'eraser' ? 'white' : paintSettings.fill || '#000',
          strokeWidth: paintSettings.strokeWidth || 5,
          opacity: paintTool === 'eraser' ? 1 : paintSettings.opacity,
          globalCompositeOperation: paintTool === 'eraser' ? 'destination-out' : 'source-over',
        }

        setIsDrawing(true);
        setCurrentLine(newLine);
      }
      if( e.target === e.target.getStage()) {
        setSelectedId(null);
      }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !currentLine) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();

    const newPoints = currentLine.points.concat([point.x, point.y]);
    setCurrentLine({ ...currentLine, points: newPoints });
  }

  const handleMouseUp = () => {
    if (isDrawing && currentLine) {
      const newObjects = [...objects, currentLine];
      setObjects(newObjects);
      addHistoryStep(`${paintTool === 'brush' ? 'Painted with brush' : 'Eraser used'}`, newObjects);
      setCurrentLine(null);
      setIsDrawing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedId) {
      const newObjects = objects.filter((o) => o.id !== selectedId);
      setSelectedId(null);
      addHistoryStep('Deleted object', newObjects);
    }

    if (selectedId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();

      const moveDistance = e.shiftKey ? 10 : 1;

      const updatedObjects = objects.map(obj => {
        if (obj.id === selectedId) {
          let newX = obj.x;
          let newY = obj.y;
      
          switch (e.key) {
            case 'ArrowUp':
              newY = Math.max(0, obj.y - moveDistance);
              break;
            case 'ArrowDown':
              newY = Math.min(height - (obj.height || 0), obj.y + moveDistance);
              break;
            case 'ArrowLeft':
              newX = Math.max(0, obj.x - moveDistance);
              break;
            case 'ArrowRight':
              newX = Math.min(width - (obj.width || 0), obj.x + moveDistance);
              break;
          }
      
          return { ...obj, x: newX, y: newY };
        }
        return obj;
      });
      
      setObjects(updatedObjects);
      addHistoryStep('Moved with arrow keys', updatedObjects);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const handleSave = () => {
    localStorage.setItem('canvas-objects', JSON.stringify(objects));
  }

  const shareToFacebook = () => {
    const imageUrl = stageRef.current.toDataURL({mimeType: 'image/jpeg', quality: 1});
    const pageUrl = `http://localhost:5173/share?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(shareUrl, '_blank');
  };

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('canvas-objects', JSON.stringify(objects));
    }
  }, [objects, hasLoaded]);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('canvas-history', JSON.stringify(history.current));
      localStorage.setItem('canvas-history-step', String(historyStep.current));
    }
  }, [history.current, historyStep.current, hasLoaded]);

  return (<>
    <div className='toolbar'>
        <button onClick={() => {undo(setObjects)}}><img id='undo-icon' src={`/images/editor/undo-icon${isDarkMode? '_white': ''}.png`}alt='Undo' /></button>
        <button onClick={() => {redo(setObjects)}}><img id='redo-icon' src={`/images/editor/redo-icon${isDarkMode? '_white': ''}.png`} alt='Redo' /></button>
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
        <button className='save' onClick={shareToFacebook}>
          <img id='share-icon' src={`/images/editor/share${isDarkMode? '_white': ''}.png`} alt='Share' />
        </button>
        <div className='dropdown'>
          <button onClick={() => setShowFormats(!showFormats)}>
            <img id='download-icon' src={`/images/editor/download${isDarkMode? '_white': ''}.png`} alt='Download' />
          </button>
        {
          showFormats && <DownloadModal setIsOpenModal={setShowFormats} handleExportImg={handleExportImg} handleExportPDF={handleExportPDF} projectTitle={title}/>
        }
        </div>
    </div>
    <div className='canvas' 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {e.preventDefault(); handleDrop(e);}}>
      <Stage  
        ref={stageRef} 
        width={width * zoom}
        height={height * zoom}
        scale={{ x: zoom, y: zoom }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
              return <Text
                key={obj.id}
                {...commonProps}
                fontFamily={obj.fontFamily || 'Arial'}
                fontStyle={obj.fontStyle || 'normal'}
                fontWeight={obj.fontVariant === 'bold' ? 'bold' : 'normal'}
                textDecoration={obj.textDecoration || 'none'}
              />;
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
              return <Line key={obj.id} points={[0, 0, obj.width, obj.height]} lineCap="round" lineJoin="round" stroke="black" {...commonProps} />;
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
          {currentLine && (
            <Line
              key={currentLine.id}
              points={currentLine.points}
              stroke={currentLine.stroke}
              strokeWidth={currentLine.strokeWidth}
              opacity={currentLine.opacity}
              globalCompositeOperation={currentLine.globalCompositeOperation}
              lineCap="round"
              lineJoin="round"
            />
          )}
            {selectedId && <Transformer
                ref={trRef}
                padding={2}
                borderStroke="#3b82f6"
                borderStrokeWidth={1.5}
                anchorStroke="#3b82f6"
                anchorStrokeWidth={1.5}
                anchorFill="#ffffff"
                anchorSize={8}
                rotateAnchorOffset={30}
            />}
        </Layer>

      </Stage>
    </div>
  </>);
}