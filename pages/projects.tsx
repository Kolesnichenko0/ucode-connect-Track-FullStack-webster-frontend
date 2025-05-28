import '../styles/projects.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import projectService from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import PopupWindow from '../components/PopupWindow'

export default function MyProjects() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [searchedTitle, setSearchedTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const project = {} 

    useEffect(() => {
       // fetchProjects();
    }, [currentPage]);
    

    const fetchProjects = async() => {
        setLoading(true);

        try {
            const resp = await projectService.getProjects(searchedTitle, currentPage);
            setProjects(resp.data);
            setTotalPages(Math.ceil(resp.data.total / resp.data.limit));
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e) => {
        setSearchedTitle(e.target.value);
        setCurrentPage(1);
        fetchProjects();
    };

    return (<>
    <div className='main-page'>
        <div className='main-part main-page-part'>
            <div className='search-wrapper'>
                <input id='searched-title' value={searchedTitle} placeholder='Search' onChange={handleSearch}></input>
                <img src='/images/search-icon.png' className='search-icon'></img>
                <img src='/images/plus.png' id='plus-icon' onClick={() => setIsOpenModal(true)} alt="Create Project"></img>
            </div>
            {
                isOpenModal && <PopupWindow setIsOpenModal={setIsOpenModal}/>
            }
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0 }}className='section-title'>
                    Templates
            </motion.h2>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }} 
            className='tmp-projects-part'>
                
                {/*
                    projects.map((project) => (*/
                    <>
                    
                        <ProjectCard key={122} project={project}/>
                        <ProjectCard key={123} project={project}/>
                        <ProjectCard key={132} project={project}/>
                        <ProjectCard key={112} project={project}/>
                        <ProjectCard key={121} project={project}/>
                    </>
                   /* ))
                */}
            </motion.div>
            <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='section-title'>
                Your projects
            </motion.h2>
            <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='all-projects-part'>  
                <>
                    <ProjectCard key={1422} project={project}/>
                    <ProjectCard key={1243} project={project}/>
                    <ProjectCard key={1342} project={project}/>
                    <ProjectCard key={1412} project={project}/>
                    <ProjectCard key={1421} project={project}/>
                    <ProjectCard key={1112} project={project}/>
                </>
            </motion.div>
            <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='section-title'>
                Recent projects
            </motion.h2>
            <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className='recent-projects-part'>
                
                <>        
                    <ProjectCard key={1422} project={project}/>
                    <ProjectCard key={1243} project={project}/>
                    <ProjectCard key={1342} project={project}/>
                </>
            </motion.div>
        </div>
    </div>
    </>);
}