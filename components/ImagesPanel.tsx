import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function ImagesPanel() {
    const router = useRouter();

    return(<>
        <div className='tabs'>
            <span className='active'>Library</span>
            <span>Uploaded</span>
        </div>
        <input type="text" placeholder="Search for an image" className='search' />
        <img 
            src='/images/img.jpg' 
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('image-src', '/images/img.jpg');
            }}
        />
    </>);
}