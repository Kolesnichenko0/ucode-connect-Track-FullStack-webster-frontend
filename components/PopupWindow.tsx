import React, { useState } from 'react';
import { useRouter } from 'next/router';

const templates = {
    photo: [
      { name: '12 mpx 4:3', size: '4032x3024' },
      { name: '8 mpx 4:3', size: '3264x2448' },
      { name: 'Landscape 3x2 in', size: '900x600' },
      { name: 'Landscape 6x4 in', size: '1800x1200' },
      { name: 'Portrait 4x6 in', size: '1200x1800' },
    ],
    social: [
      { name: 'Instagram Post', size: '1080x1080' },
      { name: 'Facebook Cover', size: '820x312' },
      { name: 'YouTube Thumbnail', size: '1280x720' },
    ],
    web: [
      { name: 'Web Banner', size: '1600x400' },
      { name: 'Website Header', size: '1920x600' },
    ],
};

const PopupWindow = ({setIsOpenModal}) => {
    const router = useRouter();
    const [tab, setTab] = useState<'photo' | 'social' | 'web'>('photo');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(1080);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [isTransparent, setIsTransparent] = useState(false);


    const handleTemplateClick = (size: string) => {
        const [w, h] = size.split('x').map(Number);
        setWidth(w);
        setHeight(h);
    };

    return(<>
        <div
            className='popup-backdrop'
            onClick={() => setIsOpenModal(false)}
        ></div>

        <div className='popup-window'>
            <button className="popup-close-btn" onClick={() => setIsOpenModal(false)}>
                    &times;
            </button>

            <h2 id='popup-header'>Create Project</h2>

            <div className='popup-container'>
                <div className='popup-left'>
                    <div className='popup-tabs'>
                        <button className={`popup-btn ${tab === 'photo' ? 'active-popup' : ''}`} onClick={() => setTab('photo')}>Photo</button>
                        <button className={`popup-btn ${tab === 'social' ? 'active-popup' : ''}`} onClick={() => setTab('social')}>Social</button>
                        <button className={`popup-btn ${tab === 'web' ? 'active-popup' : ''}`} onClick={() => setTab('web')}>Web</button>
                    </div>

                    <div className='popup-templates'>
                    {templates[tab].map(template => (
                        <div
                        key={template.name}
                        onClick={() => handleTemplateClick(template.size)}
                        className='popup-template-item'
                        >
                            <div className='popup-template-thumbnail' />
                            <div className='popup-template-name'>{template.name}</div>
                            <div className='popup-template-size'>{template.size} px</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='popup-right'>
            <label className='popup-label'>Title</label>
            <input type='text' className='popup-input'></input>
            <label className='popup-label'>Description</label>
            <input type='text' className='popup-input'></input>
            <label className='popup-label'>Height (in px)</label>
            <input type='number' className='popup-input' min='100' max='1000' placeholder='1080'></input>
            <label className='popup-label'>Width (in px)</label>
            <input type='number' className='popup-input' min='100' max='1200'  placeholder='1080'></input>
            
            <div className='popup-bg-section'>
              <label className='popup-label'>Background</label>
              <div className='popup-bg-options'>
                <input
                  type='checkbox'
                  checked={isTransparent}
                  onChange={() => setIsTransparent(!isTransparent)}
                />
                <span className='popup-bg-text'>Transparent</span>
              </div>
              {!isTransparent && (
                <input
                  type='color'
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className='popup-input popup-color-picker'
                />
              )}
            </div>
            
            <button id='popup-create-btn' className='popup-btn' onClick={() => {setIsOpenModal(false), router.push('/editor')} }>
            Create something incredible
            </button>
            </div> 
        </div>
      </div>
    </>);
}

export default PopupWindow;