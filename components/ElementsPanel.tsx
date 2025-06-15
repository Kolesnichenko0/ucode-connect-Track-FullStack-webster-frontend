import React, { useState } from 'react';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useSliderCommonProps } from '../components/ui/sliderStyles';
import { useHistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ElementsPanel({ settings, activeTool, setActiveTool, selectedObject, objects, setObjects }) {
    const types = ['rect', 'circle', 'star', 'triangle', 'line', 'curve-line', 'arrow'];
    const typesWithoutLines = ['rect', 'circle', 'star', 'triangle', 'arrow'];
    const [alignment, setAlignment] = useState('');
    const sliderCommonProps = useSliderCommonProps();
    const { isDarkMode } = useTheme();
    const { addHistoryStep } = useHistoryContext();

    const handleChange = (prop: string, value: any) => {
        const updated = objects.map(obj =>
            obj.id === selectedObject.id ? { ...obj, [prop]: value } : obj
          );
        setObjects(updated);
        addHistoryStep(`${selectedObject.type === 'rect' ? 'Rectangle' : selectedObject.type.charAt(0).toUpperCase() + selectedObject.type.slice(1).toLowerCase()} ${prop} changed`, updated);
    };

    const handleAlignment = (type: string) => {
        if (!selectedObject) return;
    
        const canvasWidth = settings.width;
        const canvasHeight = settings.height;
    
        let newX = selectedObject.x;
        let newY = selectedObject.y;
    
        const objectWidth = selectedObject.width || 100;
        const objectHeight = selectedObject.height || 100;
    
        switch (type) {
            case 'top':
                newY = 0;
                break;
            case 'bottom':
                newY = canvasHeight - objectHeight;
                break;
            case 'left':
                newX = 0;
                break;
            case 'right':
                newX = canvasWidth- objectWidth;
                break;
            case 'center':
                newX = (canvasWidth - objectWidth) / 2;
                newY = (canvasHeight - objectHeight) / 2;
                break;
            default:
                break;
        }
    
        const updated = objects.map(obj =>
            obj.id === selectedObject.id ? { ...obj, x: newX, y: newY } : obj
        );
        
        setObjects(updated);
        setAlignment(type);
        addHistoryStep(`Aligned ${type}`, updated);
    };

    const handleToolClick = (toolName: string) => {
        setActiveTool(prev => (prev === toolName ? null : toolName));
    };

    return(<div className={`elements-panel ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2>Figures</h2>
        <div className='figures'>
            <div
                onClick={() => handleToolClick('rectangle')}
                className={`${activeTool === 'rectangle' ? 'active-tool' : ''}`}
                >
                    <svg width="35px" height="22px" stroke-width="1.5" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1.5" y="1.5" width="37" height="21" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
            </div>
            <div
                onClick={() => handleToolClick('square')}
                className={`${activeTool === 'square' ? 'active-tool' : ''}`}
                >
                    <svg width="22px" height="26px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
            </div>
            <div
                onClick={() => handleToolClick('circle')}
                className={`${activeTool === 'circle' ? 'active-tool' : ''}`}
                >
                    <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
            </div>
            <div
                onClick={() => handleToolClick('triangle')}
                className={`${activeTool === 'triangle' ? 'active-tool' : ''}`}
                >
                   <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4752 2.94682C11.7037 2.53464 12.2963 2.53464 12.5248 2.94682L21.8985 19.8591C22.1202 20.259 21.831 20.75 21.3738 20.75H2.62625C2.16902 20.75 1.87981 20.259 2.10146 19.8591L11.4752 2.94682Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                   </svg>
            </div>
            <div
                onClick={() => handleToolClick('star')}
                className={`${activeTool === 'star' ? 'active-tool' : ''}`}
                >
                   <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                   </svg>
            </div>
        </div>
        <h2>Lines</h2>
        <div className='lines'>
            <div
                onClick={() => handleToolClick('line')}
                className={`${activeTool === 'line' ? 'active-tool' : ''}`}
                >
                    <svg width="22px" height="22px" viewBox="0 0 22 22" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 4L8 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
            </div>
            <div
                onClick={() => handleToolClick('curve-line')}
                className={`${activeTool === 'curve-line' ? 'active-tool' : ''}`}
                >
                   <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 20C11 20 13 4 21 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                   </svg>
            </div>
            <div
                onClick={() => handleToolClick('arrow')}
                className={`${activeTool === 'arrow' ? 'active-tool' : ''}`}
                >
                   <svg width="32px" height="24px" stroke-width="1.5" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.75 12H26.75M26.75 12L23 14.75M26.75 12L23 9.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                   </svg>
            </div>
        </div>
        <h3>Alignment</h3>
        <div className='figures'>
            <div
                onClick={() => handleAlignment('top')}
                >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 12L12 8M12 8L8 12M12 8V16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>
            </div> 
            <div
                onClick={() => handleAlignment('center')}
                >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                   </svg>
            </div> 
            <div
                onClick={() => handleAlignment('bottom')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12L12 16M12 16L16 12M12 16V8M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
            </div> 
            <div
                onClick={() => handleAlignment('left')}
                >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8L8 12M8 12L12 16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div> 
            <div
                onClick={() => handleAlignment('right')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L16 12M16 12L12 8M16 12H8M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
            </div> 
        </div>
        <h3>Object Properties</h3>
        {!selectedObject &&
            <div className='obj-tip'>Select object to view properties</div>
        }
        {selectedObject && (<>  
            <div className="properties-panel">
                {typesWithoutLines.includes(selectedObject.type) && (
                    <label>
                    Fill:
                    <input
                        type="color"
                        value={selectedObject.fill}
                        onChange={(e) => handleChange('fill', e.target.value)}
                    />
                    </label>
                )}

                <label>
                    Opacity:
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={selectedObject.opacity ?? 1}
                        onChange={(val) => handleChange('opacity', val)}
                        {...sliderCommonProps}
                    />
                </label>

                {types.includes(selectedObject.type) && (<>
                    <label>
                    Stroke:
                    <input
                        type="color"
                        value={selectedObject.stroke}
                        onChange={(e) => handleChange('stroke', e.target.value)}
                    />
                    </label>

                    <label>
                    Stroke Width:
                    <Slider
                        min={0}
                        max={20}
                        value={selectedObject.strokeWidth ?? 1}
                        onChange={(val) => handleChange('strokeWidth', val)}
                        {...sliderCommonProps}
                    />
                    </label>

                    <label>
                    Stroke Style:
                        {/*<select
                            value={selectedObject.dash?.length ? 'dashed' : 'solid'}
                            onChange={(e) =>
                            handleChange(
                                'dash',
                                e.target.value === 'dashed' ? [15, 15] : []
                            )
                            }
                        >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                        </select>*/}
                        <Select
                            options={[
                                { value: 'solid', label: 'Solid' },
                                { value: 'dashed', label: 'Dashed' },
                            ]}
                            value={{
                                value: selectedObject.dash?.length ? 'dashed' : 'solid',
                                label: selectedObject.dash?.length ? 'Dashed' : 'Solid',
                            }}
                            onChange={(option) => {
                                handleChange('dash', option?.value === 'dashed' ? [15, 15] : []);
                            }}
                            styles={{
                                container: (base) => ({ ...base, marginTop: '4px','&:hover': { borderColor: isDarkMode ? '#0462c6' : '#9cccff' } }),
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '30px',
                                    fontSize: '14px',
                                    '&:hover': { borderColor: isDarkMode ? '#0462c6' : '#9cccff' },
                                    borderColor: state.isFocused ? isDarkMode ? '#0462c6' : '#9cccff' : base.borderColor,
                                    boxShadow: state.isFocused ? '0 0 0 1px #abe2fb' : 'none',
                                }),
                                dropdownIndicator: (base) => ({
                                    ...base,
                                    padding: '4px',
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected
                                      ? isDarkMode ? '#0462c6' : '#9cccff'
                                      : state.isFocused
                                      ? '#e7f6fd'
                                      : 'white',
                                    color: 'black',
                                    cursor: 'pointer',
                                  }),
                                valueContainer: (base) => ({
                                    ...base,
                                    padding: '0 6px',
                                }),
                            }}
                            isSearchable={false}
                        />
                    </label>
                </>)}

                {selectedObject.type === 'rect' && (
                    <label>
                    Corner Radius:
                    <input
                        type="number"
                        min={0}
                        value={selectedObject.cornerRadius}
                        onChange={(e) => handleChange('cornerRadius', parseInt(e.target.value))}
                    />
                    </label>
                )}
            </div>
        </>)}
    </div>);
}