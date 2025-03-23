"use server";

import prisma from "@/lib/prisma";
import { sleep } from "@/lib/utils";

export async function createJob() {
  const job = await prisma.job.create({
    data: {
      userId: "user1",
      aspectRatio: (["SQUARE", "LANDSCAPE", "PORTRAIT"] as const)[
        Math.floor(Math.random() * 3)
      ],
    },
  });

  updateJob(job.id);

  return job;
}

const updateJob = async (jobId: string) => {
  await sleep(3000);

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "PROCESSING" },
  });

  let progress = 0;

  while (progress < 100) {
    progress += Math.floor(Math.random() * 9 + 1);
    if (progress > 100) progress = 100;

    await prisma.job.update({
      where: { id: jobId },
      data: { progress },
    });

    await sleep(Math.floor(Math.random() * 2000 + 500));

    if (Math.random() < 0.01) break;
  }

  if (progress < 100) {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "FAILED" },
    });
  } else {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "COMPLETED" },
    });
  }
};
