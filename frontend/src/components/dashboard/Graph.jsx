import { LineChart } from "@mui/x-charts/LineChart";
import { Paper, Typography, Box } from "@mui/material";

const usersData = [150, 200, 180, 220, 250, 300, 350, 330, 280, 290, 310, 360];
const inProgressPartnersData = [14, 88, 4, 57, 52, 14, 14, 14, 14, 14, 14, 14];
const partnersData = [10, 15, 12, 18, 20, 25, 30, 28, 22, 24, 26, 29];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthlyPartnersChart() {
  return (
    <Paper
      elevation={5}
      sx={{
        padding: 4,
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        color="textPrimary"
        align="center"
        fontWeight="600"
        marginBottom={3}
      >
        Monthly Users & Partners Statistics 📊
      </Typography>

      <Box
        sx={{
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          padding: 3,
          boxShadow: 2,
          overflowX: "auto",
        }}
      >
        <LineChart
          width={700} // Increased width for better spacing
          height={420}
          series={[
            {
              data: usersData,
              label: "Users",
              color: "#1976D2",
              curve: "monotoneX",
            },
            {
              data: inProgressPartnersData,
              label: "In-Progress Partners",
              color: "#FFA726",
              curve: "monotoneX",
            },
            {
              data: partnersData,
              label: "Partners",
              color: "#388E3C",
              curve: "monotoneX",
            },
          ]}
          xAxis={[{ scaleType: "point", data: months }]}
          yAxis={[{ label: "Count" }]}
          sx={{
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        />
      </Box>
    </Paper>
  );
}
