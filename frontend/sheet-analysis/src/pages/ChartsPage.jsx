import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ChartRenderer from '../components/ChartRenderer';

const ChartsPage = () => {
  const uploads = useSelector((state) => state.upload.uploads);
  const [selectedUploadId, setSelectedUploadId] = useState('');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  const selectedUpload = uploads.find((u) => u._id === selectedUploadId);
  const data = selectedUpload ? selectedUpload.data : [];

  // Get headers from data keys
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Charts</h1>
      <div className="mb-4">
        <label className="block mb-1">Select Upload:</label>
        <select
          value={selectedUploadId}
          onChange={(e) => {
            setSelectedUploadId(e.target.value);
            setXAxis('');
            setYAxis('');
          }}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">-- Select a file --</option>
          {uploads.map((upload) => (
            <option key={upload._id} value={upload._id}>
              {upload.filename}
            </option>
          ))}
        </select>
      </div>
      {selectedUpload && (
        <>
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">X Axis:</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">-- Select X Axis --</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Y Axis:</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">-- Select Y Axis --</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
                <option value="line">Line</option>
                <option value="scatter">Scatter</option>
                <option value="3d-column">3D Column</option>
              </select>
            </div>
          </div>
          {xAxis && yAxis && (
            <ChartRenderer data={data} chartType={chartType} xAxis={xAxis} yAxis={yAxis} />
          )}
        </>
      )}
    </div>
  );
};

export default ChartsPage;
