import '../styles/editor.css';
import { useState, useEffect } from 'react';
import ImagesPanel from '../components/ImagesPanel';
import { useTheme } from '../contexts/ThemeContext';
import dynamic from 'next/dynamic';
const Canvas = dynamic(() => import('../components/Canvas'), { ssr: false });

export default function EditorPage() {
  const [isOpenLeft, setIsOpenLeft] = useState(false);
  const [isOpenRight, setIsOpenRight] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

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
          <button id='elements-btn'><img id='elements-icon' src={`/images/editor/elements${isDarkMode? '_white': ''}.png`} alt='Elements' onClick={() => {handleLeftTabClick('elements')}}/></button>
          <button id='text-btn'><img id='text-icon' src={`/images/editor/text${isDarkMode? '_white': ''}.png`} alt='Text' onClick={() => {handleLeftTabClick('text')}}/></button>
          <button id='images-btn'><img id='images-icon' src={`/images/editor/images${isDarkMode? '_white': ''}.png`} alt='Images' onClick={() => {handleLeftTabClick('images')}}/></button>
          <button id='paint-btn'><img id='paint-icon' src={`/images/editor/paint${isDarkMode? '_white': ''}.png`} alt='Paint' onClick={() => {handleLeftTabClick('paint')}}/></button>
          <button id='instruction-btn'><img id='instruction-icon' src={`/images/editor/instruction${isDarkMode? '_white': ''}.png`} alt='Instruction' onClick={() => {handleLeftTabClick('instruction')}}/></button>
        </div>
        
      </div>
      {isOpenLeft && <div className='panel'>
        {activeLeftTab === 'elements' &&
        <></>
        }
        {activeLeftTab === 'text' &&
        <></>
        }
        {activeLeftTab === 'images' &&
          <ImagesPanel/>
        }
        {activeLeftTab === 'paint' &&
        <></>
        }
      </div>
      }

      <main className='editorArea'>
        <Canvas></Canvas>
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