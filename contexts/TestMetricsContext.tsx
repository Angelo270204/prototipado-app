/**
 * Test Metrics Context
 * Contexto para rastrear métricas de interacción durante el test
 * - Tiempo en tarea
 * - Número de clicks/toques
 * - Errores cometidos
 * - Uso de ayuda
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface TaskMetrics {
  taskName: string;
  startTime: number;
  endTime?: number;
  clicks: number;
  errors: number;
  helpRequests: number;
  completed: boolean;
}

interface TestSession {
  sessionId: string;
  participantProfile: 'designer' | 'client' | 'operator' | 'production';
  startTime: number;
  endTime?: number;
  tasks: TaskMetrics[];
  susScore?: number;
  susAnswers?: number[];
  qualitativeFeedback?: {
    easiest: string;
    hardest: string;
    changeRequest: string;
    comments: string[];
  };
}

interface TestMetricsContextType {
  // Session management
  currentSession: TestSession | null;
  startSession: (profile: TestSession['participantProfile']) => void;
  endSession: () => void;

  // Task tracking
  currentTask: TaskMetrics | null;
  startTask: (taskName: string) => void;
  endTask: (completed: boolean) => void;

  // Metrics recording
  recordClick: () => void;
  recordError: (errorType?: string) => void;
  recordHelpRequest: () => void;

  // SUS Survey
  recordSUSResults: (score: number, answers: number[]) => void;
  recordQualitativeFeedback: (feedback: TestSession['qualitativeFeedback']) => void;

  // Reporting
  getSessionReport: () => TestSession | null;
  getAllMetrics: () => {
    totalTime: number;
    totalClicks: number;
    totalErrors: number;
    helpUsagePercent: number;
    taskCompletionRate: number;
    averageTaskTime: number;
  };

  // Test mode toggle
  isTestMode: boolean;
  setTestMode: (enabled: boolean) => void;
}

const TestMetricsContext = createContext<TestMetricsContextType | null>(null);

export function TestMetricsProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskMetrics | null>(null);
  const [isTestMode, setTestMode] = useState(false);

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };

  const startSession = useCallback((profile: TestSession['participantProfile']) => {
    const newSession: TestSession = {
      sessionId: generateSessionId(),
      participantProfile: profile,
      startTime: Date.now(),
      tasks: [],
    };
    setCurrentSession(newSession);
    setTestMode(true);
  }, []);

  const endSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        endTime: Date.now(),
      });
    }
  }, [currentSession]);

  const startTask = useCallback((taskName: string) => {
    const newTask: TaskMetrics = {
      taskName,
      startTime: Date.now(),
      clicks: 0,
      errors: 0,
      helpRequests: 0,
      completed: false,
    };
    setCurrentTask(newTask);
  }, []);

  const endTask = useCallback((completed: boolean) => {
    if (currentTask && currentSession) {
      const finishedTask: TaskMetrics = {
        ...currentTask,
        endTime: Date.now(),
        completed,
      };
      setCurrentSession({
        ...currentSession,
        tasks: [...currentSession.tasks, finishedTask],
      });
      setCurrentTask(null);
    }
  }, [currentTask, currentSession]);

  const recordClick = useCallback(() => {
    if (currentTask && isTestMode) {
      setCurrentTask({
        ...currentTask,
        clicks: currentTask.clicks + 1,
      });
    }
  }, [currentTask, isTestMode]);

  const recordError = useCallback(() => {
    if (currentTask && isTestMode) {
      setCurrentTask({
        ...currentTask,
        errors: currentTask.errors + 1,
      });
    }
  }, [currentTask, isTestMode]);

  const recordHelpRequest = useCallback(() => {
    if (currentTask && isTestMode) {
      setCurrentTask({
        ...currentTask,
        helpRequests: currentTask.helpRequests + 1,
      });
    }
  }, [currentTask, isTestMode]);

  const recordSUSResults = useCallback((score: number, answers: number[]) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        susScore: score,
        susAnswers: answers,
      });
    }
  }, [currentSession]);

  const recordQualitativeFeedback = useCallback((feedback: TestSession['qualitativeFeedback']) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        qualitativeFeedback: feedback,
      });
    }
  }, [currentSession]);

  const getSessionReport = useCallback(() => {
    return currentSession;
  }, [currentSession]);

  const getAllMetrics = useCallback(() => {
    if (!currentSession) {
      return {
        totalTime: 0,
        totalClicks: 0,
        totalErrors: 0,
        helpUsagePercent: 0,
        taskCompletionRate: 0,
        averageTaskTime: 0,
      };
    }

    const tasks = currentSession.tasks;
    const totalTime = tasks.reduce((acc, task) => {
      if (task.endTime) {
        return acc + (task.endTime - task.startTime);
      }
      return acc;
    }, 0);

    const totalClicks = tasks.reduce((acc, task) => acc + task.clicks, 0);
    const totalErrors = tasks.reduce((acc, task) => acc + task.errors, 0);
    const totalHelpRequests = tasks.reduce((acc, task) => acc + task.helpRequests, 0);
    const completedTasks = tasks.filter((task) => task.completed).length;

    return {
      totalTime: totalTime / 1000, // in seconds
      totalClicks,
      totalErrors,
      helpUsagePercent: tasks.length > 0 ? (totalHelpRequests / tasks.length) * 100 : 0,
      taskCompletionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
      averageTaskTime: tasks.length > 0 ? totalTime / 1000 / tasks.length : 0,
    };
  }, [currentSession]);

  return (
    <TestMetricsContext.Provider
      value={{
        currentSession,
        startSession,
        endSession,
        currentTask,
        startTask,
        endTask,
        recordClick,
        recordError,
        recordHelpRequest,
        recordSUSResults,
        recordQualitativeFeedback,
        getSessionReport,
        getAllMetrics,
        isTestMode,
        setTestMode,
      }}
    >
      {children}
    </TestMetricsContext.Provider>
  );
}

export function useTestMetrics() {
  const context = useContext(TestMetricsContext);
  if (!context) {
    throw new Error('useTestMetrics must be used within a TestMetricsProvider');
  }
  return context;
}

export default TestMetricsContext;
