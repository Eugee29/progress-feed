import { redis } from "@/lib/redis";
import Feed from "./components/feed";
import Form from "./components/form";
import { Job } from "@/lib/definitions";

const getJobs = async () => {
  const keys = await redis.keys("user1:*");
  const jobs =
    ((await Promise.all(keys.map((key) => redis.json.get(key)))) as Job[]) ||
    [];

  return jobs.sort((a, b) => b.createdAt - a.createdAt);
};

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main>
      <Form />
      <Feed jobs={jobs} />
    </main>
  );
}
