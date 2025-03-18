"use client";

import { FormEvent, useState } from "react";
import { createJob } from "../action";
import { useJobs } from "../contexts/jobs-provider";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";

export default function Form() {
  const { setJobs } = useJobs();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const job = await createJob();
      setJobs((prev) => [job, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border w-80 rounded border p-4"
    >
      <Button type="submit" disabled={loading} className="w-full select-none">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <PlusIcon className="size-4" />
            Create Job
          </>
        )}
      </Button>
    </form>
  );
}
