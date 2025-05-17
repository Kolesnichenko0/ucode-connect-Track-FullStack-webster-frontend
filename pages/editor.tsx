import '../styles/editor.css';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function EditorPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (<>
    <div className='wrapper'>
      <div className='sidebar'>
        <div className='menu'>
          <button><img id='elements-icon' src={`/images/editor/elements${isDarkMode? '_white': ''}.png`} alt='Elements' onClick={() => {setIsOpen(!isOpen)}}/></button>
          <button><img id='text-icon' src={`/images/editor/text${isDarkMode? '_white': ''}.png`} alt='Text' onClick={() => {setIsOpen(!isOpen)}}/></button>
          <button><img id='images-icon' src={`/images/editor/images${isDarkMode? '_white': ''}.png`} alt='Images' onClick={() => {setIsOpen(!isOpen)}}/></button>
          <button><img id='paint-icon' src={`/images/editor/paint${isDarkMode? '_white': ''}.png`} alt='Paint' onClick={() => {setIsOpen(!isOpen)}}/></button>
          <button><img id='instr-icon' src={`/images/editor/instruction${isDarkMode? '_white': ''}.png`} alt='Instruction' onClick={() => {setIsOpen(!isOpen)}}/></button>
        </div>
        
      </div>
      <div className= {`panel ${isOpen ? 'active-panel': ''}`}>
        {isOpen && <div className='tabs'>
            <span className='active'>Library</span>
            <span>Uploaded</span>
          </div>
          /*<input type="text" placeholder="Search text" className='search' /> */
        }
      </div>

      <main className='editorArea'>
        <div className='toolbar'>
          <button><img id='undo-icon' src={`/images/editor/undo-icon${isDarkMode? '_white': ''}.png`}alt='Undo' /></button>
          <button><img id='redo-icon' src={`/images/editor/redo-icon${isDarkMode? '_white': ''}.png`} alt='Redo' /></button>
          <button className='save'><img id='save-icon' src={`/images/editor/save${isDarkMode? '_white': ''}.png`} alt='Save' /></button>
        </div>
        <div className='canvas'></div>
      </main>

      <div className='settings'>
      </div>
    </div>
  </>);
}