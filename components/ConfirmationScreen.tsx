import React from 'react';
import { Visit } from '../types';

interface ConfirmationScreenProps {
  visit: Visit | null;
  onReturnHome: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ visit, onReturnHome }) => {
  if (!visit) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">오류가 발생했습니다.</h2>
        <p className="text-slate-600 mb-6">정보를 찾을 수 없습니다. 다시 시도해주세요.</p>
        <button
          onClick={onReturnHome}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-2xl mx-auto">
        <div className="text-green-500 mb-4">
            <i className="fa-solid fa-circle-check fa-5x"></i>
        </div>
      <h2 className="text-4xl font-extrabold text-slate-800 mb-4">접수가 완료되었습니다!</h2>
      <p className="text-lg text-slate-600 mb-8">
        대기 현황판을 확인하고, 호출 시 교무실로 들어오세요.
      </p>

      <div className="bg-slate-100 rounded-lg p-6 mb-8 text-left">
        <p className="text-slate-500 mb-1">대기번호</p>
        <p className="text-5xl font-bold text-indigo-600 mb-4">#{visit.id}</p>
        <p className="text-slate-500 mb-1">학생 정보</p>
        <p className="font-semibold text-xl text-slate-800">
            {visit.grade}학년 {visit.classNum ? `${visit.classNum}반 ` : ''}{visit.name}
        </p>
      </div>

      <button
        onClick={onReturnHome}
        className="w-full bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-indigo-700 transition-colors"
      >
        확인
      </button>
    </div>
  );
};
