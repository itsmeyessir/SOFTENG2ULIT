import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IconType } from "react-icons/lib";
import { useProductionData } from "../../hooks/useProductionData";
import { useLogistics } from "../../hooks/useLogistics";
import { useTracking } from "../../hooks/useTracking";
import { useWorkOrders } from "../../hooks/useWorkOrder";
import "./Dashboard.css";
import Header from "../components/Header";
import { FaBox, FaTruck, FaUser, FaClipboardList } from "react-icons/fa";
import LineChartComponent from "../test page/test";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { AssignmentTurnedIn } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useReports } from "../../hooks/useReports";
import { SvgIconComponent } from "@mui/icons-material";
import { Home as HomeIcon } from "@mui/icons-material";

const GenerateReport = () => {
  const { productionData } = useProductionData();
  const { requests: logisticsData } = useLogistics();
  const { trackingLogs: trackingData } = useTracking();
  const { generateReport, loading, error } = useReports();

  const handleGenerateReport = async () => {
    await generateReport(productionData, logisticsData, trackingData);
  };

  return (
    <div>
      <button
        className="generate-button"
        onClick={handleGenerateReport}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Report"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

// ✅ Small dashboard cards
interface UnifiedCardProps {
  type: "rate" | "progress" | "summary";
  title: string;
  icon?: React.ReactNode; // Icon Component
  currentValue: number;
  maxValue?: number; // Required for "progress" type
  oldValue?: number; // Required for "rate" type
  description?: string;
}
// ✅ Small dashboard cards
const UnifiedCard: React.FC<UnifiedCardProps> = ({
  type,
  title,
  currentValue,
  maxValue = 100,
  oldValue = 0,
  description = "",
}) => {
  // ✅ Calculate percentage change (for "rate" type)
  const difference = currentValue - oldValue;
  const isPositive = difference >= 0;
  const percentageChange = oldValue
    ? ((difference / Math.abs(oldValue)) * 100).toFixed(2)
    : "0.00";

  // ✅ Select the correct icon & color dynamically
  const IconComponent = isPositive ? TrendingUp : TrendingDown;
  const iconColor = isPositive ? "green" : "red";

  return (
    <Card
      sx={{
        boxShadow: "0px 10px 20px 0px rgba(133, 133, 133, 0.1)",
        borderRadius: 5,
        paddingLeft: 2,
        paddingRight: 2,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        {/* Title & Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Allow title to take the remaining space and align it to the right */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#09194f",
              textAlign: "left", // Aligns text to the right
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Rate Indicator */}
        {type === "rate" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "top",
              justifyContent: "space-between",
            }}
          >
            {/* Current Value */}
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: 500, fontSize: "3rem", textAlign: "baseline" }}
            >
              {currentValue}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
            {/* Icon and Chip (Stacked) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // Stack items vertically
                alignItems: "center",
                // Center items horizontally
              }}
            >
              <IconComponent sx={{ fontSize: "3rem", color: iconColor }} />
              <Chip
                label={`${percentageChange}%`}
                sx={{ backgroundColor: iconColor, color: "white", mt: 0.5 }} // Adds spacing between icon and chip
              />
            </Box>
          </Box>
        )}

        {/* Text for "summary" type */}
        {type === "summary" && description && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: 500, fontSize: "3rem", textAlign: "baseline" }}
            >
              {currentValue}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Progress Bar for "progress" type */}
      {type === "progress" && (
        <Box
          sx={{
            alignItems: "top",
            justifyContent: "space-between",
            marginLeft: 2,
            marginRight: 2,
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontWeight: 500, fontSize: "3rem", textAlign: "top" }}
          >
            {currentValue}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentValue / maxValue) * 100}
          />
        </Box>
      )}
    </Card>
  );
};

