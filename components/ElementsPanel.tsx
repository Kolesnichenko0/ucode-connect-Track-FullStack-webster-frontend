import React, { useState } from 'react';
import { useHistoryContext } from '../contexts/HistoryContext';

export default function ElementsPanel({ activeTool, setActiveTool, selectedObject, objects, setObjects }) {
    const types = ['rect', 'circle', 'star', 'triangle', 'line', 'curve-line', 'arrow'];
    const typesWithoutLines = ['rect', 'circle', 'star', 'triangle', 'arrow'];
    const { addHistoryStep } = useHistoryContext();

    const handleChange = (prop: string, value: any) => {
        const updated = objects.map(obj =>
            obj.id === selectedObject.id ? { ...obj, [prop]: value } : obj
          );
        setObjects(updated);
        addHistoryStep(`${selectedObject.type === 'rect' ? 'Rectangle' : selectedObject.type.charAt(0).toUpperCase() + selectedObject.type.slice(1).toLowerCase()} ${prop} changed`, updated);
    };

    return(<div className='elements-panel'>
        <h2>Figures</h2>
        <div className='figures'>
            <div
                onClick={() => setActiveTool('rectangle')}
                className={`${activeTool === 'rectangle' ? 'active-tool' : ''}`}
                >
                    <svg width="35px" height="22px" stroke-width="1.5" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                        <rect x="1.5" y="1.5" width="37" height="21" rx="2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

            </div>
            <div
                onClick={() => setActiveTool('square')}
                className={`${activeTool === 'square' ? 'active-tool' : ''}`}
                >
                    <svg width="22px" height="26px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                        <path d="M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
            </div>
            <div
                onClick={() => setActiveTool('circle')}
                className={`${activeTool === 'circle' ? 'active-tool' : ''}`}
                >
                    <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
            </div>
            <div
                onClick={() => setActiveTool('triangle')}
                className={`${activeTool === 'triangle' ? 'active-tool' : ''}`}
                >
                   <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                    <path d="M11.4752 2.94682C11.7037 2.53464 12.2963 2.53464 12.5248 2.94682L21.8985 19.8591C22.1202 20.259 21.831 20.75 21.3738 20.75H2.62625C2.16902 20.75 1.87981 20.259 2.10146 19.8591L11.4752 2.94682Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                   </svg>
            </div>
            <div
                onClick={() => setActiveTool('star')}
                className={`${activeTool === 'star' ? 'active-tool' : ''}`}
                >
                   <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                    <path d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                   </svg>
            </div>
        </div>
        <h2>Lines</h2>
        <div className='lines'>
            <div
                onClick={() => setActiveTool('line')}
                className={`${activeTool === 'line' ? 'active-tool' : ''}`}
                >
                    <svg width="22px" height="22px" viewBox="0 0 22 22" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                        <path d="M15 4L8 20" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
            </div>
            <div
                onClick={() => setActiveTool('curve-line')}
                className={`${activeTool === 'curve-line' ? 'active-tool' : ''}`}
                >
                   <svg width="22px" height="22px" stroke-width="1.5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                    <path d="M3 20C11 20 13 4 21 4" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                   </svg>
            </div>
            <div
                onClick={() => setActiveTool('arrow')}
                className={`${activeTool === 'arrow' ? 'active-tool' : ''}`}
                >
                   <svg width="32px" height="24px" stroke-width="1.5" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                        <path d="M6.75 12H26.75M26.75 12L23 14.75M26.75 12L23 9.25" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
                    <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={selectedObject.opacity || 1}
                    onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
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
                    <input
                        type="range"
                        min={0}
                        max={20}
                        value={selectedObject.strokeWidth}
                        onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
                    />
                    </label>

                    <label>
                    Stroke Style:
                        <select
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
                        </select>
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