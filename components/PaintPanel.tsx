import React, { useState } from 'react';

export default function PaintPanel({ paintTool, setPaintTool, paintSettings, setPaintSettings }) {
    const handleChange = (prop: string, value: any) => {
        setPaintSettings(prev => ({ ...prev, [prop]: value }));
    };

    const chooseTool = (tool) => {
        if (paintTool === tool) {
            setPaintTool(null);
        }
        else {
            setPaintTool(tool);
        }
    }

    return(<div className='paint-panel'> 
        <h2>Tools</h2>
        <div className='tools'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 24 24" onClick={() => chooseTool('brush')} className={paintTool === 'brush' ? 'active-tool' : ''}>
                <path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.53 16.122a3 3 0 0 0-5.78 1.128a2.25 2.25 0 0 1-2.4 2.245a4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 24 24" onClick={() => chooseTool('eraser')} className={paintTool === 'eraser' ? 'active-tool' : ''}>
                <path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H8.5l-4.21-4.3a1 1 0 0 1 0-1.41l10-10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41L11.5 20m6.5-6.7L11.7 7"/>
            </svg>
        </div>
        <h2>Settings</h2>
        { !paintTool &&
            <div className='obj-tip'>Select tool to view settings</div>
        }
        {paintTool &&
            <div className='paint-settings'>
                {paintTool === 'brush' &&
                    <label>
                        Color:
                        <input
                            type="color"
                            value={paintSettings.fill || 'white'}
                            onChange={(e) => handleChange('fill', e.target.value)}
                        />
                    </label>
                }
                
                <label>
                    Size:
                    <input
                        type="range"
                        min={1}
                        max={20}
                        value={paintSettings.strokeWidth || 10}
                        onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
                    />
                </label>

                {paintTool === 'brush' && <>
                    <label>
                        Opacity:
                        <input
                            type="range"
                            min={0.01}
                            max={1}
                            step={0.01}
                            value={paintSettings.opacity || 1}
                            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
                        />
                    </label>
                </>}
            </div>
        }
    </div>);
}