// ✅ Tracking stuff
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];
const trackingData = [
  {
    requestId: "67a0cd1c7d91f9034db6609a",
    module: "CAM-001",
    requestedBy: "Alice",
    recipient: "Factory A",
    status: "Pending",
    requestDate: "2023-10-01",
    completionDate: null,
    quantity: 100,
  },
  {
    requestId: "67a0de107d91f9034db6609d",
    module: "SPK-001",
    requestedBy: "Bob",
    recipient: "Factory B",
    status: "Completed",
    requestDate: "2023-10-02",
    completionDate: "2023-10-05",
    quantity: 50,
  },
  {
    requestId: "67a43839827bcb4539f0163a",
    module: "HOS-001",
    requestedBy: "Charlie",
    recipient: "Factory C",
    status: "In Transit",
    requestDate: "2023-10-03",
    completionDate: null,
    quantity: 200,
  },
  {
    requestId: "67a441fd827bcb4539f0163d",
    module: "SCR-1",
    requestedBy: "David",
    recipient: "Factory D",
    status: "Pending",
    requestDate: "2023-10-04",
    completionDate: null,
    quantity: 150,
  },
  {
    requestId: "67a441fd827bcb4539f0163e",
    module: "BTN-001",
    requestedBy: "Eve",
    recipient: "Factory E",
    status: "Completed",
    requestDate: "2023-10-05",
    completionDate: "2023-10-07",
    quantity: 75,
  },
  {
    requestId: "67a441fd827bcb4539f0163f",
    module: "CHP-001",
    requestedBy: "Frank",
    recipient: "Factory F",
    status: "Pending",
    requestDate: "2023-10-06",
    completionDate: null,
    quantity: 120,
  },
  {
    requestId: "67a441fd827bcb4539f0163g",
    module: "STG-001",
    requestedBy: "Grace",
    recipient: "Factory G",
    status: "In Transit",
    requestDate: "2023-10-07",
    completionDate: null,
    quantity: 90,
  },
  {
    requestId: "67a441fd827bcb4539f0163h",
    module: "CAM-001",
    requestedBy: "Hannah",
    recipient: "Factory A",
    status: "Completed",
    requestDate: "2023-10-08",
    completionDate: "2023-10-10",
    quantity: 110,
  },
  {
    requestId: "67a441fd827bcb4539f0163i",
    module: "SPK-001",
    requestedBy: "Ian",
    recipient: "Factory B",
    status: "Pending",
    requestDate: "2023-10-09",
    completionDate: null,
    quantity: 60,
  },
  {
    requestId: "67a441fd827bcb4539f0163j",
    module: "HOS-001",
    requestedBy: "Jack",
    recipient: "Factory C",
    status: "Completed",
    requestDate: "2023-10-10",
    completionDate: "2023-10-12",
    quantity: 210,
  },
];

