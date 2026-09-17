'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            💥
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">Application Error</h2>
            <p className="text-sm text-slate-400">
              A critical runtime error occurred in the root layout.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-xl text-sm cursor-pointer"
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
