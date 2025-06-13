import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useSliderCommonProps } from '../components/ui/sliderStyles';
import Konva from 'konva';
import { useHistoryContext } from '../contexts/HistoryContext';
import { useTheme } from '../contexts/ThemeContext';

export default function EditImagePanel({width, height, selectedObject, objects, setObjects}) {
    const { addHistoryStep } = useHistoryContext();
    const { isDarkMode } = useTheme();
    const sliderCommonProps = useSliderCommonProps();

    const effectControls = [
        { label: 'Brightness', key: 'brightness', min: -1, max: 1, step: 0.01, default: 0 },
        { label: 'Contrast', key: 'contrast', min: -1, max: 1, step: 0.01, default: 0 },
        { label: 'Saturation', key: 'saturation', min: -1, max: 1, step: 0.01, default: 0 },
        { label: 'Blur', key: 'blurRadius', min: 0, max: 20, step: 1, default: 0 },
        { label: 'Noise', key: 'noise', min: 0, max: 1, step: 0.1, default: 0 },
        { label: 'Pixelate', key: 'pixelSize', min: 0, max: 30, step: 1, default: 0 },
    ];

    const handleChange = (prop: string, value: any,
        imageNode?: Konva.Image | null) => {

        const filtersMap: Record<string, any> = {
            brightness: 'Brighten',
            contrast: 'Contrast',
            saturation: 'HSV',
            blurRadius: 'Blur',
            grayscale: 'Grayscale',
            sepia: 'Sepia',
            invert: 'Invert',
            emboss: 'Emboss',
            noise: 'Noise',         
            pixelSize: 'Pixelate',
        };

        const selectedFilter = filtersMap[prop];

        const updated = objects.map(obj => {
            if (obj.id !== selectedObject?.id) return obj;

            let newFilters = [...(obj.filters || [])];

            if (prop === 'grayscale' || prop === 'sepia' || prop === 'invert' || prop === 'emboss') {
                if (value) {
                    if (selectedFilter && !newFilters.includes(selectedFilter)) {
                        newFilters = [...newFilters, selectedFilter];
                    }
                } else { 
                    newFilters = newFilters.filter(f => f !== selectedFilter);
                }
            } else {
                if (selectedFilter && !newFilters.includes(selectedFilter)) {
                    newFilters = [...newFilters, selectedFilter];
                }
            }
            
            return {
                ...obj,
                [prop]: value,
                filters: newFilters,
            };
        });
        setObjects(updated);
        addHistoryStep(`Image ${prop} changed`, updated);
        if (imageNode) {
            imageNode.cache();
            imageNode.getLayer()?.batchDraw();
        }
    };

    const handleMirroring = (format: string) => {
        if (!selectedObject) return;
        
        const updated = objects.map(obj => {
            if (obj.id !== selectedObject.id) return obj;

            if (format === 'vertical') {
                return {
                    ...obj,
                    scaleY: (obj.scaleY ?? 1) * -1,
                };
            }
            else { 
                return {
                    ...obj,
                    scaleX: (obj.scaleX ?? 1) * -1,
                };
            }     
        });
        
        setObjects(updated);
        addHistoryStep(`Image mirrored ${format}ly`, updated);
    }

    const rotateImage = (direction: 'left' | 'right') => {
        if (!selectedObject || selectedObject.type !== 'image') return;

        const angleDelta = direction === 'right' ? 90 : -90;

        const updated = objects.map(obj => {
            if (obj.id !== selectedObject.id) return obj;

            const currentRotation = obj.rotation || 0;
            let newRotation = (currentRotation + angleDelta + 360) % 360;
            let newWidth = obj.width;
            let newHeight = obj.height;

            if (Math.abs(angleDelta) === 90) {
                [newWidth, newHeight] = [obj.height, obj.width];
            }
            return {
                ...obj,
                rotation: newRotation,
                width: newWidth,
                height: newHeight,
            };
        });

        setObjects(updated);
        addHistoryStep(`Image rotated ${direction}`, updated);
    }

    const setImageAsBg = () => {
        const updated = objects.map(obj => {
            if (obj.id !== selectedObject.id) return obj;

            const isBg = !obj.isBackground;

            let newWidth = obj.width;
            let newHeight = obj.height;
            let newX = width / 2;
            let newY = height / 2;
            let newRotation = 0;
            let newScaleX = 1;
            let newScaleY = 1;

            if (isBg) {
                newWidth = width;
                newHeight = height;
            }

            return {
                ...obj,
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY,
                rotation: newRotation,
                scaleX: newScaleX,
                scaleY: newScaleY,
                isBackground: isBg,
                draggable: !isBg,
            };
        });

        const sortedObjects = updated.sort((a, b) => {
            const aIsBg = a.isBackground ? -1 : 0;
            const bIsBg = b.isBackground ? -1 : 0;
            return aIsBg - bIsBg;
        });
        setObjects(sortedObjects);
        addHistoryStep(`Image set as background`, sortedObjects);
    }

    return(<div className={`edit-image-panel ${isDarkMode ? 'dark-mode' : ''}`}> 
        <h2>Transforms</h2>
        <div className='transforms'>

        <div onClick={() => handleMirroring('horizontal')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 18L8 12L3 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 6L16 12L21 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <div onClick={() => handleMirroring('vertical')}> 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 3L12 9L18 3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 21L12 15L6 21" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div onClick={() => rotateImage('right')}>
            <svg height="21px" version="1.1" viewBox="0 0 16 21" width="16px" xmlns="http://www.w3.org/2000/svg"><title/><desc/><defs/>
            <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="currentColor" id="Core" transform="translate(-214.000000, -380.000000)"><g id="rotate-right" transform="translate(214.000000, 380.500000)">
                    <path d="M11.5,4.5 L7,0 L7,3.1 C3.1,3.6 0,6.9 0,11 C0,15.1 3.1,18.4 7,18.9 L7,16.9 C4.2,16.4 2,14 2,11 C2,8 4.2,5.6 7,5.1 L7,9 L11.5,4.5 L11.5,4.5 Z M15.9,10 C15.7,8.6 15.2,7.3 14.3,6.1 L12.9,7.5 C13.4,8.3 13.8,9.1 13.9,10 L15.9,10 L15.9,10 Z M9,16.9 L9,18.9 C10.4,18.7 11.7,18.2 12.9,17.3 L11.5,15.9 C10.7,16.4 9.9,16.8 9,16.9 L9,16.9 Z M12.9,14.5 L14.3,15.9 C15.2,14.7 15.8,13.4 15.9,12 L13.9,12 C13.8,12.9 13.4,13.7 12.9,14.5 L12.9,14.5 Z" id="Shape"/>
                </g></g></g>
            </svg>
        </div>
        <div onClick={() => rotateImage('left')}>
            <svg height="21px" version="1.1" viewBox="0 0 16 21" width="16px"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
                <g fill="currentColor" id="Core" transform="translate(-172.000000, -380.000000)"><g id="rotate-left" transform="translate(172.000000, 380.500000)">
                    <path d="M3.1,7.5 L1.7,6.1 C0.8,7.3 0.2,8.6 0.1,10 L2.1,10 C2.2,9.1 2.6,8.3 3.1,7.5 L3.1,7.5 Z M2.1,12 L0.1,12 C0.3,13.4 0.8,14.7 1.7,15.9 L3.1,14.5 C2.6,13.7 2.2,12.9 2.1,12 L2.1,12 Z M3.1,17.3 C4.3,18.2 5.6,18.7 7,18.9 L7,16.9 C6.1,16.8 5.3,16.4 4.5,15.9 L3.1,17.3 L3.1,17.3 Z M9,3.1 L9,0 L4.5,4.5 L9,9 L9,5.1 C11.8,5.6 14,8 14,11 C14,14 11.8,16.4 9,16.9 L9,18.9 C12.9,18.4 16,15 16,11 C16,7 12.9,3.6 9,3.1 L9,3.1 Z" id="Shape"/>
                </g></g></g>
            </svg>
        </div>
        
        </div>
        <h2>Effects</h2>
        <div className='properties-panel effects'>
            {effectControls.map(({ label, key, min, max, step, default: defaultValue }) => {
                const value = selectedObject?.[key] ?? defaultValue;
                const showReset = value !== defaultValue;

                return (
                <div key={key} className="control-group">
                    <div className="label-row">
                    <span className="info-label">{label}</span>
                    <span className="value-label">{value}</span>
                    </div>
                    <div className="input-row">
                    <Slider
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(val) => handleChange(key, val)}
                        {...sliderCommonProps}
                    />
                    {showReset && (
                        <button
                        className="reset-button"
                        onClick={() => handleChange(key, defaultValue)}
                        >
                        Reset
                        </button>
                    )}
                    </div>
                </div>
                );
            })}
        </div>
        <h2>Filters</h2>
        <div className='filters'>
            <div className={`filter-block wb-emboss ${selectedObject?.filters?.includes('Grayscale') ? 'active-filter' : ''}`}
                onClick={(e) => handleChange('grayscale', !selectedObject?.filters?.includes('Grayscale'))}>
                <div className='img-part'>
                    <img src='/images/filters/w&b.jpg' alt=''></img>
                </div>
                <div className='info-part wb-f'>
                    <span>Grayscale</span>
                </div>
            </div>
            <div className={`filter-block sepia-invert ${selectedObject?.filters?.includes('Sepia') ? 'active-filter' : ''}`}
                onClick={(e) => handleChange('sepia', !selectedObject?.filters?.includes('Sepia'))}>
                <div className='img-part'>
                    <img src='/images/filters/sepia.png' alt=''></img>
                </div>
                <div className='info-part sepia-f'>
                    <span>Sepia</span>
                </div>
            </div>
            <div className={`filter-block sepia-invert ${selectedObject?.filters?.includes('Invert') ? 'active-filter' : ''}`}
                onClick={(e) => handleChange('invert', !selectedObject?.filters?.includes('Invert'))}>
                <div className='img-part '>
                    <img src='/images/filters/invert.jpg' alt=''></img>
                </div>
                <div className='info-part invert-f'>
                    <span>Invert</span>
                </div>
            </div>
            <div className={`filter-block wb-emboss ${selectedObject?.filters?.includes('Emboss') ? 'active-filter' : ''}`}
                onClick={(e) => handleChange('emboss', !selectedObject?.filters?.includes('Emboss'))}>
                <div className='img-part'>
                    <img src='/images/filters/emboss.jpg' alt=''></img>
                </div>
                <div className='info-part emboss-f'>
                    <span>Emboss</span>
                </div>
            </div>
        </div>
        <div className='set-option'>
            <div className='info-bg-options'>
                <input
                  type='checkbox'
                  checked={selectedObject?.isBackground}
                  onChange={() => setImageAsBg()}
                />
                <span className='info-bg-text'>Set image as background</span>
            </div>
        </div>
    </div>);
}