import Feed from "./components/feed";
import Form from "./components/form";

export default async function Home() {
  return (
    <main className="flex h-screen p-8">
      <Form />
      <Feed />
    </main>
  );
}
