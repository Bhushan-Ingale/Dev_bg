import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const ProgressChart = () => {
  const data = {
    labels: ["HTML", "CSS", "JS", "React"],
    datasets: [
      {
        label: "Progress %",
        data: [80, 70, 65, 50],
        backgroundColor: "#a78bfa",
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="card">
      <h3>Learning Progress</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProgressChart;
