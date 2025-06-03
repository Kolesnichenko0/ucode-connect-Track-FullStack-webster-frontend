import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { formatDate } from '../utils/dateUtils';
import DownloadPreview from './DownloadModal';
import '../styles/main.css';
import projectService from '../services/projectService';

const ProjectCard = ({ project}) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const router = useRouter();

    const deleteProject = async (id) => {
      const isConfirmed = window.confirm('Are you sure you want to delete this project?');
      if (isConfirmed) {
        await projectService.deleteProject(project.id);
      }
    }

    const shareProject = async (id) => {
      
    }

    const redirectMe = async(id) => {
      router.push(`project/${project.id}`);
    }

    return (
      <div>
        <div className='project' id={project.id}  onClick={() => setShowActions(!showActions)}>
          <div className='project-image-wrapper'>
            <img className='project-img' src={/*project.image*/ '/images/img.jpg'} alt='' />
          </div>
          <span className='project-title'>{/*project.title */'New Project'}</span>
          <div className="project-info">
            <span className="project-type">Post on Instagram</span>
            <span className='circle-separator'></span>
            <span className="project-date">
              {project.updatedAt ? new Date(project.createdAt).toLocaleDateString() : formatDate(new Date(), 'MMM dd, yyyy')}
            </span>
          </div>
          {
                isOpenModal && <DownloadPreview setIsOpenModal={setIsOpenModal}  projectId={project.id}/>
          }
          {showActions && (
          <div className='project-actions' onClick={(e) => e.stopPropagation()}>
            <div className='option-block'>
                <img className='option' id='edit-img' src='/images/edit-icon.png' onClick={() => {
                    redirectMe(project.id);
                }}></img>
            </div>
            <div className='option-block'>
                <img className='option' id='del-img' src='/images/delete-icon.png' onClick={() => {
                    deleteProject(project.id);
                }}></img>
            </div>
            <div className='option-block'>
                <img className='option' id='share-img' src='/images/share-icon.png' onClick={() => {
                    shareProject(project.id);
                }}></img>
            </div>
            <div className='option-block'>
                <img className='option' id='download-img' src='/images/download-icon.png' onClick={() => {
                    setIsOpenModal(true);
                }}></img>
            </div>
          </div>
        )}
        </div>
    
      </div>
    );
};

export default ProjectCard;