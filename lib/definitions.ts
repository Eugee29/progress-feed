export type Job = {
  id: string;
  userId: string;
  progress: number;
  aspectRatio: "1/1" | "3/2" | "2/3";
  createdAt: number;
  status: "pending" | "processing" | "completed" | "failed";
};
