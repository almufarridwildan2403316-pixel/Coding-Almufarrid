import { useState, useEffect } from 'react';
import type { ActivePage, LearningProgress, ExperimentRecord, QuizResult } from './types/chemistry';
import { 
  getStoredProgress, 
  saveWorksheetRecord, 
  markSolutionTested, 
  saveQuizResult, 
  resetAllProgress 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Beranda } from './components/Beranda';
import { Materi } from './components/Materi';
import { LabVirtual } from './components/LabVirtual';
import { LembarKerja } from './components/LembarKerja';
import { Evaluasi } from './components/Evaluasi';
import { HasilBelajar } from './components/HasilBelajar';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('S01');
  const [progress, setProgress] = useState<LearningProgress>(getStoredProgress);

  // Synchronize progress on load
  useEffect(() => {
    setProgress(getStoredProgress());
  }, []);

  const handleSaveExperimentRecord = (record: ExperimentRecord) => {
    // 1. Mark solution as tested
    markSolutionTested(record.solutionId);
    // 2. Save worksheet record
    const updated = saveWorksheetRecord(record);
    setProgress(updated);
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    const updated = saveQuizResult(result);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pengujian dan kuis? Progres akan dimulai ulang dari awal.')) {
      const reset = resetAllProgress();
      setProgress(reset);
      alert('Progres belajar telah berhasil diatur ulang.');
    }
  };

  const handleOpenLabWithSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setActivePage('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Sticky Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        progress={progress} 
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
          />
        )}

        {activePage === 'evaluasi' && (
          <Evaluasi 
            onSaveQuizResult={handleSaveQuizResult} 
            savedResult={progress.quizResult} 
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
