import { useState, useCallback } from 'react';
import { Visit, NewVisit, VisitStatus } from '../types';

export const useQueue = () => {
  const [queue, setQueue] = useState<Visit[]>([]);
  const [currentlyServing, setCurrentlyServing] = useState<Visit | null>(null);
  const [lastId, setLastId] = useState<number>(0);

  const addVisit = useCallback((visitData: NewVisit): Visit => {
    const newId = lastId + 1;
    // FIX: Add missing 'status' property required by the 'Visit' type.
    const newVisit: Visit = {
      ...visitData,
      // FIX: The 'id' property of a Visit must be a string.
      id: newId.toString(),
      // FIX: The 'timestamp' property of a Visit must be a number (from getTime()).
      timestamp: new Date().getTime(),
      status: VisitStatus.PENDING,
    };
    setLastId(newId);

    // 모든 학생을 항상 대기열에 추가합니다.
    setQueue(prevQueue => [...prevQueue, newVisit]);

    return newVisit;
  }, [lastId]);

  const processNextInQueue = useCallback(() => {
    setQueue(prevQueue => {
      if (prevQueue.length > 0) {
        const [next, ...rest] = prevQueue;
        setCurrentlyServing(next);
        return rest;
      } else {
        // 대기열이 비어있으면, 현재 호출된 학생도 없도록 처리합니다.
        setCurrentlyServing(null);
        return [];
      }
    });
  }, []);

  return { queue, currentlyServing, addVisit, processNextInQueue };
};
