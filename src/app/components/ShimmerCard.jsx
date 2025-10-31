export default function ShimmerCard() {
  return (
    <div className="bg-white rounded-[12px] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.1)] border-t-4 border-t-gray-200 space-y-4">
      <div className="shimmer-effect mx-auto h-14 w-14 rounded-full"></div>
      <div className="shimmer-effect h-7 w-3/4 mx-auto rounded"></div>
      <div className="shimmer-effect h-5 w-full mx-auto rounded"></div>
      <div className="space-y-3 pt-4">
        <div className="shimmer-effect h-6 w-full rounded"></div>
        <div className="shimmer-effect h-6 w-full rounded"></div>
        <div className="shimmer-effect h-6 w-5/6 rounded"></div>
      </div>
      <div className="shimmer-effect h-12 w-full mt-4 rounded-lg"></div>
    </div>
  );
}