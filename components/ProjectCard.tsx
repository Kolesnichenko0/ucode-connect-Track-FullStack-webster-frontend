import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { formatDate } from '../utils/dateUtils';
import DownloadPreview from './DownloadModal';
import { toast } from 'react-toastify';
import toastStyles from './ui/toastStyles';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/main.css';
import projectService from '../services/projectService';
import axios from 'axios';

const ProjectCard = ({ project, onProjectChanged }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isDarkMode } = useTheme();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const router = useRouter();
    const DEFAULT_PREVIEW_URL = 'http://localhost:8080/assets/images/project/previews/default-project-preview.jpg';
    
    useEffect(() => {
      if (project?.previewUrl && project.previewUrl !== DEFAULT_PREVIEW_URL) {
        fetchThumbnail();
      }
      return () => {
        if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
      };
    }, [project]);

    const fetchThumbnail = async () => {
      try {
        const response = await axios.get(
          project.previewUrl,
          {
            responseType: 'blob',
          }
        );
        const blobUrl = URL.createObjectURL(response.data);
        setThumbnailUrl(blobUrl);
      } catch (err) {
        console.error('Error fetching thumbnail:', err);
        setThumbnailUrl(null);
      }
    };

    const deleteProject = async () => {
      const isConfirmed = window.confirm('Are you sure you want to delete this project?');
      if (isConfirmed) {
        await projectService.deleteProject(project.id);
        onProjectChanged();
      }
    }

    const copyImg = async () => {
      const copied = await projectService.createProjectCopy(project.id);
      onProjectChanged();
      if (copied.error) {
        toast.error(copied.message, toastStyles(isDarkMode, true));
      } else {
        toast.success('Project copied successfully',  toastStyles(isDarkMode));
      }
    }

    const redirectMe = async() => {
      router.push({
        pathname: `editor/${project.id}`, 
        query: {
          new: 'true',
        },
      });
    }

    return (
      <div>
        <div className='project' id={project.id}  onClick={() => setShowActions(!showActions)}>
          <div className='project-image-wrapper'>
            <img key={thumbnailUrl} className='project-img' src={thumbnailUrl ?? project.previewUrl} alt='' />
          </div>
          <span className='project-title'>{project.title ? project.title : 'Untitled'}</span>
          <div className="project-info">
            <span className="project-type">{project.type ? project.type : 'Post on Instagram'}</span>
            <span className='circle-separator'></span>
            <span className="project-date">
              {project.updatedAt ? formatDate(new Date(project.updatedAt), 'MMM dd, yyyy') : formatDate(new Date(), 'MMM dd, yyyy')}
            </span>
          </div>
          {
                isOpenModal && <DownloadPreview setIsOpenModal={setIsOpenModal}  projectId={project.id}/>
          }
          {showActions && (
          <div className='project-actions' onClick={(e) => e.stopPropagation()}>
            <div className='option-block'>
                <img className='option' id='edit-img' src='/images/copy-icon.png' onClick={() => {
                    copyImg();
                }}></img>
            </div>
            <div className='option-block'>
                <img className='option' id='edit-img' src='/images/edit-icon.png' onClick={() => {
                    redirectMe();
                }}></img>
            </div>
            <div className='option-block'>
                <img className='option' id='del-img' src='/images/delete-icon.png' onClick={() => deleteProject()}></img>
            </div>
          </div>
        )}
        </div>
      </div>
    );
};

export default ProjectCard;