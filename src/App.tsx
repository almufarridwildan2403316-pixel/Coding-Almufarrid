import { useState } from 'react';
import type { ActivePage, LearningProgress, ExperimentRecord, QuizResult, QuizSubmission, StudentIdentity } from './types/chemistry';
import { 
  clearActiveStudent,
  getActiveStudent,
  getStoredProgress, 
  saveWorksheetRecord, 
  saveWorksheetConclusion,
  markSolutionTested, 
  saveQuizResult, 
  saveActiveStudent,
  updateQuizSubmission,
  resetAllProgress 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Beranda } from './components/Beranda';
import { Materi } from './components/Materi';
import { LabVirtual } from './components/LabVirtual';
import { LembarKerja } from './components/LembarKerja';
import { Evaluasi } from './components/Evaluasi';
import { TeacherDashboard } from './components/TeacherDashboard';
import { HasilBelajar } from './components/HasilBelajar';
import { Login } from './components/Login';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('S01');
  const [student, setStudent] = useState<StudentIdentity | null>(getActiveStudent);
  const [progress, setProgress] = useState<LearningProgress>(() => {
    const activeStudent = getActiveStudent();
    return activeStudent ? getStoredProgress(activeStudent) : {
      student: null,
      testedSolutions: [],
      worksheetRecords: {},
      worksheetConclusion: null,
      quizResult: null,
      quizSubmissions: [],
      readMaterials: [],
    };
  });

  const handleLogin = (identity: StudentIdentity) => {
    saveActiveStudent(identity);
    setStudent(identity);
    setProgress(getStoredProgress(identity));
    setActivePage('beranda');
  };

  const handleLogout = () => {
    clearActiveStudent();
    setStudent(null);
    setActivePage('beranda');
  };

  const handleSaveExperimentRecord = (record: ExperimentRecord) => {
    if (!student) return;
    if (record.sampleType !== 'mystery') {
      markSolutionTested(record.solutionId, student);
    }
    const updated = saveWorksheetRecord({ ...record, studentName: student.name, studentClass: student.className }, student);
    setProgress(updated);
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    if (!student) return;
    const updated = saveQuizResult({ ...result, studentName: student.name, studentClass: student.className }, student);
    setProgress(updated);
  };

  const handleSaveWorksheetConclusion = (text: string) => {
    if (!student) return;
    const updated = saveWorksheetConclusion({
      text,
      studentName: student.name,
      studentClass: student.className,
      submittedAt: new Date().toISOString(),
    }, student);
    setProgress(updated);
  };

  const handleSaveTeacherReview = (submissionId: string, updates: Partial<QuizSubmission>) => {
    if (!student) return;
    const updated = updateQuizSubmission(submissionId, updates, student);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    if (!student) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pengujian dan kuis? Progres akan dimulai ulang dari awal.')) {
      const reset = resetAllProgress(student);
      setProgress(reset);
      alert('Progres belajar telah berhasil diatur ulang.');
    }
  };

  const handleOpenLabWithSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setActivePage('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!student) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Sticky Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        progress={progress} 
        student={student}
        onLogout={handleLogout}
      />

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {activePage === 'beranda' && (
          <Beranda 
            setActivePage={setActivePage} 
            progress={progress} 
            onSelectSample={handleOpenLabWithSample} 
          />
        )}

        {activePage === 'materi' && (
          <Materi 
            onStartLab={() => {
              setActivePage('lab');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {activePage === 'lab' && (
          <LabVirtual 
            initialSampleId={selectedSampleId} 
            progress={progress} 
            onSaveRecord={handleSaveExperimentRecord} 
            onOpenWorksheet={() => {
              setActivePage('lembar-kerja');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {activePage === 'lembar-kerja' && (
          <LembarKerja 
            progress={progress} 
            setActivePage={setActivePage} 
            onOpenLabSample={handleOpenLabWithSample} 
            onSaveConclusion={handleSaveWorksheetConclusion}
          />
        )}

        {activePage === 'evaluasi' && (
          <Evaluasi 
            onSaveQuizResult={handleSaveQuizResult} 
            savedResult={progress.quizResult} 
            student={student}
          />
        )}

        {activePage === 'guru' && (
          <TeacherDashboard
            progress={progress}
            onSaveReview={handleSaveTeacherReview}
          />
        )}

        {activePage === 'hasil' && (
          <HasilBelajar 
            progress={progress} 
            setActivePage={setActivePage} 
            onResetProgress={handleResetProgress} 
          />
        )}
      </main>

      {/* Modern Footer */}
      <Footer 
        setActivePage={setActivePage} 
        onResetProgress={handleResetProgress} 
      />
    </div>
  );
}

export default App;
