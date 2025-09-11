import React from 'react';
import { useFirebaseQueue } from '../hooks/useQueueFirebase';
import { Visit, VisitStatus } from '../types';

const VisitRow: React.FC<{
  visit: Visit;
  onUpdate: (id: string, status: VisitStatus) => void;
  onComplete: (id: string) => void;
  isCallDisabled: boolean;
}> = ({ visit, onUpdate, onComplete, isCallDisabled }) => {
  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case VisitStatus.PENDING:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">승인 대기</span>;
      case VisitStatus.APPROVED:
        return <span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">승인됨</span>;
      case VisitStatus.SERVING:
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full animate-pulse">호출 중</span>;
      default:
        return null;
    }
  };

  const rowClass = visit.status === VisitStatus.SERVING ? 'bg-green-50' : 'bg-white';
  const buttonBaseClass = "w-20 text-center px-3 py-1 text-sm font-semibold rounded-md transition-colors";

  return (
    <tr className={`${rowClass} border-b border-slate-200`}>
      <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
        {new Date(visit.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">
        {visit.grade}학년 {visit.classNum ? `${visit.classNum}반 ` : ''}{visit.name}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{visit.purpose}</td>
      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{visit.teacher}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        {getStatusBadge(visit.status)}
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-2">
          {visit.status === VisitStatus.PENDING && (
            <>
              <button
                onClick={() => onUpdate(visit.id, VisitStatus.APPROVED)}
                className={`${buttonBaseClass} bg-blue-500 text-white hover:bg-blue-600`}
              >
                승인
              </button>
              <button
                onClick={() => onComplete(visit.id)}
                className={`${buttonBaseClass} bg-slate-400 text-white hover:bg-slate-500`}
              >
                삭제
              </button>
            </>
          )}
          {visit.status === VisitStatus.APPROVED && (
            <>
             <button
                onClick={() => onUpdate(visit.id, VisitStatus.SERVING)}
                disabled={isCallDisabled}
                className={`${buttonBaseClass} bg-green-500 text-white hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed`}
              >
                호출
              </button>
               <button
                onClick={() => onComplete(visit.id)}
                className={`${buttonBaseClass} bg-slate-400 text-white hover:bg-slate-500`}
              >
                삭제
              </button>
            </>
          )}
          {visit.status === VisitStatus.SERVING && (
            <button
              onClick={() => onComplete(visit.id)}
              className={`${buttonBaseClass} bg-red-500 text-white hover:bg-red-600`}
            >
              완료
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};


export const TeacherDashboard: React.FC = () => {
  const { 
    visits,
    currentlyServing,
    isLoading, 
    error,
    updateVisitStatus,
    completeVisit
  } = useFirebaseQueue();
  
  const sortedVisits = [...visits].sort((a, b) => a.timestamp - b.timestamp);
  
  const isCallDisabled = !!currentlyServing;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800">교무실 방문 관리 대시보드</h1>
          <p className="text-slate-500 mt-1">학생들의 방문 요청을 실시간으로 확인하고 관리합니다.</p>
        </header>

        {isLoading && <p className="text-center text-lg">데이터를 불러오는 중입니다...</p>}
        {error && <p className="text-center text-lg text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {!isLoading && !error && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
                            <tr>
                                <th scope="col" className="px-4 py-3">시간</th>
                                <th scope="col" className="px-4 py-3">학생 정보</th>
                                <th scope="col" className="px-4 py-3">방문 목적</th>
                                <th scope="col" className="px-4 py-3">담당 교사</th>
                                <th scope="col" className="px-4 py-3">상태</th>
                                <th scope="col" className="px-4 py-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedVisits.length > 0 ? (
                                sortedVisits.map(visit => (
                                    <VisitRow 
                                        key={visit.id}
                                        visit={visit}
                                        onUpdate={updateVisitStatus}
                                        onComplete={completeVisit}
                                        isCallDisabled={isCallDisabled}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-500">
                                        현재 대기 중인 학생이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
