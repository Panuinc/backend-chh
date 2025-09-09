export default function DocsLayout({ children }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full p-2 gap-2 border-2 border-dark">
        {children}
      </div>
    </>
  );
}
