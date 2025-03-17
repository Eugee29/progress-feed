import { createJob } from "../action";

export default function Form() {
  return (
    <form action={createJob}>
      <button type="submit">Submit</button>
    </form>
  );
}
