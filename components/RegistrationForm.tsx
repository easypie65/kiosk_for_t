import React, { useState } from 'react';
import { NewVisit } from '../types';
import { VISIT_PURPOSES, TEACHERS } from '../constants';

interface RegistrationFormProps {
  onComplete: (visit: NewVisit) => void;
  onCancel: () => void;
}

const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
    </div>
);


export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NewVisit>({
    purpose: '',
    grade: '',
    classNum: '',
    name: '',
    teacher: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (field: keyof NewVisit, value: string) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'grade' && value !== '3') {
          newState.classNum = '';
      }
      return newState;
    });
  };
  
  const isStep1Valid = formData.purpose !== '';
  const isStep2Valid = !!(formData.grade && formData.name && (formData.grade !== '3' || formData.classNum));
  const isStep3Valid = formData.teacher !== '';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep3Valid && !isSubmitting) {
      setIsSubmitting(true);
      await onComplete(formData);
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800">방문 목적을 선택해주세요</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {VISIT_PURPOSES.map(purpose => (
                <button
                  key={purpose}
                  type="button"
                  onClick={() => { handleSelectChange('purpose', purpose); handleNext(); }}
                  className="p-6 text-lg font-semibold rounded-lg text-center transition-all duration-200 shadow-sm border-2 border-transparent bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300"
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">학생 정보를 입력해주세요</h2>
            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-2">학년</p>
                <div className="grid grid-cols-3 gap-3">
                  {['1', '2', '3'].map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleSelectChange('grade', grade)}
                      className={`p-4 text-lg font-bold rounded-lg transition-colors border-2 ${formData.grade === grade ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-50 hover:bg-indigo-100 hover:border-indigo-300'}`}
                    >
                      {grade}학년
                    </button>
                  ))}
                </div>
              </div>

              {formData.grade === '3' && (
                <div>
                  <p className="text-lg font-semibold text-slate-700 mb-2">반</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['1', '2', '3', '4', '5', '6'].map(classNum => (
                      <button
                        key={classNum}
                        type="button"
                        onClick={() => handleSelectChange('classNum', classNum)}
                        className={`p-4 text-lg font-bold rounded-lg transition-colors border-2 ${formData.classNum === classNum ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-50 hover:bg-indigo-100 hover:border-indigo-300'}`}
                      >
                        {classNum}반
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.grade && (
                <div>
                   <p className="text-lg font-semibold text-slate-700 mb-2">이름</p>
                  <input 
                      type="text" 
                      name="name" 
                      placeholder="이름 (예: 홍길동)" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="w-full p-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
            <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800">담당 선생님을 선택해주세요</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
              {TEACHERS.map(teacher => (
                <button
                  key={teacher.id}
                  type="button"
                  onClick={() => handleSelectChange('teacher', teacher.name)}
                  className={`p-4 text-center rounded-lg transition-all duration-200 shadow-sm border-2 ${formData.teacher === teacher.name ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300'}`}
                >
                  <p className="font-bold text-lg">{teacher.name}</p>
                  <p className="text-sm">{teacher.subject}</p>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
     <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
        <ProgressBar step={step} totalSteps={3} />
        <form onSubmit={handleSubmit}>
            <div className="min-h-[420px] flex items-center justify-center">
             {renderStep()}
            </div>
            <div className="flex justify-between items-center mt-8">
                <div>
                    {step > 1 && (
                    <button type="button" onClick={handleBack} className="py-3 px-6 text-lg font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                        이전
                    </button>
                    )}
                </div>
                <div>
                    {step === 1 && (
                        <button type="button" onClick={onCancel} className="py-3 px-6 text-lg font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                            취소
                        </button>
                    )}
                    {step === 2 && (
                    <button type="button" onClick={handleNext} disabled={!isStep2Valid} className="py-3 px-8 text-lg font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                        다음
                    </button>
                    )}
                    {step === 3 && (
                    <button type="submit" disabled={!isStep3Valid || isSubmitting} className="py-3 px-8 text-lg font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                        {isSubmitting ? '접수중...' : '접수 완료'}
                    </button>
                    )}
                </div>
            </div>
        </form>
    </div>
  );
};
