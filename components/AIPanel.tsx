import React, { useState } from 'react';
import { toast } from 'react-toastify';
import toastStyles from './ui/toastStyles';
import { useTheme } from '../contexts/ThemeContext';
import imagesService from '../services/imagesService';

export default function AIPanel({ projectId }) {
  const [prompt, setPrompt] = useState('');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await imagesService.generateImage(prompt);
      const url = URL.createObjectURL(response);
      setImageUrl(url);
      setBlob(response);
    } catch (e) {
      setError('Error generating image');
    } finally {
      setLoading(false);
    }
  };

  /*const addGeneratedImageToProject = async () => {
    if (!blob) return;

    try {
      const file = new File([blob], 'ai-generated.png', { type: blob.type || 'image/png' });
      const uploaded = await imagesService.addFileToProject(projectId, file); 
  
      toast.success('Image uploaded! You can now drag it onto the canvas', toastStyles(isDarkMode));
      setIsUploaded(true);
    } catch (e) {
      console.error('Failed to upload generated image:', e);
      toast.error('Unable to load image. Try again', toastStyles(isDarkMode, true));
    }
  }*/

  return (
    <div className='info-panel ai-panel'>
      <input
        className='info-input'
        type="text"
        placeholder="Enter a description"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateImage} disabled={loading} style={{ width: '95%', marginTop: 10}} className='upload-btn'>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}

      {imageUrl && (
        <div className='uploaded-images'>
          <div className='uploaded-img'>
            <img
              src={imageUrl}
              alt={prompt}
              style={{ maxWidth: '300px', marginTop: 10, width: 225, borderRadius: '10px' }}
              draggable
              onDragStart={(e) => {
                  e.dataTransfer.setData('image-src', imageUrl);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}