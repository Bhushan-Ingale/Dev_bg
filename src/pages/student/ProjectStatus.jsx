import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = () => {
  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["#6366f1", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ width: "260px" }}>
      <h3>Project Progress</h3>
      <Doughnut data={data} />
    </div>
  );
};

export default ProgressChart;
