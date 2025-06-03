import { createContext, useContext, useRef } from 'react';
import { CanvasObject } from '../types/CanvasObject';

type HistoryEntry = {
  objects: CanvasObject[];
  description: string;
};

type HistoryContextType = {
  history: React.MutableRefObject<HistoryEntry[]>;
  historyStep: React.MutableRefObject<number>;
  goToStep: (step: number) => void;
  addHistoryStep: (description: string, objects: CanvasObject[]) => void;
  undo: (setObjects: (objs: CanvasObject[]) => void) => void;
  redo: (setObjects: (objs: CanvasObject[]) => void) => void;
};

const HistoryContext = createContext<HistoryContextType | null>(null);

export const HistoryProvider = ({ children }) => {
  const history = useRef<HistoryEntry[]>([]);
  const historyStep = useRef<number>(-1);

  const addHistoryStep = (description: string, objects: CanvasObject[]) => {
    const snapshot = {
      objects: JSON.parse(JSON.stringify(objects)),
      description,
    };
    history.current = history.current.slice(0, historyStep.current + 1);
    history.current.push(snapshot);
    historyStep.current++;
  };

  const goToStep = (step) => {
    historyStep.current = step;
  }

  const undo = (setObjects) => {
    if (historyStep.current <= 0) return;
    historyStep.current--;
    setObjects(history.current[historyStep.current].objects);
  };

  const redo = (setObjects) => {
    if (historyStep.current >= history.current.length - 1) return;
    historyStep.current++;
    setObjects(history.current[historyStep.current].objects);
  };

  return (
    <HistoryContext.Provider value={{ history, historyStep, goToStep, addHistoryStep, undo, redo }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistoryContext = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistoryContext must be used inside HistoryProvider');
  return ctx;
};