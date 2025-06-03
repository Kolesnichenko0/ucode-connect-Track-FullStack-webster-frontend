import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/projects.css';

type DownloadModalProps = {
  setIsOpenModal: (v: boolean) => void;
  handleExportImg?: (format: string, titleOverride?: string) => void;
  handleExportPDF?: (titleOverride?: string) => void;
  projectId?: string;
  projectTitle?: string;
};

const DownloadModal = ({setIsOpenModal, handleExportImg, handleExportPDF, projectId, projectTitle }: DownloadModalProps) => {
    const router = useRouter();
    const [title, setTitle] = useState(projectTitle || '');
    const [format, setFormat] = useState('png');

    const downloadFile = () => {
      if (handleExportImg && format !== 'pdf') {
        handleExportImg(format, title);
      } else if (handleExportPDF) {
        handleExportPDF(title);
      } else if (projectId) {
      }
      setIsOpenModal(false);
    }

    return(<>
        <div
            className='popup-backdrop'
            onClick={() => setIsOpenModal(false)}
        ></div>

        <div className='popup-window modal-window' onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={() => setIsOpenModal(false)}>
                    &times;
            </button>

            <div className='modal-content'>
            <label className='popup-label modal-label'>Title</label>
            <input type='text' className='popup-input modal-input' value={title} onChange={(e) => setTitle(e.target.value)} required></input>
            <label id='format-label' className='popup-label modal-label'>Format</label>
            <div className='modal-formats'>
              <button className={format === 'png' ? 'active-format' : 'format-btn'} onClick={() => setFormat('png')}>PNG</button>
              <button className={format === 'jpg' ? 'active-format' : 'format-btn'} onClick={() => setFormat('jpg')}>JPG</button>
              <button className={format === 'webp' ? 'active-format' : 'format-btn'} onClick={() => setFormat('webp')}>WEBP</button>
              <button className={format === 'pdf' ? 'active-format' : 'format-btn'} onClick={() => setFormat('pdf')}>PDF</button>
            </div>

            <button 
            id='modal-btn' 
            className='popup-btn' 
            onClick={() => {
              downloadFile();
            } }>
              Download file
            </button>
            </div> 
        </div>
    </>);
}

export default DownloadModal;