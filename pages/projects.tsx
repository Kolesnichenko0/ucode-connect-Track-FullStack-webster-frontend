import '../styles/projects.css';
import { useState, useEffect } from 'react';
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
            <h2>Recent projects</h2>
            <div className='recent-projects-part'>
                
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
            </div>
            <h2>Your projects</h2>
            <div className='all-projects-part'>  
                <>
                    <ProjectCard key={1422} project={project}/>
                    <ProjectCard key={1243} project={project}/>
                    <ProjectCard key={1342} project={project}/>
                    <ProjectCard key={1412} project={project}/>
                    <ProjectCard key={1421} project={project}/>
                    <ProjectCard key={1112} project={project}/>
                </>
            </div>
            <h2>Templates</h2>
            <div className='tmp-projects-part'>
                
                <>        
                    <ProjectCard key={1422} project={project}/>
                    <ProjectCard key={1243} project={project}/>
                    <ProjectCard key={1342} project={project}/>
                </>
            </div>
            {/*<div id='main-pagination' className='pagination'>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? 'active' : 'inactive'}>
                        {index + 1}
                </button>
            ))}
        </div>*/}
        </div>
    </div>
    </>);
}