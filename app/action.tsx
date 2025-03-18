"use server";

import { Job } from "@/lib/definitions";
import { redis } from "@/lib/redis";
import { sleep } from "@/lib/utils";
import { v4 as uuid } from "uuid";

export async function createJob() {
  const job: Job = {
    id: uuid(),
    userId: "user1",
    progress: 0,
    aspectRatio: (["1/1", "3/2", "2/3"] as const)[
      Math.floor(Math.random() * 3)
    ],
    status: "pending",
    createdAt: Date.now(),
  };

  await redis.json.set(`${job.userId}:${job.id}`, "$", job);

  updateJob(job.userId, job.id);

  return job;
}

const updateJob = async (userId: string, jobId: string) => {
  let progress = 0;

  await redis.json.set(`${userId}:${jobId}`, "$.status", "processing");

  await sleep(3000);

  while (progress <= 100) {
    await redis.json.set(`${userId}:${jobId}`, "$.progress", progress);
    const job = (await redis.json.get(`${userId}:${jobId}`)) as Job;
    await redis.publish(`${userId}:${jobId}`, JSON.stringify(job));
    progress += 1;
    await sleep(Math.floor(Math.random() * 2000) + 1000); // 1-3 seconds
  }

  await redis.json.set(`${userId}:${jobId}`, "$.status", "completed");
  await redis.json.del(`${userId}:${jobId}`);
};
