"use server";

import { Job } from "@/lib/definitions";
import { redis } from "@/lib/redis";
import { sleep } from "@/lib/utils";
import { v4 as uuid } from "uuid";

export async function createJob() {
  const job = {
    id: uuid(),
    userId: "user1",
    progress: 0,
    createdAt: Date.now(),
  };

  await redis.json.set(`${job.userId}:${job.id}`, "$", job);

  updateJob(job.userId, job.id);
}

const updateJob = async (userId: string, jobId: string) => {
  let progress = 0;

  while (progress <= 100) {
    await redis.json.set(`${userId}:${jobId}`, "$.progress", progress);
    const job = (await redis.json.get(`${userId}:${jobId}`)) as Job;
    await redis.publish(`${userId}:${jobId}`, JSON.stringify(job));
    progress += 10;
    await sleep(2000);
  }

  await redis.json.del(`${userId}:${jobId}`);
};
