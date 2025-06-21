import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../store/uploadSlice';
import ChartRenderer from '../components/ChartRenderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const UploadPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.upload);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const chartRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary('');
    setData([]);
    setHeaders([]);
    setXAxis('');
    setYAxis('');
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const resultAction = await dispatch(uploadFile(formData));
    if (uploadFile.fulfilled.match(resultAction)) {
      const upload = resultAction.payload;
      setSummary(upload.summary || '');
      setData(upload.data || []);
      if (upload.data && upload.data.length > 0) {
        const keys = Object.keys(upload.data[0]);
        setHeaders(keys);
        setXAxis(keys[0]);
        setYAxis(keys[1] || keys[0]);
      }
    }
  };

  const handleExportPNG = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const handleExportPDF = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('chart.pdf');
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {summary && (
        <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">AI Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {data.length > 0 && (
        <>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block font-semibold mb-1">X Axis:</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Y Axis:</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
                <option value="line">Line</option>
                <option value="scatter">Scatter</option>
                <option value="3d-column">3D Column</option>
              </select>
            </div>
          </div>

          <div ref={chartRef} className="mt-6">
            <ChartRenderer data={data} chartType={chartType} xAxis={xAxis} yAxis={yAxis} />
          </div>

          <div className="mt-4 space-x-4">
            <button
              onClick={handleExportPNG}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Export as PNG
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadPage;
