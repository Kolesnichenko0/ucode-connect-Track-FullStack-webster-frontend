import '../styles/editor.css';
import { useState, useEffect } from 'react';
import ImagesPanel from '../components/ImagesPanel';
import ElementsPanel from '../components/ElementsPanel';
import InfoPanel from '../components/InfoPanel';
import PaintPanel from '../components/PaintPanel';
import { useTheme } from '../contexts/ThemeContext';
import { CanvasObject } from '../types/CanvasObject';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const Canvas = dynamic(() => import('../components/Canvas'), { ssr: false });

export default function EditorPage() {
  const [isOpenLeft, setIsOpenLeft] = useState(false);
  const [isOpenRight, setIsOpenRight] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paintTool, setPaintTool] = useState<'brush' | 'eraser' | null>(null);
  const [settings, setSettings] = useState({
    title: '',
    description: '',
    width: 900,
    height: 600,
    isTransparent: true,
    backgroundColor: '#dedede',
  });
  const [paintSettings, setPaintSettings] = useState({
    fill: '#000000',
    strokeWidth: 5,
    opacity: 1,
  });
  const { isDarkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const isNewProject = router.query.new === 'true';
    const savedInfo = localStorage.getItem('editorSettings');

    if (isNewProject && router.query.width && router.query.height) {
      setSettings({
        title: String(router.query.title),
        description: String(router.query.description),
        width: Number(router.query.width),
        height: Number(router.query.height),
        isTransparent: router.query.isTransparent === 'true',
        backgroundColor: String(router.query.backgroundColor),
      });
      const { new: _, ...restQuery } = router.query;
      router.replace({
        pathname: router.pathname,
        query: restQuery,
      }, undefined, { shallow: true });
    }
    else if (savedInfo) {
      setSettings(JSON.parse(savedInfo));
    }
    
  }, [router.query]);

  useEffect(() => {
    localStorage.setItem('editorSettings', JSON.stringify(settings));
  }, [settings]);

  const handleLeftTabClick = (tab: string) => {
    if (activeLeftTab === tab) {
      setIsOpenLeft(false);
      setActiveLeftTab(null);
    } else {
      setIsOpenLeft(true);
      setActiveLeftTab(tab);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeTabs = document.querySelectorAll('.active-tab');
      activeTabs.forEach(tab => {
        tab.classList.remove('active-tab');
      });

      const el = document.getElementById(`${activeLeftTab}-btn`);
      if (el) {
        el.classList.add('active-tab');
      }
    }
  }, [activeLeftTab]);

  return (<>
    <div className='wrapper'>
      <div className='sidebar'>
        <div className='menu'>
          <button id='edit-info-btn'><img id='edit-info-icon' src={`/images/editor/edit-info${isDarkMode? '_white': ''}.png`} alt='Edit Info' onClick={() => {handleLeftTabClick('edit-info')}}/></button>
          <button id='elements-btn'><img id='elements-icon' src={`/images/editor/elements${isDarkMode? '_white': ''}.png`} alt='Elements' onClick={() => {handleLeftTabClick('elements')}}/></button>
          <button id='text-btn'><img id='text-icon' src={`/images/editor/text${isDarkMode? '_white': ''}.png`} alt='Text' onClick={() => {handleLeftTabClick('text')}}/></button>
          <button id='images-btn'><img id='images-icon' src={`/images/editor/images${isDarkMode? '_white': ''}.png`} alt='Images' onClick={() => {handleLeftTabClick('images')}}/></button>
          <button id='edit-img-btn'><img id='edit-img-icon' src={`/images/editor/edit-img${isDarkMode? '_white': ''}.png`} alt='Edit image' onClick={() => {handleLeftTabClick('edit-img')}}/></button>
          <button id='paint-btn'><img id='paint-icon' src={`/images/editor/paint${isDarkMode? '_white': ''}.png`} alt='Paint' onClick={() => {handleLeftTabClick('paint')}}/></button>
          <button id='instruction-btn'><img id='instruction-icon' src={`/images/editor/instruction${isDarkMode? '_white': ''}.png`} alt='Instruction' onClick={() => {handleLeftTabClick('instruction')}}/></button>
        </div>
        
      </div>
      {isOpenLeft && <div className='panel'>
        {activeLeftTab === 'edit-info' &&
          <InfoPanel settings={settings} setSettings={setSettings}/>
        }
        {activeLeftTab === 'elements' &&
          <ElementsPanel activeTool={activeTool} setActiveTool={setActiveTool} selectedObject={objects.find(obj => obj.id === selectedId)} setObjects={setObjects}/>
        }
        {activeLeftTab === 'text' &&
        <></>
        }
        {activeLeftTab === 'images' &&
          <ImagesPanel/>
        }
        {activeLeftTab === 'edit-img' &&
          <></>
        }
        {activeLeftTab === 'paint' &&
          <PaintPanel paintTool={paintTool} setPaintTool={setPaintTool} paintSettings={paintSettings} setPaintSettings={setPaintSettings}/>
        }
      </div>
      }

      <main className='editorArea'>
        <Canvas
          settings={settings}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          paintTool={paintTool}
          paintSettings={paintSettings}  
          objects={objects}
          setObjects={setObjects}
          selectedId={selectedId}
          setSelectedId={setSelectedId}/>
      </main>
     
      { isOpenRight &&
        <div className='right-panel'>
          <h2>Layers</h2>
          <button className="rp-close-btn right-panel-toggle" onClick={() => setIsOpenRight(false)}>{'>'}</button>
        </div>
      }
      {!isOpenRight && (
        <div className="right-panel-toggle" onClick={() => setIsOpenRight(true)}>
          {'<'}
        </div>
      )}
      
    </div>
  </>);
}

EditorPage.hideFooter = true;