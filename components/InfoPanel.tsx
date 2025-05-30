import React, { useState } from 'react';
import { HuePicker } from 'react-color';

export default function InfoPanel({settings, setSettings}) {
    const handleChange = (prop: string, value: any) => {
        setSettings((prev) => ({ ...prev, [prop]: value }));
    }

    return(<div className='info-panel'> 
        <label className='info-label'>Title</label>
            <input type='text' className='info-input' value={settings.title} onChange={(e) => handleChange('title', e.target.value)} required></input>
            <label className='info-label'>Description</label>
            <input type='text' className='info-input' value={settings.description} onChange={(e) => handleChange('description', e.target.value)}></input>
            <div className='info-size-settings'>
              <div>
                <label className='info-label'>Height (in px)</label>
                <input id='info-height-input' value={settings.height} onChange={(e) => handleChange('height', Number(e.target.value))} type='number' className='info-input' min='100' max='1080' placeholder='1080' required></input>
              </div>
              <div>
                <label id='info-width-label' className='info-label info-wh-input'>Width (in px)</label>
                <input id='info-width-input' value={settings.width} onChange={(e) => handleChange('width', Number(e.target.value))} type='number' className='info-input' min='100' max='1200'  placeholder='1080' required></input>
              </div>
            </div>
                        
            <div className='info-bg-section'>
              <label className='info-label'>Background</label>
              <div className='info-bg-options'>
                <input
                  type='checkbox'
                  checked={settings.isTransparent}
                  onChange={() => handleChange('isTransparent', !settings.isTransparent)}
                />
                <span className='info-bg-text'>Transparent</span>
              </div>
              {!settings.isTransparent && (
                <div className="info-color-picker-wrapper">
                  <HuePicker
                    color={settings.backgroundColor}
                    onChangeComplete={(color) => handleChange('backgroundColor', color.hex)}
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
    </div>);
}