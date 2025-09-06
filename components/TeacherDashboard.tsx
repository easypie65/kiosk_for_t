import React from 'react';
import { useFirebaseQueue } from '../hooks/useQueueFirebase';
import { Visit, VisitStatus } from '../types';

const TeacherVisitCard: React.FC<{
  visit: Visit;
  onUpdate: (id: string, status: VisitStatus) => void;
  onComplete: (id: string) => void;
}> = ({ visit, onUpdate, onComplete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-slate-800">
             {visit.grade}학년 {visit.classNum ? `${visit.classNum}반 ` : ''}{visit.name}
          </p>
          <p className="text-sm text-slate-500">{visit.teacher}</p>
          <p className="text-sm text-indigo-600 mt-1">{visit.purpose}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {visit.status === VisitStatus.PENDING && (
            <button
              onClick={() => onUpdate(visit.id, VisitStatus.APPROVED)}
              className="bg-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-md hover:bg-blue-600 transition-colors"
            >
              승인
            </button>
          )}
          {visit.status === VisitStatus.APPROVED && (
             <button
              onClick={() => onUpdate(visit.id, VisitStatus.SERVING)}
              className="bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-md hover:bg-green-600 transition-colors"
            >
              호출
            </button>
          )}
          {visit.status === VisitStatus.SERVING && (
              <span className="text-green-600 font-bold text-sm">처리중...</span>
          )}
          <button
             onClick={() => onComplete(visit.id)}
             className="bg-slate-500 text-white px-3 py-1 text-sm font-semibold rounded-md hover:bg-slate-600 transition-colors"
            >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export const TeacherDashboard: React.FC = () => {
  const { 
    pendingQueue, 
    approvedQueue,
    currentlyServing,
    isLoading, 
    error,
    updateVisitStatus,
    completeVisit
  } = useFirebaseQueue();

  const approvedAndServing = [...(currentlyServing ? [currentlyServing] : []), ...approvedQueue];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800">교무실 방문 관리</h1>
          <p className="text-slate-500 mt-1">실시간으로 학생들의 방문 요청을 확인하고 관리합니다.</p>
        </header>

        {isLoading && <p>데이터를 불러오는 중입니다...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pending Column */}
          <section>
            <h2 className="text-2xl font-bold text-slate-700 mb-4 pb-2 border-b-2">
              승인 대기 ({pendingQueue.length})
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto p-2 bg-slate-100 rounded-lg">
              {pendingQueue.length > 0 ? (
                pendingQueue.map(v => 
                  <TeacherVisitCard 
                    key={v.id} 
                    visit={v} 
                    onUpdate={updateVisitStatus}
                    onComplete={completeVisit} 
                  />)
              ) : (
                <p className="text-center text-slate-500 p-4">대기 중인 학생이 없습니다.</p>
              )}
            </div>
          </section>

          {/* Approved & Serving Column */}
          <section>
            <h2 className="text-2xl font-bold text-slate-700 mb-4 pb-2 border-b-2">
              승인 완료 및 호출 ({approvedAndServing.length})
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto p-2 bg-slate-100 rounded-lg">
              {approvedAndServing.length > 0 ? (
                approvedAndServing.map(v => 
                  <TeacherVisitCard 
                    key={v.id} 
                    visit={v} 
                    onUpdate={updateVisitStatus} 
                    onComplete={completeVisit}
                  />)
              ) : (
                <p className="text-center text-slate-500 p-4">승인된 학생이 없습니다.</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};