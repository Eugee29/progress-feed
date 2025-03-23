import { Progress } from "@/components/ui/progress";
import { Job } from "@prisma/client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

export default function Card({ job }: { job: Job }) {
  const aspectRatio =
    job.aspectRatio === "SQUARE"
      ? 1
      : job.aspectRatio === "LANDSCAPE"
        ? 3 / 2
        : 2 / 3;

  if (job.status === "PENDING") {
    return (
      <div
        className="bg-accent border-border flex w-full items-center justify-center rounded border p-4 select-none"
        style={{ aspectRatio }}
      >
        <Loader2 className="text-muted-foreground !size-8 animate-spin" />
      </div>
    );
  } else if (job.status === "PROCESSING") {
    return (
      <div
        className="bg-accent border-border flex w-full flex-col justify-center gap-1 rounded border p-4 select-none"
        style={{ aspectRatio }}
      >
        <p className="text-muted-foreground">{job.progress}%</p>
        <Progress value={job.progress} />
      </div>
    );
  } else if (job.status === "COMPLETED") {
    return (
      <div
        className="border-border text-muted-foreground flex w-full flex-col items-center justify-center gap-1 rounded border bg-green-50 p-4 select-none"
        style={{ aspectRatio }}
      >
        <CheckCircle className="!size-8" />
        <p>Completed</p>
      </div>
    );
  } else {
    return (
      <div
        className="border-border text-muted-foreground flex w-full flex-col items-center justify-center gap-1 rounded border bg-red-50 p-4 select-none"
        style={{ aspectRatio }}
      >
        <XCircle className="!size-8" />
        <p>Failed</p>
      </div>
    );
  }
}
