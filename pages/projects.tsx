import '../styles/projects.css';
import { Scrollbar } from 'react-scrollbars-custom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import PopupWindow from '../components/PopupWindow'
import { useAuth } from '../contexts/AuthContext';
import { Project } from '../services/projectService';

export default function MyProjects() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [templates, setTemplates] = useState<Project[]>([]);
    const [searchedTitle, setSearchedTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth(); 

    useEffect(() => {
       fetchProjects();
    }, [searchedTitle]);
    

    const fetchProjects = async() => {
        setLoading(true);

        try {
            const resp = await projectService.getProjects(Number(user?.id), searchedTitle);
            setProjects(resp.items);
            const recent = await projectService.getRecentProjects(Number(user?.id), searchedTitle);
            setRecentProjects(recent.items);
            const tmps = await projectService.getTemplates();
            setTemplates(tmps.items);
            /*setTotalPages(Math.ceil(resp.data.total / resp.data.limit));*/
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e) => {
        setSearchedTitle(e.target.value);
        fetchProjects();
    };

    return (<>
    <div className='main-page'>
        <div className='main-part main-page-part'>
            <div className='search-wrapper'>
                <input id='searched-title' value={searchedTitle} placeholder='Search' onChange={handleSearch}></input>
                <svg className='search-icon' width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {/*<img src='/images/search-icon.png' className='search-icon'></img>
                <img src='/images/plus.png' id='plus-icon' onClick={() => setIsOpenModal(true)} alt="Create Project"></img>*/}
                <div id='plus-icon' onClick={() => setIsOpenModal(true)}>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            {
                isOpenModal && <PopupWindow setIsOpenModal={setIsOpenModal}/>
            }
            
            <div className="projects-wrapper">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0 }}className='section-title'>
                        Templates
                </motion.h2>
                
                <Scrollbar className='tmp-scroll' style={{ height: 300, width: 1365, margin: 'auto', marginTop: 40, overflowY: 'auto' }} noScrollX>
                    <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }} 
                    className='tmp-projects-part'>
                    {
                        templates.map((tmp) => (
                            <ProjectCard key={tmp.id} project={tmp}/> 
                        ))
                    } 
                    </motion.div>
                </Scrollbar>

                <motion.h2 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className='section-title'
                id='projects-title'>
                    Your projects
                </motion.h2>   
                {projects.length > 0 ? (
                <Scrollbar className='projects-scroll' style={{ height: projects.length > 0 ? (projects.length > 5 ? 508 : 290) : 'auto', width: 1365, margin: 'auto', marginTop: 40 }} noScrollX>
                    <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className='all-projects-part'>  
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project}/>
                        ))}
                    </motion.div>
                </Scrollbar>
                ) : (
                    <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className='all-projects-part'> 
                       { searchedTitle ? 
                       <p style={{ color: 'var(--text-color)', opacity: 0.7, height: '20px', marginTop: 40}}>
                           Nothing found 
                       </p>
                       :
                        <p style={{ color: 'var(--text-color)', opacity: 0.7, height: '20px', marginTop: 40}}>
                            To create a project click +
                        </p>
                       } 
                    </motion.div>
                )}
                { recentProjects.length > 0 && <>
                    <motion.h2 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className='section-title'
                        id='recent-pr-title'>
                            Recent projects
                    </motion.h2>    
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className='recent-projects-part'>
                            {
                                recentProjects.map((r) => (
                                    <ProjectCard key={r.id} project={r}/> 
                                ))
                            } 
                    </motion.div>
                </>}
            </div>
        </div>
    </div>
    </>);
}