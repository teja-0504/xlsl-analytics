import React from 'react';
import { useSelector } from 'react-redux';

const AIInsightsPage = () => {
  const uploads = useSelector((state) => state.upload.uploads);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Insights</h1>
      {uploads.length === 0 && <p>No uploads available to show insights.</p>}
      {uploads.map((upload) => (
        <div key={upload._id} className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">{upload.filename}</h2>
          <p>{upload.summary || 'No AI summary available.'}</p>
        </div>
      ))}
    </div>
  );
};

export default AIInsightsPage;