const TrackingTest: React.FC = () => {
  const statusCounts = trackingData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moduleCounts = trackingData.reduce((acc, item) => {
    acc[item.module] = (acc[item.module] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const recipientCounts = trackingData.reduce((acc, item) => {
    acc[item.recipient] = (acc[item.recipient] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const requestTrends = trackingData.reduce((acc, item) => {
    acc[item.requestDate] = (acc[item.requestDate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));
  const moduleData = Object.keys(moduleCounts).map((key) => ({
    name: key,
    value: moduleCounts[key],
  }));
  const recipientData = Object.keys(recipientCounts).map((key) => ({
    name: key,
    value: recipientCounts[key],
  }));
  const trendData = Object.keys(requestTrends).map((key) => ({
    date: key,
    requests: requestTrends[key],
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Request Status Breakdown</Typography>
          <PieChart width={400} height={300}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Top Requested Modules</Typography>
          <BarChart width={500} height={300} data={moduleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Request Trends Over Time</Typography>
          <LineChart width={500} height={300} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />f
            <Line type="monotone" dataKey="requests" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>
    </Box>
  );
};

// ✅ Logistics stuff
const dataLogistics = [
  {
    moduleCode: "CAM-001",
    variety: "Camera Module",
    requestedBy: "Alice",
    recipient: "Factory A",
    dateProduced: "2023-10-01",
    quantity: 100,
    status: "Pending",
  },
  {
    moduleCode: "SPK-001",
    variety: "Speaker Module",
    requestedBy: "Bob",
    recipient: "Factory B",
    dateProduced: "2023-10-02",
    quantity: 50,
    status: "Completed",
  },
  {
    moduleCode: "HOS-001",
    variety: "Housing Module",
    requestedBy: "Charlie",
    recipient: "Factory C",
    dateProduced: "2023-10-03",
    quantity: 200,
    status: "In Transit",
  },
  {
    moduleCode: "SCR-1",
    variety: "Screen Module",
    requestedBy: "David",
    recipient: "Factory D",
    dateProduced: "2023-10-04",
    quantity: 150,
    status: "Pending",
  },
  {
    moduleCode: "BTN-001",
    variety: "Button Module",
    requestedBy: "Eve",
    recipient: "Factory E",
    dateProduced: "2023-10-05",
    quantity: 75,
    status: "Completed",
  },
  {
    moduleCode: "CHP-001",
    variety: "Chip Module",
    requestedBy: "Frank",
    recipient: "Factory F",
    dateProduced: "2023-10-06",
    quantity: 120,
    status: "Pending",
  },
  {
    moduleCode: "STG-001",
    variety: "Storage Module",
    requestedBy: "Grace",
    recipient: "Factory G",
    dateProduced: "2023-10-07",
    quantity: 90,
    status: "In Transit",
  },
];

// ✅ Barchart
const fetchBarChartData = (
  apiUri: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
  useEffect(() => {
    fetch(apiUri)
      .then((res) => res.json())
      .then((data) => setState(data))
      .catch((err) => console.error("Error fetching bar chart data:", err));
  }, [apiUri]);
};

// ✅ Barchart
const CustomBarChart: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [barChartData, setBarChartData] = useState<
    { name: string; value: number }[]
  >([]);

  fetchBarChartData(apiUri, setBarChartData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barChartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#a10a2f" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ✅ Piechart
const piechartCOLORS = [
  "#FFB3B3",
  "#FF9999",
  "#FF7F7F",
  "#FF6666",
  "#FF4D4D",
  "#E67373",
  "#D65C5C",
];
// ✅ Piechart
const PieChartComponent: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("Error fetching pie chart data:", err));
  }, [apiUrl]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={piechartCOLORS[index % piechartCOLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ✅ Gaugechart
const fetchGaugeChartData = (
  apiUri: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
  useEffect(() => {
    fetch(apiUri)
      .then((res) => res.json())
      .then((data) => setState(data))
      .catch((err) => console.error("Error fetching gauge chart data:", err));
  }, [apiUri]);
};

// ✅ Gaugechart
const GaugeChart: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [gaugeData, setGaugeData] = useState<{ name: string; value: number }[]>(
    []
  );

  fetchGaugeChartData(apiUri, setGaugeData);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="100%"
        barSize={20}
        data={gaugeData}
      >
        <RadialBar background dataKey="value" fill="#FF4D4D" />
        <Tooltip />
        <Legend />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// ✅ Module linechart
const ModuleLineChart = ({ apiUri }: { apiUri: string }) => {
  const [data, setData] = useState([]);
  const [view, setView] = useState("daily");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUri}?view=${view}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching line chart data:", error);
      }
    };

    fetchData();
  }, [apiUri, view]); // Fetch data when URI or view changes

  return (
    <div>
      {/* Toggle View Buttons */}
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(event, newView) => newView && setView(newView)}
        aria-label="view toggle"
      >
        <ToggleButton value="daily">Daily</ToggleButton>
        <ToggleButton value="weekly">Weekly</ToggleButton>
        <ToggleButton value="monthly">Monthly</ToggleButton>
      </ToggleButtonGroup>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF4D4D"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ Production Stackedbarchart
const StackedBarChart: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [chartData, setChartData] = useState<
    { workOrderId: string; producedQty: number; orderedQty: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUri);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching stacked bar chart data:", error);
      }
    };
    fetchData();
  }, [apiUri]);

  return (
    <ResponsiveContainer width={700} height={400}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="workOrderId"
          label={{
            value: "Work Order ID",
            position: "insideBottom",
            offset: -5,
          }}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orderedQty" stackId="a" fill="#42a5f5" />
        <Bar dataKey="producedQty" stackId="a" fill="#66bb6a" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ✅ Production Barchart late fulfillment
const LateWorkOrdersChart: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [lateWorkOrders, setLateWorkOrders] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUri);
        const data = await response.json();
        setLateWorkOrders(data.lateWorkOrders);
      } catch (error) {
        console.error("Error fetching late work orders data:", error);
      }
    };
    fetchData();
  }, [apiUri]);

  const chartData = [{ name: "Late Work Orders", count: lateWorkOrders }];

  return (
    <BarChart width={500} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#ff7300" />
    </BarChart>
  );
};

