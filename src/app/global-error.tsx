"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-white">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <h2 className="mb-4 text-4xl font-bold text-red-500">Something went wrong!</h2>
          <p className="mb-8 text-gray-400">
            We apologize for the inconvenience. Please try again.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
