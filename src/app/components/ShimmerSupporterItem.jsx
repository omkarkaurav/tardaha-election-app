export default function ShimmerSupporterItem() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="shimmer-effect h-12 w-12 rounded-full flex-shrink-0"></div>
      <div className="flex-grow space-y-2">
        <div className="shimmer-effect h-5 w-1/2 rounded"></div>
        <div className="shimmer-effect h-4 w-1/4 rounded"></div>
      </div>
    </div>
  );
}