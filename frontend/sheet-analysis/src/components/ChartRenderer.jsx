import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import * as THREE from 'three';

const ChartRenderer = ({ data, chartType, xAxis, yAxis }) => {
  const canvasRef = useRef(null);
  const threeRef = useRef(null);
  const [threeScene, setThreeScene] = useState(null);

  useEffect(() => {
    if (!data || !xAxis || !yAxis) return;

    if (chartType === '3d-column') {
      // Render 3D column chart using Three.js
      if (threeScene) {
        // Clear previous scene
        while (threeRef.current.firstChild) {
          threeRef.current.removeChild(threeRef.current.firstChild);
        }
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(600, 400);
      threeRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

      data.forEach((item, index) => {
        const height = item[yAxis] || 1;
        const cube = new THREE.Mesh(geometry, material);
        cube.scale.y = height;
        cube.position.x = index * 2;
        cube.position.y = height / 2;
        scene.add(cube);
      });

      camera.position.z = 10;

      const animate = function () {
        requestAnimationFrame(animate);
        scene.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      setThreeScene(scene);
    } else {
      // Render 2D chart using Chart.js
      if (threeRef.current) {
        threeRef.current.innerHTML = '';
      }
      const ctx = canvasRef.current.getContext('2d');
      const labels = data.map((item) => item[xAxis]);
      const values = data.map((item) => item[yAxis]);

      const config = {
        type: chartType === 'bar' ? 'bar' : chartType === 'line' ? 'line' : chartType === 'pie' ? 'pie' : 'scatter',
        data: {
          labels,
          datasets: [
            {
              label: yAxis,
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: chartType !== 'pie' ? {
            x: { title: { display: true, text: xAxis } },
            y: { title: { display: true, text: yAxis } },
          } : {},
        },
      };

      const chartInstance = new Chart(ctx, config);

      return () => {
        chartInstance.destroy();
      };
    }
  }, [data, chartType, xAxis, yAxis]);

  return (
    <div>
      {chartType === '3d-column' ? (
        <div ref={threeRef} />
      ) : (
        <canvas ref={canvasRef} width={600} height={400} />
      )}
    </div>
  );
};

export default ChartRenderer;
