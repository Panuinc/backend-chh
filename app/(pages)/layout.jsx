export default function PagesLayout({ children }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-2">
        {children}
      </div>
    </>
  );
}
