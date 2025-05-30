import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CanvasObject } from '../types/CanvasObject';

interface TextPanelProps {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
  selectedObject?: CanvasObject;
  setObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>;
  onTextSettingsChange?: (settings: any) => void;
}

const TextPanel: React.FC<TextPanelProps> = ({
  activeTool,
  setActiveTool,
  selectedObject,
  setObjects,
  onTextSettingsChange
}) => {
  const { isDarkMode } = useTheme();
  const [defaultTextSettings, setDefaultTextSettings] = useState({
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#000000',
    fontStyle: 'normal',
    fontVariant: 'normal',
    textDecoration: 'none'
  });

  const [currentTextSettings, setCurrentTextSettings] = useState(defaultTextSettings);
  const [textValue, setTextValue] = useState('Input text');
  const [isEditingSelected, setIsEditingSelected] = useState(false);

  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
    'Palatino'
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96];

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'text') {
      const settings = {
        fontSize: selectedObject.fontSize || 24,
        fontFamily: selectedObject.fontFamily || 'Arial',
        fill: selectedObject.fill || '#000000',
        fontStyle: selectedObject.fontStyle || 'normal',
        fontVariant: selectedObject.fontVariant || 'normal',
        textDecoration: selectedObject.textDecoration || 'none'
      };
      setCurrentTextSettings(settings);
      setTextValue(selectedObject.text || 'Input text');
      setIsEditingSelected(true);
    } else if (isEditingSelected) {
      setCurrentTextSettings(defaultTextSettings);
      setTextValue('Input text');
      setIsEditingSelected(false);
    }
  }, [selectedObject?.id, selectedObject?.type]);

  useEffect(() => {
    if (onTextSettingsChange && !isEditingSelected) {
      onTextSettingsChange({
        ...currentTextSettings,
        text: textValue
      });
    }
  }, [currentTextSettings, textValue, isEditingSelected, onTextSettingsChange]);

  const handleAddText = () => {
    setActiveTool('text');
  };

  const handleTextSettingChange = (property: string, value: any) => {
    const newSettings = { ...currentTextSettings, [property]: value };
    setCurrentTextSettings(newSettings);

    if (selectedObject && selectedObject.type === 'text' && isEditingSelected) {
      setObjects(prev => prev.map(obj => 
        obj.id === selectedObject.id 
          ? { ...obj, [property]: value }
          : obj
      ));
    } else {
      setDefaultTextSettings(newSettings);
    }
  };

  const handleTextValueChange = (value: string) => {
    setTextValue(value);
    
    if (selectedObject && selectedObject.type === 'text' && isEditingSelected) {
      setObjects(prev => prev.map(obj => 
        obj.id === selectedObject.id 
          ? { ...obj, text: value }
          : obj
      ));
    }
  };

  const toggleBold = () => {
    const newWeight = currentTextSettings.fontVariant === 'bold' ? 'normal' : 'bold';
    handleTextSettingChange('fontVariant', newWeight);
  };

  const toggleItalic = () => {
    const newStyle = currentTextSettings.fontStyle === 'italic' ? 'normal' : 'italic';
    handleTextSettingChange('fontStyle', newStyle);
  };

  const toggleUnderline = () => {
    const newDecoration = currentTextSettings.textDecoration === 'underline' ? 'none' : 'underline';
    handleTextSettingChange('textDecoration', newDecoration);
  };

  const toggleStrikethrough = () => {
    const newDecoration = currentTextSettings.textDecoration === 'line-through' ? 'none' : 'line-through';
    handleTextSettingChange('textDecoration', newDecoration);
  };

  return (
    <div className="text-panel" style={{
      padding: '16px',
     
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
        Text tools
      </h3>

      <button
        onClick={handleAddText}
        className='upload-btn'
        style={{ marginBottom: '16px' }}
      >
        {activeTool === 'text' ? 'Click on the canvas' : 'Add text'}
      </button>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '15px', marginBottom: '4px', fontWeight: '500' }}>
          Text
        </label>
        <textarea
          value={textValue}
          onChange={(e) => handleTextValueChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '4px',
            backgroundColor: '#dadada',
            color:'#000000',
            fontSize: '12px',
            resize: 'vertical',
            minHeight: '60px'
          }}
          placeholder="Input text..."
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '15px', marginBottom: '4px', fontWeight: '500' }}>
          Font
        </label>
        <select
          value={currentTextSettings.fontFamily}
          onChange={(e) => handleTextSettingChange('fontFamily', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '4px',
            backgroundColor: '#dadada',
            color: '#000000',
            fontSize: '12px'
          }}
        >
          {fonts.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '15px', marginBottom: '4px', fontWeight: '500' }}>
          Size
        </label>
        <select
          value={currentTextSettings.fontSize}
          onChange={(e) => handleTextSettingChange('fontSize', parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '4px',
            backgroundColor: '#dadada',
            color: '#000000',
            fontSize: '12px'
          }}
        >
          {fontSizes.map(size => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '15px', marginBottom: '4px', fontWeight: '500' }}>
          Color
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="color"
            value={currentTextSettings.fill}
            onChange={(e) => handleTextSettingChange('fill', e.target.value)}
            style={{
              width: '40px',
              height: '32px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <input
            type="text"
            value={currentTextSettings.fill}
            onChange={(e) => handleTextSettingChange('fill', e.target.value)}
            style={{
              flex: 1,
              padding: '8px',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '4px',
              backgroundColor: '#dadada',
              color: '#000000',
              fontSize: '12px'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '15px', marginBottom: '8px', fontWeight: '500' }}>
          Styles
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={toggleBold}
            style={{
              padding: '8px',
              backgroundColor: currentTextSettings.fontVariant === 'bold' ? (isDarkMode ? '#acacac' : '#acacac') : (isDarkMode ? '#dadada' : '#dadada'),
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            B
          </button>
          <button
            onClick={toggleItalic}
            style={{
              padding: '8px',
              backgroundColor: currentTextSettings.fontStyle === 'italic' ? (isDarkMode ? '#acacac' : '#acacac') : (isDarkMode ? '#dadada' : '#dadada'),
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontStyle: 'italic'
            }}
          >
            I
          </button>
          <button
            onClick={toggleUnderline}
            style={{
              padding: '8px',
              backgroundColor: currentTextSettings.textDecoration === 'underline' ? (isDarkMode ? '#acacac' : '#acacac') : (isDarkMode ? '#dadada' : '#dedede'),
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline'
            }}
          >
            U
          </button>
          <button
            onClick={toggleStrikethrough}
            style={{
              padding: '8px',
              backgroundColor: currentTextSettings.textDecoration === 'line-through' ? (isDarkMode ? '#acacac' : '#acacac') : (isDarkMode ? '#dadada' : '#dadada'),
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'line-through'
            }}
          >
            S
          </button>
        </div>
      </div>

      {isEditingSelected ? (
        <div style={{
          padding: '12px',
          backgroundColor: isDarkMode ? '#065f46' : '#d1fae5',
          borderRadius: '6px',
          fontSize: '15px',
          color: isDarkMode ? '#34d399' : '#065f46'
        }}>
          Selected text is being edited
        </div>
      ) : (
        <div style={{
          padding: '12px',
          backgroundColor: '#dbeafe',
          borderRadius: '6px',
          fontSize: '15px',
          color: '#1e40af'
        }}>
          Text settings
        </div>
      )}
    </div>
  );
};

export default TextPanel; 