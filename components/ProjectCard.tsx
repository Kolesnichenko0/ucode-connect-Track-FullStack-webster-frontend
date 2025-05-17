import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/main.css';
import projectService from '../services/projectService';

const ProjectCard = ({ project}) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const downloadProject = async (id) => {
      
    }

    const redirectMe = async(id) => {
      router.push(`project/${project.id}`);
    }

    return (
      <div>
        <div className='project' id={project.id}  onClick={() => setShowActions(!showActions)}>
          <img className='project-img' src={/*project.image*/ '/images/img.jpg'} alt='' />
          <span className='project-title'>{/*project.title */'img1'}</span>
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
                    downloadProject(project.id);
                }}></img>
            </div>
          </div>
        )}
        </div>
    
      </div>
    );
};

export default ProjectCard;