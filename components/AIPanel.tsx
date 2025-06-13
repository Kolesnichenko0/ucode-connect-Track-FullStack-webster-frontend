import React, { useState } from 'react';

export default function AIPanel() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_MODELSLAB_API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://modelslab.com/api/v6/realtime/text2img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: apiKey,
          prompt,
          negative_prompt: 'good quality',
          width: '512',
          height: '512',
          samples: 1,
          safety_checker: false,
          seed: null,
          base64: false,
          webhook: null,
          track_id: null,
        }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.output?.[0]) {
        setImageUrl(data.output[0]);
      } else {
        setError('Unable to generate image');
      }
    } catch (e) {
      setError('Error generating image');
    } finally {
      setLoading(false);
    }
  };

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
          <img
            src={imageUrl}
            alt={prompt}
            style={{ maxWidth: '300px', marginTop: 10, width: 225, borderRadius: '10px' }}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('image-src', imageUrl);
            }}
          />
          <p style={{ marginTop: '10px'}}>Drag this image onto the canvas</p>
        </div>
      )}
    </div>
  );
}