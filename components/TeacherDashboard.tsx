import React from 'react';
import { useFirebaseQueue } from '../hooks/useQueueFirebase';
import { Visit, VisitStatus } from '../types';

const TeacherVisitCard: React.FC<{
  visit: Visit;
  onUpdate: (id: string, status: VisitStatus) => void;
  onComplete: (id: string) => void;
  isCallDisabled?: boolean;
}> = ({ visit, onUpdate, onComplete, isCallDisabled }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${visit.status === VisitStatus.SERVING ? 'border-green-400 border-2' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-slate-800">
             {visit.grade}학년 {visit.classNum ? `${visit.classNum}반 ` : ''}{visit.name}
          </p>
          <p className="text-sm text-slate-500">{visit.teacher}</p>
          <p className="text-sm text-indigo-600 mt-1">{visit.purpose}</p>
        </div>
        <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-2">
          {visit.status === VisitStatus.PENDING && (
            <>
              <button
                onClick={() => onUpdate(visit.id, VisitStatus.APPROVED)}
                className="bg-blue-500 text-white w-20 text-center px-3 py-1 text-sm font-semibold rounded-md hover:bg-blue-600 transition-colors"
              >
                승인
              </button>
              <button
                onClick={() => onComplete(visit.id)}
                className="bg-slate-400 text-white w-20 text-center px-3 py-1 text-sm font-semibold rounded-md hover:bg-slate-500 transition-colors"
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
                className="bg-green-500 text-white w-20 text-center px-3 py-1 text-sm font-semibold rounded-md hover:bg-green-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                호출
              </button>
               <button
                onClick={() => onComplete(visit.id)}
                className="bg-slate-400 text-white w-20 text-center px-3 py-1 text-sm font-semibold rounded-md hover:bg-slate-500 transition-colors"
              >
                삭제
              </button>
            </>
          )}
          {visit.status === VisitStatus.SERVING && (
            <button
              onClick={() => onComplete(visit.id)}
              className="bg-red-500 text-white w-20 text-center px-3 py-1 text-sm font-semibold rounded-md hover:bg-red-600 transition-colors"
            >
              완료
            </button>
          )}
        </div>
      </div>
      {visit.status === VisitStatus.SERVING && (
        <div className="mt-2 pt-2 border-t border-slate-200 text-right">
          <span className="text-green-600 font-bold text-sm animate-pulse">
            <i className="fa-solid fa-volume-high mr-2"></i>
            학생 호출 중...
          </span>
        </div>
      )}
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
  
  // Sort approved queue by timestamp ASC (oldest first) to create a proper waiting line.
  const nextInQueue = [...approvedQueue].sort((a, b) => a.timestamp - b.timestamp);
  
  const isCallDisabled = !!currentlyServing;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800">교무실 방문 관리</h1>
          <p className="text-slate-500 mt-1">실시간으로 학생들의 방문 요청을 확인하고 관리합니다.</p>
        </header>

        {isLoading && <p className="text-center text-lg">데이터를 불러오는 중입니다...</p>}
        {error && <p className="text-center text-lg text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {!isLoading && !error && (
          <>
            {/* Currently Serving Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-700 mb-4 pb-2 border-b-2 border-green-400">
                <i className="fa-solid fa-bell mr-2 text-green-500"></i>
                현재 호출 중
              </h2>
              <div className="p-2 bg-green-50 rounded-lg min-h-[120px] flex items-center justify-center">
                {currentlyServing ? (
                  <div className="w-full max-w-lg">
                    <TeacherVisitCard 
                      key={currentlyServing.id} 
                      visit={currentlyServing} 
                      onUpdate={updateVisitStatus} 
                      onComplete={completeVisit}
                    />
                  </div>
                ) : (
                  <p className="text-center text-slate-500 p-4">호출 중인 학생이 없습니다.</p>
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Column */}
              <section>
                <h2 className="text-2xl font-bold text-slate-700 mb-4 pb-2 border-b-2 border-yellow-400">
                  <i className="fa-solid fa-user-plus mr-2 text-yellow-500"></i>
                  승인 대기 ({pendingQueue.length})
                </h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2 bg-slate-100 rounded-lg">
                  {pendingQueue.length > 0 ? (
                    pendingQueue.map(v => 
                      <TeacherVisitCard 
                        key={v.id} 
                        visit={v} 
                        onUpdate={updateVisitStatus}
                        onComplete={completeVisit} 
                      />)
                  ) : (
                    <p className="text-center text-slate-500 p-4">신규 접수한 학생이 없습니다.</p>
                  )}
                </div>
              </section>

              {/* Approved (Next in Queue) Column */}
              <section>
                <h2 className="text-2xl font-bold text-slate-700 mb-4 pb-2 border-b-2 border-indigo-400">
                  <i className="fa-solid fa-user-check mr-2 text-indigo-500"></i>
                  다음 대기열 ({nextInQueue.length})
                </h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2 bg-slate-100 rounded-lg">
                  {nextInQueue.length > 0 ? (
                    nextInQueue.map(v => 
                      <TeacherVisitCard 
                        key={v.id} 
                        visit={v} 
                        onUpdate={updateVisitStatus} 
                        onComplete={completeVisit}
                        isCallDisabled={isCallDisabled}
                      />)
                  ) : (
                    <p className="text-center text-slate-500 p-4">대기 중인 학생이 없습니다.</p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
