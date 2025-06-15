import { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { useTheme } from '../contexts/ThemeContext';
import { CanvasObject } from '../types/CanvasObject';
import CanvasImage from './CanvasImage';
import { Stage, Layer, Rect, Text, Transformer, Circle, Star, Line, Arrow, Group } from 'react-konva';
import { useHistoryContext } from '../contexts/HistoryContext';
import { TelegramShareButton, TwitterShareButton, TelegramIcon, TwitterIcon } from "next-share";
import { toast } from 'react-toastify';
import toastStyles from './ui/toastStyles';
import 'react-toastify/dist/ReactToastify.css';
import DownloadModal from './DownloadModal';
import Konva from 'konva';
import Scrollbar from 'react-scrollbars-custom';
import projectService from '../services/projectService';

interface ShareButtonsProps {
  title: string
  url: string
}

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
  const [showShareBtns, setShowShareBtns] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<DrawingLineObject | null>(null);
  const [zoom, setZoom] = useState(1);
  const shapeRefs = useRef({});
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const { isDarkMode } = useTheme();
  const { addHistoryStep, undo, redo, history, historyStep } = useHistoryContext();
  const imageRefs = useRef<Record<string, Konva.Image | null>>({});
  const shareTitle = "Look at this cool photo!";
  const {
    id,
    title,
    description,
    width,
    height,
    isTransparent,
    backgroundColor,
    type,
    showGrid,
    gridColor,
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

  const gridSize = 30;

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
    const baseId = id.replace('-rect', '');

    const textObj = objects.find((obj) => obj.id === baseId);
    const rectObj = objects.find((obj) => obj.id === `${baseId}-rect`);

    if (!textObj || !rectObj) return;

    const objectsCopy = objects.filter(
      (obj) => obj.id !== baseId && obj.id !== `${baseId}-rect`
    );

    objectsCopy.push(rectObj, textObj);
    setObjects(objectsCopy);
    addHistoryStep('Moved object' , objectsCopy);
  }

  const handleDragMove = (id: string, e: any) => {
    const baseId = id.replace('-rect', '');
  
    const newX = e.target.x();
    const newY = e.target.y();
  
    const updated = objects.map(obj => {
      if (obj.id === baseId || obj.id === `${baseId}-rect`) {
        return { ...obj, x: newX, y: newY };
      }
      return obj;
    });
  
    setObjects(updated);
  };

  const handleDragEnd = (id, e) => {
    const updated = objects.map(obj =>
      obj.id === id || obj.id === `${id}-rect` ? { ...obj, x: e.target.x(), y: e.target.y() } : obj
    );
    setObjects(updated);
  };

  const deselectElement = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleTransform = (id, e) => {
    const node = shapeRefs.current[id];
  
    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();
    const newX = node.x();
    const newY = node.y();
  
    const updated = objects.map(obj => {
      if (obj.id === id || obj.id === `${id}-rect`) {
        return {
          ...obj,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };
      }
      return obj;
    });
  
    setObjects(updated);
  };

  const handleTransformEnd = (id, e) => {
    const node = shapeRefs.current[id];

    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();

    const newX = node.x();
    const newY = node.y();

    /*
     
    const updated = objects.map(obj => {
      if (obj.id === id) {
        if (obj.type === 'image') {
          return {
            ...obj,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          };
        } else {
        return {
          ...obj,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
          scaleX: 1,
          scaleY: 1,
        };
      }
      }
      return obj;
    });*/

    node.scaleX(1);
    node.scaleY(1);

   const updated = objects.map(obj => {
      if (obj.id === id || obj.id === `${id}-rect`) {
        return {
          ...obj,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };
      }
      return obj;
    });
    
    setObjects(updated);
    addHistoryStep('Transformed object' , updated/*objects*/);
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
    const src = e.dataTransfer.getData('image-src');

    if (src) {
      const img = new (window as any).Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
  
      img.onload = () => {
        const newImage: CanvasObject = { 
          id: `img-${Date.now()}`,
          type: 'image',
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: img.width,    
          height: img.height,
          src,
          brightness: 0,
          contrast: 0,
          saturation: 0,
          blurRadius: 0,
          filters: [],
        };
  
        setObjects((prevObjects) => {
          const newObjects = [...prevObjects, newImage];
          addHistoryStep(`Added image`, newObjects);
          setSelectedId(newImage.id); 
          return newObjects;
        });
      };
  
      img.onerror = (err) => {
        console.error("Unable to load dragged image:", err);
      };
    }
  }

  function measureTextWidth(text: string, fontSize: number, fontFamily: string, fontStyle: string = 'normal') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 0;
  
    context.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  const handleMouseDown = (e: any) => {
      if (activeTool) {
        const pointerPosition = stageRef.current.getPointerPosition();
  
        let newShape: CanvasObject;
        let newObjects = [...objects];

        if (activeTool === 'text') {
          const baseId = `text-${Date.now()}`;
          const textWidth = measureTextWidth(textSettings?.text, textSettings?.fontSize, textSettings?.fontFamily, textSettings?.fontStyle)/* * textSettings?.fontSize * 0.6*/;
          const textHeight = textSettings?.fontSize * 1.2;

          const textShape: CanvasObject = {
            id: baseId,
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

          const rectShape: CanvasObject = {
            id: `${baseId}-rect`,
            type: 'rect',
            x: pointerPosition.x,
            y: pointerPosition.y,
            width: textWidth,
            height: textHeight,
            fill: 'transparent',
            cornerRadius: 4,
          };

          newObjects.push(rectShape);
          newObjects.push(textShape);
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

          newObjects.push(newShape);
        }

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
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
      const newObjects = objects.filter((o) => o.id !== selectedId && o.id !== `${selectedId}-rect`);
      setObjects(newObjects);
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
  }, [selectedId, objects, height, width]);

  const handleEditProject = async (id) => {
    try {
        const updatedProject = {
            title,
            ...(description && { description }),
            type: type && type.includes('x') ? `${width}x${height}` : type,
            content: {
                width,
                height,
                backgroundColor,
                isTransparent,
                showGrid,
                gridColor,
                thumbnailUrl: stageRef.current.toDataURL(),
                renderableObjects: objects,
            },
        };

        const updated = await projectService.editProject(id, updatedProject);
        if (updated.error) {
          toast.error(updated.message,  toastStyles(isDarkMode, true)/*{
            position: 'bottom-right',
            style: {
                background: isDarkMode ? '#000000' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#000000',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            },
        }*/);
        } else {
          toast.success('Project successfully saved',  toastStyles(isDarkMode)/*{
          position: 'bottom-right',
          style: {
              background: isDarkMode ? '#000000' : '#ffffff',
              color: isDarkMode ? '#ffffff' : '#000000',
              border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          },
        }*/);
        }
        
    } catch (error) {
        console.error('Error editing project:', error);
    }
};

  const handleSave = async () => {
    localStorage.setItem('canvas-objects', JSON.stringify(objects));
    if (hasLoaded) {
      await handleEditProject(id);
    }
  }

  const copyImageToClipboard = async() => {
    await handleSave();
    const dataUrl = stageRef.current.toDataURL({ mimeType: 'image/png' });

    const res = await fetch(dataUrl);
    const blob = await res.blob();

    if (!blob) {
      alert("Unable to get image to copy");
      return;
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    alert("Image copied to clipboard!");
  }

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

  useEffect(() => {
    if (hasLoaded) {
    const updated = objects.map(obj => {
      if (obj.isBackground) {
        return {
          ...obj,
          x: width / 2,
          y: height / 2,
          width,
          height,
        };
      }
      return obj;
    });
    setObjects(updated);
  }
  }, [width, height]);

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
        <div className='dropdown'>
          <button className='save' onClick={() => setShowShareBtns(!showShareBtns)}>
            <img id='share-icon' src={`/images/editor/share${isDarkMode? '_white': ''}.png`} alt='Share' />
          </button>
          { showShareBtns && <>
            <div className='dropdown-menu sort-dropdown share-dropdown-menu'>
            <div className="dropdown-option" onClick={() => copyImageToClipboard()}>
              <img src="/images/copy-icon.png" alt="" style={{ width: '24px' }} /> Copy Image
            </div>

            <div className="dropdown-option">
              <TelegramShareButton url={shareTitle} title={`${shareTitle} – See what I created!`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TelegramIcon size={24} round /> Telegram
                </div>
              </TelegramShareButton>
            </div>

            <div className="dropdown-option">
              <TwitterShareButton url={shareTitle} title={`${shareTitle} – See what I created!`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TwitterIcon size={24} round /> Twitter
                </div>
              </TwitterShareButton>
            </div>
            </div>
          </>}
        </div>
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

    <Scrollbar style={{ height: '84%', width: '95%', overflowX: 'auto', overflowY: 'auto', margin: '3%'}}>      
    <div className='canvas-wrapper'>
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

        { showGrid && 
            <Layer listening={false}>
              {
                Array.from({ length: Math.ceil(height / gridSize) }).map((_, i) => (
                  <Line
                    key={`h-${i}`}
                    points={[0, i * gridSize, width, i * gridSize]}
                    stroke={gridColor}
                    strokeWidth={1}
                  />
                ))
              }
              {
                Array.from({ length: Math.ceil(width / gridSize) }).map((_, i) => (
                  <Line
                    key={`v-${i}`}
                    points={[i * gridSize, 0, i * gridSize, height]}
                    stroke={gridColor}
                    strokeWidth={1}
                  />
                ))
              }
            </Layer>
        }
        
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
              onDragMove: (e: any) => handleDragMove(obj.id, e),
              onDragEnd: (e: any) => handleDragEnd(obj.id, e),
              onTransform: (e: any) => handleTransform(obj.id, e),
              onTransformEnd: (e: any) => handleTransformEnd(obj.id, e),
            };

            if (obj.type === 'text') {
              return <Text
                key={obj.id}
                {...commonProps}
                fontFamily={obj.fontFamily || 'Arial'}
                fontStyle={obj.fontStyle || 'normal'}
                fontWeight={obj.fontVariant === 'bold' ? 'bold' : 'normal'}
                textDecoration={obj.textDecoration || 'none'}
              />;
            } else if (obj.type === 'rect') {
              return <Rect key={obj.id} {...commonProps} />;
            }
            else if (obj.type === 'image') {
              return <CanvasImage
                key={obj.id}
                obj={obj}
                imageRefs={imageRefs}
                width={obj.width}
                height={obj.height}
                ref={(node: any) => {
                  shapeRefs.current[obj.id] = node;
                }}
                draggable={true}
                onClick={(e: any) => {
                  e.cancelBubble = true;
                  setSelectedId(obj.id);
                }}
                onDragStart={(e: any) => handleDragStart(obj.id, e)}
                onDragEnd={(e: any) => handleDragEnd(obj.id, e)}
                onTransformEnd={(e: any) => handleTransformEnd(obj.id, e)}
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
              return <Line key={obj.id} points={[0, 0, obj.width, obj.height]} hitStrokeWidth={30} lineCap="round" lineJoin="round" stroke="black" {...commonProps} />;
            } else if (obj.type === 'arrow') {
              return <Arrow key={obj.id} points={[0, 0, obj.width, obj.height]} hitStrokeWidth={30} fill="black" stroke="black" {...commonProps} />;
            } else if (obj.type === 'curve-line') {
              return <Line key={obj.id} tension={0.5} hitStrokeWidth={30} points={[
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
    </div>
    </Scrollbar>
  </>);
}