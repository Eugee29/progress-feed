"use client";

import { Job } from "@/lib/definitions";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type JobsContextType = {
  jobs: Job[];
  setJobs: Dispatch<SetStateAction<Job[]>>;
};

const JobsContext = createContext<JobsContextType | null>(null);

export function JobsProvider({
  children,
  initialJobs,
}: {
  children: React.ReactNode;
  initialJobs: Job[];
}) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  useEffect(() => {
    const eventSource = new EventSource("/api/feed-event");

    eventSource.onmessage = (event) => {
      const job = JSON.parse(event.data) as Job;
      if (job.progress === 100) {
        setJobs((prev) => prev.filter((j) => job.id !== j.id));
      } else {
        setJobs((prev) => {
          const existingJob = prev.find((j) => j.id === job.id);
          if (existingJob) {
            return prev.map((j) => (j.id === job.id ? job : j));
          } else {
            return [job, ...prev];
          }
        });
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <JobsContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) throw new Error("useJobs must be used within a JobsProvider");
  return context;
}
