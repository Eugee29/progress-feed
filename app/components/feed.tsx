"use client";

import { useJobs } from "../contexts/jobs-provider";
import { useMemo } from "react";
import Card from "./card";
import { Job } from "@prisma/client";

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
            <Card key={job.id} job={job} />
          ))}
        </div>
      ))}
    </div>
  );
}
