export type Job = {
  id: string;
  userId: string;
  progress: number;
  aspectRatio: "SQUARE" | "LANDSCAPE" | "PORTRAIT";
  createdAt: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
};
