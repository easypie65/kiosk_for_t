import React, { useState, useEffect } from 'react';
import { Visit, VisitStatus } from '../types';
import firebase, { visitsRef } from '../services/firebase';

interface StatusScreenProps {
  visitId: string | null;
  onReturnHome: () => void;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({ visitId, onReturnHome }) => {
  const [visit, setVisit] = useState<Visit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visitId) {
        setError("잘못된 접근입니다.");
        return;
    }

    const visitRef = visitsRef.child(visitId);
    
    const handleValueChange = (snapshot: firebase.database.DataSnapshot) => {
        if (snapshot.exists()) {
            setVisit({ id: snapshot.key, ...snapshot.val() });
        } else {
            setVisit(null);
            setError("접수 내역이 삭제되었거나 완료되었습니다.");
        }
    };

    visitRef.on('value', handleValueChange);

    return () => visitRef.off('value', handleValueChange);
  }, [visitId]);

  const getStatusContent = () => {
    if (!visit) {
        return {
            icon: <i className="fa-solid fa-circle-question fa-5x text-slate-400"></i>,
            title: "상태를 확인할 수 없음",
            message: error || "접수 정보를 찾을 수 없습니다."
        };
    }

    switch (visit.status) {
      case VisitStatus.PENDING:
        return {
          icon: <i className="fa-solid fa-hourglass-half fa-5x text-yellow-500 animate-spin" style={{ animationDuration: '3s' }}></i>,
          title: "선생님 확인 중...",
          message: "잠시만 기다려주세요. 선생님께서 곧 확인하실 거예요."
        };
      case VisitStatus.APPROVED:
        return {
          icon: <i className="fa-solid fa-circle-check fa-5x text-green-500"></i>,
          title: "승인되었습니다!",
          message: "대기 현황판을 확인하고, 호출 시 교무실로 들어오세요."
        };
      case VisitStatus.SERVING:
         return {
          icon: <i className="fa-solid fa-person-running fa-5x text-indigo-500"></i>,
          title: "지금 들어오세요!",
          message: "선생님께서 호출하셨습니다. 교무실로 들어와주세요."
        };
      default:
         return {
            icon: <i className="fa-solid fa-xmark-circle fa-5x text-red-500"></i>,
            title: "알 수 없는 상태",
            message: "오류가 발생했습니다. 다시 접수해주세요."
        };
    }
  };
  
  const { icon, title, message } = getStatusContent();

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-2xl mx-auto">
        <div className="mb-4">
            {icon}
        </div>
      <h2 className="text-4xl font-extrabold text-slate-800 mb-4">{title}</h2>
      <p className="text-lg text-slate-600 mb-8 min-h-[56px]">
        {message}
      </p>

    {visit && (
      <div className="bg-slate-100 rounded-lg p-6 mb-8 text-left">
        <p className="text-slate-500 mb-1">학생 정보</p>
        <p className="font-semibold text-xl text-slate-800">
            {visit.grade}학년 {visit.classNum ? `${visit.classNum}반 ` : ''}{visit.name}
        </p>
      </div>
    )}

      <button
        onClick={onReturnHome}
        className="w-full bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-indigo-700 transition-colors"
      >
        확인
      </button>
    </div>
  );
};