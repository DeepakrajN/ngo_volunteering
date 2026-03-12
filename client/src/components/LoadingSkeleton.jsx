import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
    <div className="h-6 bg-neutral-200 rounded mb-4"></div>
    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
  </div>
);

export const VolunteerCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm animate-pulse overflow-hidden border border-neutral-200">
    <div className="bg-neutral-200 h-24"></div>
    <div className="p-6 -mt-12">
      <div className="w-20 h-20 bg-neutral-300 rounded-full mx-auto mb-4"></div>
      <div className="h-4 bg-neutral-200 rounded mb-2"></div>
      <div className="h-3 bg-neutral-200 rounded w-2/3 mx-auto"></div>
    </div>
  </div>
);

export const EventCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200 animate-pulse">
    <div className="h-48 bg-neutral-200"></div>
    <div className="p-6">
      <div className="h-6 bg-neutral-200 rounded mb-4"></div>
      <div className="h-4 bg-neutral-200 rounded mb-2"></div>
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-neutral-200 rounded"></div>
    </div>
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

export default { CardSkeleton, VolunteerCardSkeleton, EventCardSkeleton, LoadingSpinner };
