import React from 'react';

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow8"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow8 absolute top-0 left-0 opacity-75" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
    </div>
  );
}
