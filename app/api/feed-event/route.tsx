import { redis } from "@/lib/redis";
import { createClient } from "redis";

let subscriber: ReturnType<typeof createClient>;

export async function GET() {
  subscriber = redis.duplicate();
  if (!subscriber.isOpen) await subscriber.connect();

  const stream = new ReadableStream({
    start: async (controller) => {
      await subscriber.pSubscribe("user1:*", (message) => {
        controller.enqueue(encodeSSE(message));
      });
    },

    cancel: () => {
      subscriber.disconnect();
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
