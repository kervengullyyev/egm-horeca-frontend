"use client";

export default function LastUpdatedDate() {
  return (
    <p className="text-sm text-gray-600">
      Last updated: {new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </p>
  );
}
