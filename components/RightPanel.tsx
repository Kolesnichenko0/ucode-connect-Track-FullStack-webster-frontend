import React, { useState, useEffect } from 'react';
import { useHistoryContext } from '../contexts/HistoryContext';

export default function RightPanel({setIsOpenRight}) {
    const { history, historyStep, goToStep } = useHistoryContext();
    const [localHistory, setLocalHistory] = useState(history.current);
    const [localHistoryStep, setLocalHistoryStep] = useState(historyStep.current);

    useEffect(() => {
        setLocalHistoryStep(historyStep.current);
    }, [historyStep.current]);

    useEffect(() => {
        setLocalHistory(history.current);
    }, [history.current]);

    const handleStepClick = (index) => {
        goToStep(index);
        setLocalHistoryStep(index);
    };

    return (
        <div className='right-panel'>
            <h2>History</h2>
            <div className='history-info'>
            {localHistory.map((h, i) => (
                <div key={i} style={{ fontWeight: i === historyStep.current ? 'bold' : 'normal' }} onClick={() => handleStepClick(i)}>
                {i + 1}. {h.description}
                </div>
            ))}
            </div>
            <button className="rp-close-btn right-panel-toggle" onClick={() => setIsOpenRight(false)}>{'>'}</button>
        </div>
    );
}
