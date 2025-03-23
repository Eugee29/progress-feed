import prisma from "@/lib/prisma";

export async function GET() {
  let interval: NodeJS.Timeout;

  const stream = new ReadableStream({
    start: async (controller) => {
      interval = setInterval(async () => {
        const jobs = await prisma.job.findMany({
          where: {
            userId: "user1",
          },
        });

        for (const job of jobs) {
          controller.enqueue(encodeSSE(JSON.stringify(job)));
        }
      }, 1000);
    },

    cancel: () => {
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
}

function encodeSSE(data: string | number): Uint8Array {
  return new TextEncoder().encode(`data: ${data}\n\n`);
}
