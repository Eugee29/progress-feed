"use client";

import { Job } from "@/lib/definitions";
import { useJobs } from "../contexts/jobs-provider";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Feed() {
  const { jobs } = useJobs();

  const jobsColumns = useMemo(() => {
    const numberOfColumns = 5;
    const columns: Job[][] = Array.from({ length: numberOfColumns }, () => []);
    let currentColumn = 0;
    for (const job of jobs) {
      columns[currentColumn].push(job);
      currentColumn = (currentColumn + 1) % numberOfColumns;
    }
    return columns;
  }, [jobs]);

  return (
    <div className="flex h-full flex-1 gap-2 overflow-y-auto px-2">
      {jobsColumns.map((column, index) => (
        <div key={index} className="flex flex-1 flex-col gap-2">
          {column.map((job) => (
            <div
              key={job.id}
              className="bg-accent border-border flex w-full items-center justify-center rounded border p-8 select-none"
              style={{
                aspectRatio: job.aspectRatio,
              }}
            >
              {job.status === "pending" ? (
                <Loader2 className="text-muted-foreground !size-8 animate-spin" />
              ) : (
                <div className="flex w-full flex-col gap-2">
                  <p className="text-muted-foreground">{job.progress}%</p>
                  <Progress value={job.progress} />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
