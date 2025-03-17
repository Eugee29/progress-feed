"use client";

import { Job } from "@/lib/definitions";
import { useEffect, useState } from "react";

export default function Feed({ jobs: initialJobs }: { jobs: Job[] }) {
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
    <div>
      {jobs.map((job) => (
        <div key={job.id}>{job.progress}</div>
      ))}
    </div>
  );
}
