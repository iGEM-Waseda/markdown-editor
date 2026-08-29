import MarkdownEditor from "./editor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between px-7 py-24 text-black">
      <MarkdownEditor /> 
    </main>
  );
}
