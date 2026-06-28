import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

import { Card, Row, Col, Spinner, Table } from "react-bootstrap";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalFlights: 0,
    totalBookings: 0,
    totalUsers: 0,
    revenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentFlights, setRecentFlights] = useState([]);

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    const isAdmin = user.roles?.some((r) => r.name === "admin");
    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/dashboard.php");

      const data = res.data;

      setStats({
        totalFlights: data?.stats?.totalFlights ?? 0,
        totalBookings: data?.stats?.totalBookings ?? 0,
        totalUsers: data?.stats?.totalUsers ?? 0,
        revenue: data?.stats?.revenue ?? 0,
      });

      setRecentBookings(data?.recentBookings ?? []);
      setRecentFlights(data?.recentFlights ?? []);
    } catch (err) {
      setError("Không tải được dữ liệu dashboard");

      // fallback mock data
      setStats({
        totalFlights: 12,
        totalBookings: 45,
        totalUsers: 20,
        revenue: 12500000,
      });

      setRecentBookings([
        { id: 1, customer: "Nguyen Van A", flight: "VN123", amount: 2500000 },
        { id: 2, customer: "Tran Thi B", flight: "VJ222", amount: 1800000 },
      ]);

      setRecentFlights([
        { id: 1, code: "VN123", from: "HAN", to: "SGN", status: "Scheduled" },
        { id: 2, code: "VJ456", from: "DAD", to: "HAN", status: "Delayed" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Bookings",
        data: [15, 22, 35, 28, 50, 45],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center vh-100 align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {error && <p className="text-danger">{error}</p>}

      {/* STATS */}
      <Row className="g-3">
        <Col md={3}>
          <Card>
            <Card.Body>
              <h6>Flights</h6>
              <h3>{stats.totalFlights}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <h6>Bookings</h6>
              <h3>{stats.totalBookings}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <h6>Users</h6>
              <h3>{stats.totalUsers}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <h6>Revenue</h6>
              <h3>{Number(stats.revenue).toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CHART + STATUS */}
      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h5>Booking Analytics</h5>
              <Bar data={chartData} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Flight Status</h5>
              <p>🟢 Scheduled</p>
              <p>🟠 Delayed</p>
              <p>🔴 Cancelled</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* TABLES */}
      <Row className="mt-4">
        <Col md={6}>
          <Card>
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
                        {Number(b.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
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