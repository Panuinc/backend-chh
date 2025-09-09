"use client";
import { useEffect, useState } from "react";

export default function DocsPage() {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then(setDocs);
  }, []);

  if (!docs) return <div className="p-10">Loading docs...</div>;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{docs.info.title}</h1>
      <p className="mb-6 text-gray-700">{docs.info.description}</p>
      <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
      <div className="grid gap-4">
        {Object.entries(docs.paths).map(([path, methods]) => (
          <div key={path} className="bg-white shadow-md rounded-lg p-5">
            <h3 className="font-mono text-lg text-blue-600">{path}</h3>
            <div className="mt-2 grid gap-2">
              {Object.entries(methods).map(([method, detail]) => (
                <div
                  key={method}
                  className="flex items-center justify-between border rounded p-3 bg-gray-50"
                >
                  <span
                    className={`font-bold uppercase px-2 py-1 rounded text-sm ${
                      method === "get"
                        ? "bg-green-200 text-green-800"
                        : method === "post"
                        ? "bg-blue-200 text-blue-800"
                        : method === "put"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {method}
                  </span>
                  <span className="ml-3 text-gray-800">{detail.summary}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
