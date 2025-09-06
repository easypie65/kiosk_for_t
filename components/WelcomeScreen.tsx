import React from 'react';
import { Visit } from '../types';
import { QueueDisplay } from './QueueDisplay';

interface WelcomeScreenProps {
  onRegisterClick: () => void;
  pendingQueue: Visit[];
  approvedQueue: Visit[];
  currentlyServing: Visit | null;
  isLoading: boolean;
  error: string | null;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onRegisterClick, 
  pendingQueue, 
  approvedQueue,
  currentlyServing,
  isLoading,
  error
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2">교무실 방문을 환영합니다</h1>
        <p className="text-lg text-slate-600 mb-6">
          선생님을 만나기 전, 키오스크에 방문 목적을 등록해주세요.
        </p>
        <p className="text-red-600 font-semibold mb-8 p-3 bg-red-100 rounded-lg text-left w-full lg:w-auto">
          ※ 교과부장은 키오스크 등록 없이
          <br className="hidden sm:block lg:hidden" />
          &nbsp;학번, 이름 확인 후 바로 들어오세요.
        </p>
        <button
          onClick={onRegisterClick}
          className="w-full lg:w-auto bg-indigo-600 text-white font-bold text-xl py-4 px-10 rounded-xl hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          <i className="fa-solid fa-clipboard-list mr-3"></i>
          방문 접수하기
        </button>
      </div>
      <div className="lg:w-2/5">
        <QueueDisplay 
            pendingQueue={pendingQueue} 
            approvedQueue={approvedQueue} 
            currentlyServing={currentlyServing}
            isLoading={isLoading}
            error={error}
        />
      </div>
    </div>
  );
};
