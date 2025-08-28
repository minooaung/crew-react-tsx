import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  ChartData,
  ChartOptions,
  TooltipItem,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

interface UserRoleData {
  superAdminCount?: number;
  adminCount: number;
  employeeCount: number;
}

interface UserRoleChartProps {
  data?: UserRoleData;
}

const defaultData: UserRoleData = {
  superAdminCount: 0,
  adminCount: 0,
  employeeCount: 0,
};

const UserRoleChart: React.FC<UserRoleChartProps> = ({
  data = defaultData,
}) => {
  // Memoize chart data to prevent unnecessary recalculations
  const chartData: ChartData<"doughnut"> = useMemo(() => {
    const isAspNet = import.meta.env.VITE_BACKEND_FRAMEWORK === "ASP.NET";

    return {
      labels: isAspNet
        ? ["Super Admins", "Admins", "Employees"]
        : ["Admins", "Employees"],
      datasets: [
        {
          data: isAspNet
            ? [data.superAdminCount || 0, data.adminCount, data.employeeCount]
            : [data.adminCount, data.employeeCount],
          backgroundColor: isAspNet
            ? [
                "rgba(220, 38, 38, 0.8)", // Red for Super Admins
                "rgba(147, 51, 234, 0.8)", // Purple for Admins
                "rgba(59, 130, 246, 0.8)", // Blue for Employees
              ]
            : [
                "rgba(147, 51, 234, 0.8)", // Purple for Admins
                "rgba(59, 130, 246, 0.8)", // Blue for Employees
              ],
          borderColor: isAspNet
            ? [
                "rgba(220, 38, 38, 1)",
                "rgba(147, 51, 234, 1)",
                "rgba(59, 130, 246, 1)",
              ]
            : ["rgba(147, 51, 234, 1)", "rgba(59, 130, 246, 1)"],
          borderWidth: 1,
        },
      ],
    };
  }, [data.superAdminCount, data.adminCount, data.employeeCount]);

  // Memoize options to prevent unnecessary recreations
  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"doughnut">) => {
              const label = context.label || "";
              const value = (context.raw as number) || 0;
              const total = (context.dataset.data as number[]).reduce(
                (a, b) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        User Role Distribution
      </h3>
      <div className="h-[300px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default React.memo(UserRoleChart);
