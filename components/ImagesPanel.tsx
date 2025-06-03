import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ImagesPanel() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('library');
    const [searchedTitle, setSearchedTitle] = useState('');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleSearch = (e) => {
        setSearchedTitle(e.target.value);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        /*const uploaded = await Promise.all(
            Array.from(files).map(async (file) => {
              const formData = new FormData();
              formData.append('file', file);
        
              const res = await axios.post('/api/upload', formData);
              return `${res.data.fileKey}`;
            })
        );
        
        setUploadedImages((prev) => [...prev, ...uploaded]);*/

        const newImages = Array.from(files).map(file => URL.createObjectURL(file));
        setUploadedImages(prev => [...prev, ...newImages]);
    }

    return(<div className='images-panel'>
        <div className='tabs'>
            <span onClick={() => setActiveTab('library')} className={`${activeTab === 'library' ? 'active-img-tab' : ''}`}>Library</span>
            <span onClick={() => setActiveTab('uploaded')} className={`${activeTab !== 'library' ? 'active-img-tab' : ''}`}>Uploaded</span>
        </div>
        { activeTab === 'library' && <>
            <div className='search-wrapper-img-p'>
                <input className='search' type="text" value={searchedTitle} placeholder='Search for an image' onChange={handleSearch}></input>
                <img id='search-img' src='/images/search-icon.png' className='search-icon'></img>
            </div>
            <img 
                className='img-panel-image'
                src='/images/img.jpg' 
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData('image-src', '/images/img.jpg');
                }}
            />
        </>}
        { activeTab === 'uploaded' && <>
            <label className='upload-btn'>
                <input type="file" 
                multiple
                accept=".jpeg, .png, .jpg" 
                onChange={handleUpload} />
                Upload photo
            </label>
            <div className='uploaded-images'>
                {uploadedImages.map((src, index) => (
                    <img
                        key={index}
                        className='img-panel-image'
                        src={src}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('image-src', src);
                        }}
                    />
                ))}
            </div>
        </>}
    </div>);
}