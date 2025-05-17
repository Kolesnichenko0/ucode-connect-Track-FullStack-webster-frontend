import React, { useState } from 'react';
import { useRouter } from 'next/router';

const PopupWindow = ({setIsOpenModal}) => {
    const router = useRouter();

    return(<>
        <div
            className='popup-backdrop'
            onClick={() => setIsOpenModal(false)}
        ></div>

        <div className='popup-window'>
            <button className="popup-close-btn" onClick={() => setIsOpenModal(false)}>
                    &times;
            </button>

            <h2 id='popup-header'>Create Project</h2>
            <label className='popup-label'>Title</label>
            <input type='text' className='popup-input'></input>
            <label className='popup-label'>Description</label>
            <input type='text' className='popup-input'></input>
            <label className='popup-label'>Height (in px)</label>
            <input type='number' className='popup-input' min='100' max='1000' placeholder='1080'></input>
            <label className='popup-label'>Width (in px)</label>
            <input type='number' className='popup-input' min='100' max='1200'  placeholder='1080'></input>
            <button className='popup-btn' onClick={() => {setIsOpenModal(false), router.push('/editor')} }>
            Create something incredible
            </button>
      </div>
    </>);
}

export default PopupWindow;