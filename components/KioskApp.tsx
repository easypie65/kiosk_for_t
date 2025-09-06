import React, { useState, useCallback } from 'react';
import { Page, Visit, NewVisit } from '../types';
import { WelcomeScreen } from './WelcomeScreen';
import { RegistrationForm } from './RegistrationForm';
import { StatusScreen } from './StatusScreen';
import { AIAssistant } from './AIAssistant';
import { useFirebaseQueue } from '../hooks/useQueueFirebase';

export const KioskApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.WELCOME);
  const [activeVisitId, setActiveVisitId] = useState<string | null>(null);
  const { pendingQueue, approvedQueue, currentlyServing, addVisit, isLoading, error } = useFirebaseQueue();

  const handleRegisterClick = () => {
    setCurrentPage(Page.FORM);
  };

  const handleRegistrationComplete = async (visit: NewVisit) => {
    const newVisitId = await addVisit(visit);
    if (newVisitId) {
      setActiveVisitId(newVisitId);
      setCurrentPage(Page.STATUS);
    } else {
       // Optionally, show an error message to the user
       alert("접수에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleReturnToHome = () => {
    setActiveVisitId(null);
    setCurrentPage(Page.WELCOME);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.FORM:
        return (
          <RegistrationForm
            onComplete={handleRegistrationComplete}
            onCancel={handleReturnToHome}
          />
        );
      case Page.STATUS:
        return (
          <StatusScreen
            visitId={activeVisitId}
            onReturnHome={handleReturnToHome}
          />
        );
      case Page.WELCOME:
      default:
        return (
          <WelcomeScreen
            onRegisterClick={handleRegisterClick}
            pendingQueue={pendingQueue}
            approvedQueue={approvedQueue}
            currentlyServing={currentlyServing}
            isLoading={isLoading}
            error={error}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="w-full max-w-5xl mx-auto">
        {renderPage()}
      </div>
      <AIAssistant />
    </div>
  );
};
