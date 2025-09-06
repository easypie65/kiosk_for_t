import { useState, useEffect, useCallback } from 'react';
import { Visit, NewVisit, VisitStatus } from '../types';
import firebase, { visitsRef } from '../services/firebase';

export const useFirebaseQueue = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = visitsRef.orderByChild('timestamp');

    const handleValueChange = (snapshot: firebase.database.DataSnapshot) => {
      try {
        const data = snapshot.val();
        const loadedVisits: Visit[] = [];
        if (data) {
          Object.keys(data).forEach(key => {
            if (data[key].status !== VisitStatus.DONE) {
               loadedVisits.push({ id: key, ...data[key] });
            }
          });
        }
        setVisits(loadedVisits.reverse()); // Show newest first
      } catch (e) {
        console.error("Failed to parse visits data:", e);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleError = (err: Error) => {
      console.error(err);
      if (err.message.includes('permission_denied') || err.message.includes('Missing or insufficient permissions') || err.message.includes('service_account_auth_failed')) {
          setError("데이터베이스 연결 실패. Firebase 설정을 확인해주세요.");
      } else {
          setError("데이터베이스 연결에 실패했습니다.");
      }
      setIsLoading(false);
    }
    
    query.on('value', handleValueChange, handleError);

    return () => query.off('value', handleValueChange);
  }, []);
  
  const addVisit = useCallback(async (visitData: NewVisit): Promise<string | null> => {
    try {
      const newVisitRef = await visitsRef.push({
        ...visitData,
        status: VisitStatus.PENDING,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });
      return newVisitRef.key;
    } catch (e) {
      console.error("Error adding visit:", e);
      setError("접수 중 오류가 발생했습니다.");
      return null;
    }
  }, []);

  const updateVisitStatus = useCallback(async (id: string, status: VisitStatus) => {
    try {
      const updates = { [`/${id}/status`]: status };
      await visitsRef.update(updates);
    } catch (e) {
      console.error(`Error updating visit ${id} to ${status}:`, e);
      setError("상태 업데이트 중 오류가 발생했습니다.");
    }
  }, []);
  
  const completeVisit = useCallback(async (id: string) => {
    await updateVisitStatus(id, VisitStatus.DONE);
  }, [updateVisitStatus]);

  const pendingQueue = visits.filter(v => v.status === VisitStatus.PENDING);
  const approvedQueue = visits.filter(v => v.status === VisitStatus.APPROVED);
  const currentlyServing = visits.find(v => v.status === VisitStatus.SERVING) || null;

  return { 
    visits, 
    pendingQueue,
    approvedQueue,
    currentlyServing,
    isLoading, 
    error,
    addVisit, 
    updateVisitStatus,
    completeVisit
  };
};