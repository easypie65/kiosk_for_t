import React from 'react';
import { KioskApp } from './components/KioskApp';
import { TeacherDashboard } from './components/TeacherDashboard';

const App: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  if (mode === 'teacher') {
    return <TeacherDashboard />;
  }

  return <KioskApp />;
};

export default App;
