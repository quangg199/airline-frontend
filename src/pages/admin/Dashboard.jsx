import { useEffect, useState } from "react";
import api from "../../api";
import {
  Card,
  Row,
  Col,
  Spinner,
  Table,
} from "react-bootstrap";

import {
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalFlights: 0,
    totalBookings: 0,
    totalUsers: 0,
    revenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentFlights, setRecentFlights] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard.php");

      setStats(res.data.stats);
      setRecentBookings(res.data.recentBookings);
      setRecentFlights(res.data.recentFlights);
    } catch (err) {
      console.log("Mock dashboard");

      setStats({
        totalFlights: 12,
        totalBookings: 45,
        totalUsers: 20,
        revenue: 12500000,
      });

      setRecentBookings([
        {
          id: 1,
          customer: "Nguyen Van A",
          flight: "VN123",
          amount: 2500000,
        },
        {
          id: 2,
          customer: "Tran Thi B",
          flight: "VJ222",
          amount: 1800000,
        },
      ]);

      setRecentFlights([
        {
          id: 1,
          code: "VN123",
          from: "HAN",
          to: "SGN",
          status: "Scheduled",
        },
        {
          id: 2,
          code: "VJ456",
          from: "DAD",
          to: "HAN",
          status: "Delayed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center vh-100 align-items-center">
        <Spinner />
      </div>
    );

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Bookings",
        data: [15, 22, 35, 28, 50, 45],
      },
    ],
  };

  return (
    <div className="container-fluid mt-4">

      <h2 className="mb-4">
        Dashboard Overview
      </h2>

      <Row className="g-3">

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Total Flights</h6>
              <h2>{stats.totalFlights}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Total Bookings</h6>
              <h2>{stats.totalBookings}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Total Users</h6>
              <h2>{stats.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6>Revenue</h6>
              <h2>
                {stats.revenue.toLocaleString()}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5>Bookings Statistics</h5>

              <Bar data={chartData} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5>Flight Status</h5>

              <p>🟢 Scheduled: 8</p>
              <p>🟠 Delayed: 3</p>
              <p>🔴 Cancelled: 1</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5>Recent Bookings</h5>

              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Flight</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.customer}</td>
                      <td>{b.flight}</td>
                      <td>
                        {b.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5>Recent Flights</h5>

              <Table hover>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentFlights.map((f) => (
                    <tr key={f.id}>
                      <td>{f.code}</td>
                      <td>{f.from}</td>
                      <td>{f.to}</td>
                      <td>{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
}

export default Dashboard;