// Line Chart
const requestTrendsData = dataLogistics.reduce((acc, item) => {
  acc[item.dateProduced] = (acc[item.dateProduced] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
const lineChartData = Object.keys(requestTrendsData).map((key) => ({
  date: key,
  requests: requestTrendsData[key],
}));

const ModuleLine: React.FC = () => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="requests" stroke="#ff9800" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface Reminder {
  date: string;
  title: string;
}

interface SummaryItem {
  icon: SvgIconComponent;
  value: number;
  label: string;
  iconBgColor?: string;
  iconColor?: string;
}

const Heatmap = () => {
  const { productionData, loading, error } = useProductionData();
  const { workOrders } = useWorkOrders();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (productionData.length === 0) return <p>No production data available.</p>;

  // Merge productionData with workOrders to include phoneModel
  const mergedData = productionData.map((item) => {
    const workOrder = workOrders.find(
      (order) => order._id === item.workOrderID
    );
    return {
      ...item,
      phoneModel: workOrder?.module || "Unknown Model",
    };
  });

  // Calculate max value for normalization
  const maxProduced = Math.max(
    ...mergedData.map((item) => item.producedQty),
    1
  );

  return (
    <div className="heatmap">
      {[...mergedData] // Create a copy to avoid modifying the original array
        .reverse() // Reverse the order so the latest push is first
        .map((item) => {
          const intensity = (item.producedQty / maxProduced) * 500; // Keeps colors soft and balanced
          return (
            <div
              key={item.workOrderID}
              className="heatmap-cell"
              style={{
                backgroundColor: `rgb(${280 - intensity / 5}, ${
                  90 - intensity / 5
                }, ${130 - intensity / 3})`,
                // Soft Red → Coral → Light Pink
              }}
            >
              <span className="product-name">{item.phoneModel}</span>
              <span className="product-quantity">{item.producedQty}</span>
            </div>
          );
        })}
    </div>
  );
};

const createSummaryItem = (
  value: number,
  label: string,
  Icon: SvgIconComponent,
  iconBgColor: string = "#f0f0f0",
  iconColor: string = "#333"
): SummaryItem => ({
  icon: Icon,
  value,
  label,
  iconBgColor,
  iconColor,
});

const totalUnitsProducedItem = createSummaryItem(
  1000, // Example value
  "Total Units Produced",
  HomeIcon // MUI icon
);

const anotherItem = createSummaryItem(
  500, // Another value
  "Another Metric",
  HomeIcon, // Another MUI icon
  "#e0e0e0", // Custom background color
  "#555" // Custom icon color
);

// ✅ Production Barchart
const fetchProdBarChartData = (
  apiUri: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetch(apiUri)
      .then((res) => res.json())
      .then((data) => setState(data))
      .catch((err) => console.error("Error fetching bar chart data:", err));
  }, [apiUri]);
};

// ✅ Production Barchart component
const BarChartComponent: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [barData, setBarData] = useState<{ name: string; value: number }[]>([]);

  fetchProdBarChartData(apiUri, setBarData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#c10300" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ✅ Production Histogram
const fetchHistogramData = (
  apiUri: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
  useEffect(() => {
    fetch(apiUri)
      .then((res) => res.json())
      .then((data) => setState(data))
      .catch((err) => console.error("Error fetching histogram data:", err));
  }, [apiUri]);
};

// ✅ Production Histogram component
const Histogram: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [histogramData, setHistogramData] = useState<
    { range: string; count: number }[]
  >([]);

  fetchHistogramData(apiUri, setHistogramData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={histogramData}>
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="count"
          fill="#d8847c

"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const Dashboard: React.FC = () => {
  const {
    productionData,
    loading: productionLoading,
    error: productionError,
  } = useProductionData();

  const {
    workOrders,
    loading: workOrdersLoading,
    error: workOrdersError,
  } = useWorkOrders();

  const {
    requests,
    loading: logisticsLoading,
    error: logisticsError,
  } = useLogistics();

  const {
    trackingLogs,
    loading: trackingLoading,
    error: trackingError,
  } = useTracking();

  const [value, setValue] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [view, setView] = useState("all");

  const addReminder = () => {
    const formattedDate = value.toISOString().split("T")[0];
    if (reminderTitle.trim() === "") {
      alert("Reminder title cannot be empty.");
      return;
    }

    setReminders([...reminders, { date: formattedDate, title: reminderTitle }]);
    setReminderTitle("");
    setShowReminderInput(false);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const reminderForDate = reminders.find(
        (reminder) => reminder.date === formattedDate
      );
      if (reminderForDate) {
        return (
          <span
            style={{ color: "blue", fontWeight: "bold", fontSize: "0.9rem" }}
          >
            ●
          </span>
        );
      }
    }
    return null;
  };

  const handleDayHover = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const reminderForDate = reminders.find(
      (reminder) => reminder.date === formattedDate
    );
    return reminderForDate ? reminderForDate.title : null;
  };

  if (
    productionLoading ||
    workOrdersLoading ||
    logisticsLoading ||
    trackingLoading
  )
    return <div className="loading">Loading...</div>;
  if (productionError || workOrdersError || logisticsError || trackingError)
    return <div className="error">Error loading data.</div>;

  // Calculate dynamic values
  const totalActiveWorkOrders = workOrders.length;
  const completedWorkOrders = workOrders.filter(
    (order) => order.status === "Completed"
  ).length;
  const pendingModuleRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;
  const shipmentsInTransit = trackingLogs.filter(
    (log) => log.status === "In Transit"
  ).length;

  {
    /*db.production.updateMany(
   {}, 
   { $rename: { "quantityProduced": "producedQty" } }
)*/
  }

  // Calculate production view values
  const productionRate =
    productionData.reduce((acc, item) => acc + item.producedQty, 0) /
      productionData.length || 0;
  const lateFulfillments = productionData.filter(
    (item) => !item.orderOnTime
  ).length;
  const totalUnitsProduced = productionData.reduce(
    (acc, item) => acc + item.producedQty,
    0
  );
  const fulfillmentEfficiency =
    (productionData.filter((item) => item.orderFulfilled).length /
      productionData.length) *
      100 || 0;

  const softCoolColors = [
    "#D64550", // Soft Crimson
    "#E57373", // Light Coral
    "#F28E8E", // Warm Pastel Red
    "#F8B6B6", // Pale Blush Red
    "#FDDCDC", // Very Soft Pink
  ];

  return (
    <div className="main-div">
      <Header />

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, newView) => setView(newView)}
        aria-label="Dashboard View"
        sx={{
          display: "flex",
          justifyContent: "flex-start", // Aligns buttons to the left
          alignItems: "center", // Centers vertically
          backgroundColor: "#fff",
          borderRadius: "30px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          padding: "7px",
          paddingLeft: "12px",
          gap: "7px",
          width: "100%",
        }}
      >
        <ToggleButton
          value="all"
          aria-label="All"
          sx={{
            color: "#444",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            borderRadius: "17px!important",
            backgroundColor: "#f8f9fa",
            fontSize: "0.8rem",
            padding: "6px 14px",
            minWidth: "auto",
            height: "32px",
            overflow: "hidden",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#e2e6ea",
            },
            "&.Mui-selected, &.Mui-focusVisible": {
              backgroundColor: "#ad0232",
              color: "white",
              boxShadow: "0px 2px 8px rgba(212, 126, 126, 0.4)",
            },
          }}
        >
          All
        </ToggleButton>
        <ToggleButton
          value="production"
          aria-label="Production"
          sx={{
            color: "#444",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            borderRadius: "17px!important",
            backgroundColor: "#f8f9fa",
            fontSize: "0.8rem",
            padding: "6px 14px",
            minWidth: "auto",
            height: "32px",
            overflow: "hidden",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#e2e6ea",
            },
            "&.Mui-selected, &.Mui-focusVisible": {
              backgroundColor: "#ad0232",
              color: "white",
              boxShadow: "0px 2px 8px rgba(212, 126, 126, 0.4)",
            },
          }}
        >
          Production
        </ToggleButton>
        <ToggleButton
          value="logistics"
          aria-label="Requests"
          sx={{
            color: "#444",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            borderRadius: "17px!important",
            backgroundColor: "#f8f9fa",
            fontSize: "0.8rem",
            padding: "6px 14px",
            minWidth: "auto",
            height: "32px",
            overflow: "hidden",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#e2e6ea",
            },
            "&.Mui-selected, &.Mui-focusVisible": {
              backgroundColor: "#ad0232",
              color: "white",
              boxShadow: "0px 2px 8px rgba(212, 126, 126, 0.4)",
            },
          }}
        >
          Modules
        </ToggleButton>
        <GenerateReport />
      </ToggleButtonGroup>

      {/* top cards*/}
      {/*jump2all*/}
      {view === "all" && (
        <div className="main-div">
          <div className="small-holder">
            {/* ✅ Daily Quota Progress Card */}
            <UnifiedCard
              type="summary"
              title="Total Active Work Orders"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={totalActiveWorkOrders} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Unresolved Requests Summary */}
            <UnifiedCard
              type="summary"
              title="Completed Work Orders"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={completedWorkOrders} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Weekly Trend Rate Card */}
            <UnifiedCard
              type="summary"
              title="Pending Module Requests"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={pendingModuleRequests} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Monthly Revenue Summary */}
            <UnifiedCard
              type="summary"
              title="Shipments in Transit"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={shipmentsInTransit} // DYNAMICVALUE
              description="vs 30 days"
            />
          </div>

          <div className="dashboard-contents">
            {/* Left side components */}
            <div className="bigger-components">
              <div className="component-holder">
                <h2>Production feed</h2>
                <div className="chart">
                  <Heatmap />
                </div>
              </div>

              <div className="component-holder">
                <h2>Recent requests</h2>
                <div className="chart">
                  <div className="pie-chart">
                    {requests.map((item, index) => {
                      const bgColor =
                        softCoolColors[index % softCoolColors.length];
                      const textColor = index < 3 ? "#000" : "#000"; // Darker colors get white text, lighter get dark text

                      return (
                        <div
                          key={item._id}
                          className="slice"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor, // Dynamic font color
                            borderRadius: "12px",
                            padding: "8px 17px 10px",
                          }}
                        >
                          <span>{item.module}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* End of left side components */}

            {/* Right side components */}
            <div className="smaller-components">
              <div className="component-holder">
                <div className="calendar-dashboard">
                  <h2>Reminders</h2>
                  <Calendar
                    className={"calendar"}
                    onChange={(date) => setValue(date as Date)}
                    value={value}
                    tileContent={tileContent}
                    tileClassName={({ date }) => {
                      const formattedDate = date.toISOString().split("T")[0];
                      const hasReminder = reminders.some(
                        (reminder) => reminder.date === formattedDate
                      );
                      return hasReminder ? "reminder-day" : null;
                    }}
                  />
                  <div className="add-reminder">
                    <button
                      onClick={() => setShowReminderInput(!showReminderInput)}
                    >
                      {showReminderInput ? "Cancel" : "Add Reminder"}
                    </button>
                  </div>
                  {showReminderInput && (
                    <div className="reminder-input">
                      <input
                        type="text"
                        placeholder="Reminder Title"
                        value={reminderTitle}
                        onChange={(e) => setReminderTitle(e.target.value)}
                      />
                      <button onClick={addReminder}>Save</button>
                    </div>
                  )}
                  <div className="selected-date-info">
                    <strong>Selected Date:</strong> {value.toDateString()}
                    <br />
                    <strong>Reminder:</strong>{" "}
                    {handleDayHover(value) || "No reminder"}
                  </div>
                </div>
              </div>
              <div className="component-holder">
                <h2>Shipping updates</h2>
                <ul className="tracking-logs">
                  {trackingLogs.map((log) => (
                    <li key={log.requestID}>
                      <span className="module">{log.moduleCode}</span>: {log.status}{" "}
                      (Updated by {log.dispatchedBy} on{" "}
                      {log.deliveredDate ? new Date(log.deliveredDate).toLocaleDateString() : "N/A"})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*jump2prod*/}
      {view === "production" && (
        <div className="main-div">
          <div className="small-holder">
            {/* ✅ Daily Quota Progress Card */}
            <UnifiedCard
              type="rate"
              title="Production Rate"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={productionRate} // DYNAMICVALUE
              oldValue={58} // You can replace this with a dynamic value if needed
            />

            {/* ✅ Unresolved Requests Summary */}
            <UnifiedCard
              type="summary"
              title="Late Fulfillments "
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={lateFulfillments} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Weekly Trend Rate Card */}
            <UnifiedCard
              type="summary"
              title="Total Units Produced"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={totalUnitsProduced} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Monthly Revenue Summary */}
            <UnifiedCard
              type="rate"
              title="Fulfillment Efficiency"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={fulfillmentEfficiency} // DYNAMICVALUE
              oldValue={100} // You can replace this with a dynamic value if needed
            />
          </div>

          <div className="dashboard-contents">
            <div className="bigger-components">
              <div id="linechart-70" className="component-holder">
                <h2>Production Performance</h2>
                <LineChartComponent />
              </div>
              <div className="component-holder">
                <h2>Order Fulfillment Status</h2>
                <BarChartComponent apiUri="http://localhost:5001/api/order-fulfillment" />
              </div>
              <div className="component-holder">
                <h2>Produced Quantity Distribution</h2>
                <Histogram apiUri="http://localhost:5001/api/produced-quantity-distribution" />
              </div>
            </div>

            <div className="smaller-components"></div>
          </div>
          <div className="component-holder">
            <h2>Production feed</h2>
            <div id="full-width-heatmap" className="chart">
              <Heatmap />
            </div>
          </div>
        </div>
      )}

      {/*jump2module*/}
      {view === "logistics" && (
        <div className="main-div">
          <div className="small-holder">
            {/* ✅ Daily Quota Progress Card */}
            <UnifiedCard
              type="summary"
              title="Total Module Requests "
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={94} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Unresolved Requests Summary */}
            <UnifiedCard
              type="summary"
              title="Fulfilled Module Requests"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={10} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Weekly Trend Rate Card */}
            <UnifiedCard
              type="summary"
              title="Pending Shipments"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={90} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Monthly Revenue Summary */}
            <UnifiedCard
              type="summary"
              title="Average Delivery Time"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={88}
              description="in 24 hours"
            />
          </div>

          <div className="dashboard-contents">
            <div className="bigger-components">
              <div className="component-holder">
                <h2>Most Requested Items</h2>
                <CustomBarChart apiUri="http://localhost:5001/api/module-chart" />
              </div>
            </div>
            <div className="smaller-components">
              <div className="component-holder">
                <h2>Factory Request Distribuition</h2>
                <PieChartComponent apiUrl="http://localhost:5001/api/logistics-summary" />
              </div>
              <div className="component-holder">
                <h2>Module Request Fulfillment Rate</h2>
                <GaugeChart apiUri="http://localhost:5001/api/fulfillment-rate" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;