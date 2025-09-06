import React from 'react';
import { Visit, VisitStatus } from '../types';

interface QueueDisplayProps {
  pendingQueue: Visit[];
  approvedQueue: Visit[];
  currentlyServing: Visit | null;
  isLoading: boolean;
  error: string | null;
}

const QueueCard: React.FC<{ visit: Visit; status: VisitStatus }> = ({ visit, status }) => {
  const statusColors = {
    [VisitStatus.SERVING]: 'bg-green-100 text-green-800',
    [VisitStatus.APPROVED]: 'bg-indigo-100 text-indigo-800',
    [VisitStatus.PENDING]: 'bg-slate-50 text-slate-800',
    [VisitStatus.DONE]: '',
  };
  
  return (
    <div className={`p-4 rounded-lg transition-all duration-300 ${statusColors[status]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <p className="font-semibold">
              {visit.grade}학년 {visit.classNum ? `${visit.classNum}반 ` : ''}{visit.name}
            </p>
            <p className="text-sm text-slate-500">{visit.teacher}</p>
          </div>
        </div>
        <span className="text-sm text-slate-500 hidden sm:block">{visit.purpose}</span>
      </div>
    </div>
  );
};


export const QueueDisplay: React.FC<QueueDisplayProps> = ({ pendingQueue, approvedQueue, currentlyServing, isLoading, error }) => {
  if (isLoading) {
    return <div className="p-4 text-center">대기열을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 h-full">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 pb-2">
        <i className="fa-solid fa-users mr-2 text-indigo-500"></i>
        실시간 대기 현황
      </h2>
      
      <div className="mb-4">
        <h3 className="font-bold text-lg text-slate-600 mb-2">🟢 현재 호출</h3>
        {currentlyServing ? (
          <QueueCard visit={currentlyServing} status={VisitStatus.SERVING} />
        ) : (
          <div className="p-4 rounded-lg bg-green-50 text-center text-green-700">
            호출 중인 학생이 없습니다.
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-lg text-slate-600 mb-2">🔵 승인 및 대기 ({approvedQueue.length}명)</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {approvedQueue.length > 0 ? (
            approvedQueue.map(visit => <QueueCard key={visit.id} visit={visit} status={VisitStatus.APPROVED}/>)
          ) : (
             <div className="p-4 rounded-lg bg-indigo-50 text-center text-indigo-500">
              -
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg text-slate-600 mb-2">⚪️ 신규 대기 ({pendingQueue.length}명)</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {pendingQueue.length > 0 ? (
            pendingQueue.map(visit => <QueueCard key={visit.id} visit={visit} status={VisitStatus.PENDING}/>)
          ) : (
             <div className="p-4 rounded-lg bg-slate-50 text-center text-slate-500">
              -
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
