export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-red-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );
}
