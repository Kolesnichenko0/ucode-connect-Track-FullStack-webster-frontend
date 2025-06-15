import React, { useState, useEffect } from 'react';
import imagesService from '../services/imagesService';
import { useRouter } from 'next/router';

type UploadedImage = {
    url: string;
    fileKey: string;
    originalUrl?: string;
};

export default function ImagesPanel({projectId}) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('library');
    const [searchedTitle, setSearchedTitle] = useState('');
    const [bgImages, setBgImages] = useState<string[]>([]);
    const [elementsImages, setElementsImages] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [unsplashImages, setUnsplashImages] = useState<string[]>([]);

    useEffect(() => {
      const fetchImages = async () => {
        const images = await imagesService.getProjectBackgrounds();
        setBgImages(images);
        const elements = await imagesService.getProjectElements();
        setElementsImages(elements);
      };
      fetchImages();
    }, []);

    const fetchUnsplashImages = async() => {
        try {
            const unsplash = await imagesService.getUnsplashPhotos(searchedTitle);
            const urls = unsplash.map((img) => img.urls.small);
            setUnsplashImages(urls);
        } catch (error) {
            console.error('Failed to fetch Unsplash images:', error);
            setUnsplashImages([]);
        }
    };

    useEffect(() => {
        const fetchUploaded = async () => {
          const id = projectId;
          if (!id) return;
          try {
            const files = await imagesService.getAllProjectFiles(id);

            const blobUrls: UploadedImage[] = await Promise.all(
                files.map(async (file) => {
                  const previewUrl = file.previewUrl || file.url || file.fileKey;
                  const blobUrl = previewUrl ? await imagesService.getBlobPreviewUrl(previewUrl) : '';
                  return {
                    url: blobUrl,
                    fileKey: file.fileKey,
                  };
                })
              );

            setUploadedImages(blobUrls);
          } catch (err) {
            console.error('Failed to fetch project files:', err);
          }
        };
      
        fetchUploaded();
      }, [projectId]);

    const handleSearch = (e) => {
        setSearchedTitle(e.target.value);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const localPreviews = Array.from(files).map(file => ({
            url: URL.createObjectURL(file),
            fileKey: ''
        }));
        setUploadedImages((prev) => [...prev, ...localPreviews]);

        try {
            const uploaded = await Promise.all(
              Array.from(files).map((file) => imagesService.addFileToProject(projectId, file))
            );
      
            uploaded.forEach(async (file) => {
                const previewUrl = file.previewUrl || file.url || file.fileKey;
                if (!previewUrl) return;
          
                await new Promise(res => setTimeout(res, 700));
          
                const blobUrl = await imagesService.getBlobPreviewUrl(previewUrl);
                setUploadedImages(prev => {
                  const idx = prev.findIndex(img => img.fileKey === '');
                  if (idx === -1) return prev;

                  const updated = [...prev];
                  updated[idx] = { url: blobUrl, fileKey: file.fileKey };
                  return updated;
                });
              });
          } catch (error) {
            console.error('Upload failed:', error);
          }
    }

    const addUnsplashImageToProject = async (imageUrl: string) => {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'unsplash-image.jpg', { type: blob.type });
          const uploaded = await imagesService.addFileToProject(projectId, file);
          const localBlobUrl = URL.createObjectURL(blob);
          setUploadedImages(prev => [
            ...prev,
            {
                url: localBlobUrl,
                fileKey: uploaded.fileKey,
                originalUrl: imageUrl,
            }
        ]);
        } catch (err) {
          console.error('Failed to add Unsplash image:', err);
        }
    };

    const isImageAlreadyUploaded = (url: string): boolean => {
        return uploadedImages.some(img => img.originalUrl === url);
    };

    const rmFileFromProject = async(fileKey) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this image?');
        if (isConfirmed) {
            await imagesService.removeFileFromProject(projectId, fileKey);
            setUploadedImages(prev => prev.filter(img => img.fileKey !== fileKey));
        }
    }

    return(<div className='images-panel'>
        <div className='tabs'>
            <span onClick={() => setActiveTab('library')} className={`${activeTab === 'library' ? 'active-img-tab' : ''}`}>Library</span>
            <span onClick={() => setActiveTab('uploaded')} className={`${activeTab !== 'library' ? 'active-img-tab' : ''}`}>Uploaded</span>
        </div>
        { activeTab === 'library' && <>
            <div className='search-wrapper-img-p'>
                <input className='search' type="text" value={searchedTitle} placeholder='Search on Unsplash' 
                onChange={handleSearch} 
                onBlur={() => {
                    if (searchedTitle.trim() !== '') {
                        fetchUnsplashImages();
                    } else {
                        setUnsplashImages([]);
                    }
                }}/>
                <img id='search-img' src='/images/search-icon.png' className='search-icon'></img>
            </div>
            {  unsplashImages.length > 0 ? (<>
                    <h4>Unsplash Results</h4>
                    <div className='image-list unsplash-list'>
                    {unsplashImages.map((src, index) => {
                        const isAdded = isImageAlreadyUploaded(src);
                        return (
                            <div className='uploaded-img' key={index}>
                                <img
                                    key={`unsplash-${index}`}
                                    className='img-panel-image'
                                    src={src}
                                    draggable={isAdded}
                                    onDragStart={isAdded ? (e) => e.dataTransfer.setData('image-src', src) : undefined}
                                />
                                {!isAdded &&
                                    <img className='img-add' src='/images/plus.png' onClick={() => addUnsplashImageToProject(src)} alt=''/>
                                }
                            </div>
                        );
                    })}
                    </div> 
               </>) : (<>
                    <div className='library-section'>
                        <h4>Backgrounds</h4>
                        <div className='image-list'>
                            {bgImages.map((src, index) => (
                            <img
                                key={`bg-${index}`}
                                className='img-panel-image'
                                src={src}
                                draggable
                                onDragStart={(e) => {
                                e.dataTransfer.setData('image-src', src);
                                }}
                            />
                            ))}
                        </div>
                        </div>

                        <div className='library-section elements-section'>
                        <h4>Elements</h4>
                        <div className='image-list'>
                            {elementsImages.map((src, index) => (
                            <img
                                key={`el-${index}`}
                                className='img-panel-image'
                                src={src}
                                draggable
                                onDragStart={(e) => {
                                e.dataTransfer.setData('image-src', src);
                                }}
                            />
                            ))}
                        </div>
                    </div>
                </>)
            } 
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
                {uploadedImages.map(({ url, fileKey }, index) => (<>
                    <div className='uploaded-img' key={index}>
                        <img
                            className='img-panel-image'
                            src={url}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('image-src', url);
                            }}
                        />
                        <img className='img-del' src='/images/delete-icon.png' onClick={() => rmFileFromProject(fileKey)} alt=''/>
                    </div>
                </>))}
            </div>
        </>}
    </div>);
}