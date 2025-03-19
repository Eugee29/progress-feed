"use server";

import { Job } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { sleep } from "@/lib/utils";
import { v4 as uuid } from "uuid";

export async function createJob() {
  const job: Job = {
    id: uuid(),
    userId: "user1",
    progress: 0,
    aspectRatio: (["SQUARE", "LANDSCAPE", "PORTRAIT"] as const)[
      Math.floor(Math.random() * 3)
    ],
    status: "PENDING",
    createdAt: Date.now(),
  };

  await redis.json.set(`${job.userId}:${job.id}`, "$", job);

  updateJob(job.userId, job.id);

  return job;
}

const updateJob = async (userId: string, jobId: string) => {
  await redis.json.set(`${userId}:${jobId}`, "$.status", "PROCESSING");

  await sleep(3000);

  let progress = 0;

  while (progress < 100) {
    progress += 5;
    if (progress > 100) progress = 100;
    await redis.json.set(`${userId}:${jobId}`, "$.progress", progress);
    const job = (await redis.json.get(`${userId}:${jobId}`)) as Job;
    await redis.publish(`${userId}:${jobId}`, JSON.stringify(job));
    await sleep(1000);
    if (Math.random() < 0.01) break;
  }

  if (progress < 100) {
    await redis.json.set(`${userId}:${jobId}`, "$.status", "FAILED");
  } else {
    await redis.json.set(`${userId}:${jobId}`, "$.status", "COMPLETED");
  }

  const job = (await redis.json.get(`${userId}:${jobId}`)) as Job;
  await redis.publish(`${userId}:${jobId}`, JSON.stringify(job));

  await prisma.job.create({
    data: {
      userId,
      status: job.progress < 100 ? "FAILED" : "COMPLETED",
      aspectRatio: job.aspectRatio,
      createdAt: new Date(job.createdAt),
    },
  });

  await redis.json.del(`${userId}:${jobId}`);
};
