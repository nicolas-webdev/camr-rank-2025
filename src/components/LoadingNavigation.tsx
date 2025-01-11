export function LoadingNavigation() {
  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <div className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="flex-1 max-w-lg ml-6">
              <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 