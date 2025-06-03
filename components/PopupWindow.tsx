import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { HuePicker } from 'react-color';

const templates = {
    photo: [
      { name: '12 mpx 4:3', size: '1600x1200', thumbnail: 'https://static.thenounproject.com/png/11204-200.png' },
      { name: '8 mpx 4:3', size: '1280x960', thumbnail: 'https://static.thenounproject.com/png/11204-200.png'},
      { name: 'Landscape 3x2 in', size: '900x600', thumbnail: 'https://static.thenounproject.com/png/11204-200.png' },
      { name: 'Landscape 6x4 in', size: '1200x800', thumbnail: 'https://static.thenounproject.com/png/11204-200.png' },
      { name: 'Portrait 2x3 in', size: '600x900', thumbnail: 'https://static.thenounproject.com/png/11204-200.png' },
    ],
    social: [
      { name: 'Instagram Post', size: '1080x1080', thumbnail: '/images/instagram.png' },
      { name: 'Facebook Cover', size: '820x312', thumbnail: '/images/facebook.png'},
      { name: 'YouTube Thumbnail', size: '1280x720', thumbnail: '/images/youtube.png'},
    ],
    web: [
      { name: 'Web Banner', size: '1600x400', thumbnail: '/images/web.png' },
      { name: 'Website Header', size: '1200x400', thumbnail: '/images/web.png' },
    ],
};

const PopupWindow = ({setIsOpenModal}) => {
    const router = useRouter();
    const [tab, setTab] = useState<'photo' | 'social' | 'web'>('photo');
    const [title, setTitle] = useState('Untitled');
    const [activeTmp, setActiveTmp] = useState('');
    const [description, setDescription] = useState('');
    const [width, setWidth] = useState(900);
    const [height, setHeight] = useState(600);
    const [backgroundColor, setBackgroundColor] = useState('#dedede');
    const [isTransparent, setIsTransparent] = useState(true);


    const handleTemplateClick = (size: string) => {
        const [w, h] = size.split('x').map(Number);
        setWidth(w);
        setHeight(h);
    };

    const generateContent = (userId: number) => {
      const timestamp = Date.now();
    
      return {
        id: `project_${timestamp}_${Math.random().toString(36).substr(2, 8)}`,
        title: title || 'Untitled',
        description: description || '',
        width,
        height,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        thumbnailUrl: null,
        backgroundColor,
        isTransparent,
        objects: [],
        userId
      };
    };

    return(<>
        <div
            className='popup-backdrop'
            onClick={() => setIsOpenModal(false)}
        ></div>

        <div className='popup-window' onClick={(e) => e.stopPropagation()}>
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
                        onClick={() => {setActiveTmp(template.name); handleTemplateClick(template.size)}}
                        className={`popup-template-item ${activeTmp === template.name ? 'active-tmp' : ''}`}
                        >
                            <div className='popup-template-thumbnail'>
                              <img className='popup-tmp-img' src={template.thumbnail} alt={template.name} />
                            </div>
                            <div className='popup-template-name'>{template.name}</div>
                            <div className='popup-template-size'>{template.size} px</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='popup-right'>
            <label className='popup-label'>Title</label>
            <input type='text' className='popup-input' value={title} onChange={(e) => setTitle(e.target.value)} required></input>
            <label className='popup-label'>Description</label>
            <input type='text' className='popup-input' value={description} onChange={(e) => setDescription(e.target.value)}></input>
            <div className='size-settings'>
              <div>
                <label className='popup-label'>Height (in px)</label>
                <input id='height-input' value={height} onChange={(e) => setHeight(Number(e.target.value))} type='number' className='popup-input' min='100' max='1080' placeholder='1080' required></input>
              </div>
              <div>
                <label id='width-label' className='popup-label wh-input'>Width (in px)</label>
                <input id='width-input' value={width} onChange={(e) => setWidth(Number(e.target.value))} type='number' className='popup-input' min='100' max='1200'  placeholder='1080' required></input>
              </div>
            </div>
                        
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
                <div className="popup-color-picker-wrapper">
                  <HuePicker
                    color={backgroundColor}
                    onChangeComplete={(color) => setBackgroundColor(color.hex)}
                    styles={{
                      default: {
                        picker: {
                          width: '89%',
                          boxSizing: 'border-box',
                          height: '80px',
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
            
            <button 
            id='popup-create-btn' 
            className='popup-btn' 
            onClick={() => {
              setIsOpenModal(false),
              localStorage.removeItem('canvas-objects'),
              localStorage.removeItem('canvas-history'),
              localStorage.removeItem('canvas-history-step'),
              router.push({
                pathname: '/editor',
                query: {
                  title,
                  description,
                  width,
                  height,
                  isTransparent,
                  backgroundColor,
                  new: 'true',
                },
              });
            } }>
              Create something incredible
            </button>
            </div> 
        </div>
      </div>
    </>);
}

export default PopupWindow;