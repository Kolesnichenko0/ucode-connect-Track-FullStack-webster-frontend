import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CanvasObject } from '../types/CanvasObject';

interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: { [key: string]: string };
  category: string;
  kind: string;
  menu: string;
}

interface GoogleFontsResponse {
  kind: string;
  items: GoogleFont[];
}

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
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSizeSelectOpen, setIsSizeSelectOpen] = useState(false);
  const [sizeSearchTerm, setSizeSearchTerm] = useState('');
  const sizeDropdownRef = useRef<HTMLDivElement>(null);
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
  const [googleFonts, setGoogleFonts] = useState<GoogleFont[]>([]);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [displayedGoogleFonts, setDisplayedGoogleFonts] = useState<GoogleFont[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  const GOOGLE_FONTS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY || '';

  const loadGoogleFonts = async () => {
    if (isLoading || googleFonts.length > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`
      );
      const data: GoogleFontsResponse = await response.json();
      const fonts = data.items || [];
      setGoogleFonts(fonts);
      const initialFonts = fonts.slice(0, 10);
      setDisplayedGoogleFonts(initialFonts);
      initialFonts.forEach(font => loadFont(font.family));
    } catch (error) {
      console.error('Не удалось загрузить Google Fonts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFont = (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    setLoadedFonts(prev => new Set([...prev, fontFamily]));
  };

  const preloadPopularFonts = () => {
    const popularFonts = [
      'Open Sans', 'Roboto', 'Lato', 'Montserrat', 'Poppins',
      'Source Sans Pro', 'Raleway', 'PT Sans', 'Lora', 'Nunito'
    ];

    popularFonts.forEach(font => {
      loadFont(font);
    });
  };

  const loadMoreFonts = async () => {
    if (isLoadingMore || displayedGoogleFonts.length >= googleFonts.length) return;

    setIsLoadingMore(true);
    const currentCount = displayedGoogleFonts.length;
    const nextFonts = googleFonts.slice(currentCount, currentCount + 10);

    await new Promise(resolve => setTimeout(resolve, 300));

    setDisplayedGoogleFonts(prev => [...prev, ...nextFonts]);
    nextFonts.forEach(font => loadFont(font.family));
    setIsLoadingMore(false);
  };

  const filteredSystemFonts = fonts.filter(font =>
    font.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFonts = searchTerm
    ? googleFonts.filter(font => font.family.toLowerCase().includes(searchTerm.toLowerCase()))
    : displayedGoogleFonts;

  useEffect(() => {
    if (searchTerm && displayedFonts.length > 0) {
      displayedFonts.slice(0, 50).forEach(font => {
        if (!loadedFonts.has(font.family)) {
          loadFont(font.family);
        }
      });
    }
  }, [displayedFonts, searchTerm, loadedFonts]);


  const filteredGoogleFonts = displayedGoogleFonts.filter(font =>
    font.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFontSizes = fontSizes.filter(size =>
    size.toString().includes(sizeSearchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
        setSearchTerm('');
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setIsSizeSelectOpen(false);
        setSizeSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFontSelectFromDropdown = (fontFamily: string) => {
    handleFontSelect(fontFamily);
    setIsSelectOpen(false);
    setSearchTerm('');
  };

  const handleDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (scrollHeight - scrollTop - clientHeight < 50 && !searchTerm) {
      loadMoreFonts();
    }
  };

  useEffect(() => {
    preloadPopularFonts();
    loadGoogleFonts();
  }, []);

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

  const handleFontSelect = (fontFamily: string) => {
    if (googleFonts.some(font => font.family === fontFamily)) {
      loadFont(fontFamily);
    }
    handleTextSettingChange('fontFamily', fontFamily);
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

  const inputBaseStyle = {
    width: '100%',
    padding: '8px 12px',
    border: `1px solid #D1D5DB`,
    borderRadius: '6px',
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  const dropdownStyle = {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    border: `1px solid #D1D5DB`,
    borderRadius: '6px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    zIndex: 1000,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    marginTop: '2px'
  };

  const optionStyle = {
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#111827',
    borderBottom: `1px solid #F3F4F6`,
    transition: 'background-color 0.15s ease'
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
            color: '#000000',
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
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            style={{
              ...inputBaseStyle,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '20px',
              backgroundColor: '#dadada',
            }}
          >
            <span style={{ fontFamily: currentTextSettings.fontFamily, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentTextSettings.fontFamily}
            </span>
            <span style={{
              transform: isSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              marginLeft: '8px',
              flexShrink: 0
            }}>
              ▼
            </span>
          </div>


          {isSelectOpen && (
            <div onScroll={handleDropdownScroll} style={dropdownStyle}>
              <div style={{
                padding: '12px',
                borderBottom: `1px solid #E5E7EB`,
                position: 'sticky' as const,
                top: 0,
                backgroundColor: '#FFFFFF',
                zIndex: 10
              }}>
                <input
                  type="text"
                  placeholder="Search fonts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid #D1D5DB`,
                    borderRadius: '4px',
                    backgroundColor: '#F9FAFB',
                    color: '#111827',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>
              

              {filteredSystemFonts.length > 0 && (
                <div>
                  <div
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    System Fonts
                  </div>
                  {filteredSystemFonts.map(font => (
                    <div
                      key={`system-${font}`}
                      onClick={() => handleFontSelectFromDropdown(font)}
                      style={{
                        ...optionStyle,
                        fontFamily: font,
                        backgroundColor: currentTextSettings.fontFamily === font ? '#EFF6FF' : 'transparent',
                        color: currentTextSettings.fontFamily === font ? '#2563EB' : '#111827'
                      }}
                      onMouseEnter={(e) => {
                        if (currentTextSettings.fontFamily !== font) {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentTextSettings.fontFamily !== font) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        } else {
                          e.currentTarget.style.backgroundColor = '#EFF6FF';
                        }
                      }}
                    >
                      {font}
                    </div>
                  ))}
                </div>
              )}

              {displayedFonts.length > 0 && (
                <div>
                  <div
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Google Fonts
                  </div>
                  {displayedFonts.map(font => (
                    <div
                      key={`google-${font.family}`}
                      onClick={() => handleFontSelectFromDropdown(font.family)}
                      style={{
                        ...optionStyle,
                        fontFamily: font.family,
                        backgroundColor: currentTextSettings.fontFamily === font.family ? '#EFF6FF' : 'transparent',
                        color: currentTextSettings.fontFamily === font.family ? '#2563EB' : '#111827'
                      }}
                      onMouseEnter={(e) => {
                        if (currentTextSettings.fontFamily !== font.family) {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentTextSettings.fontFamily !== font.family) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        } else {
                          e.currentTarget.style.backgroundColor = '#EFF6FF';
                        }
                      }}
                    >
                      {font.family}
                    </div>
                  ))}
                </div>
              )}

              {isLoadingMore && (
                <div
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '14px'
                  }}
                >
                  Loading more fonts...
                </div>
              )}

              {!isLoadingMore && !searchTerm && displayedGoogleFonts.length < googleFonts.length && (
                <div
                  onClick={loadMoreFonts}
                  style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: '#2563EB',
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderTop: `1px solid #E5E7EB`,
                    fontWeight: '500',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Load more fonts ({googleFonts.length - displayedGoogleFonts.length} remaining)
                </div>
              )}

              {searchTerm && filteredSystemFonts.length === 0 && displayedFonts.length === 0 && (
                <div
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '14px'
                  }}
                >
                  No fonts found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '15px', marginBottom: '4px', fontWeight: '500' }}>
          Size
        </label>
        <div style={{ position: 'relative' }} ref={sizeDropdownRef}>
          <div
            onClick={() => setIsSizeSelectOpen(!isSizeSelectOpen)}
            style={{
              ...inputBaseStyle,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '20px',
              backgroundColor: '#dadada',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentTextSettings.fontSize}px
            </span>
            <span style={{
              transform: isSizeSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              marginLeft: '8px',
              flexShrink: 0
            }}>
              ▼
            </span>
          </div>

          {isSizeSelectOpen && (
            <div style={dropdownStyle}>
              {filteredFontSizes.map(size => (
                <div
                  key={size}
                  onClick={() => {
                    handleTextSettingChange('fontSize', size);
                    setIsSizeSelectOpen(false);
                    setSizeSearchTerm('');
                  }}
                  style={{
                    ...optionStyle,
                    backgroundColor: currentTextSettings.fontSize === size ? '#EFF6FF' : 'transparent',
                    color: currentTextSettings.fontSize === size ? '#2563EB' : '#111827'
                  }}
                  onMouseEnter={(e) => {
                    if (currentTextSettings.fontSize !== size) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentTextSettings.fontSize !== size) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    } else {
                      e.currentTarget.style.backgroundColor = '#EFF6FF';
                    }
                  }}
                >
                  {size}px
                </div>
              ))}

              {sizeSearchTerm && filteredFontSizes.length === 0 && (
                <div style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#6B7280',
                  fontSize: '14px'
                }}>
                  No sizes found
                </div>
              )}
            </div>
          )}
        </div>
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