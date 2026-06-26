import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Button, Spinner, Form } from "react-bootstrap";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  // ========================
  // GET ALL (ADMIN API)
  // ========================
  const fetchBookings = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await api.get("/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data.data || []);
    } catch (error) {
      console.log("API error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // DELETE (ADMIN API)
  // ========================
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Delete this booking?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");

      await api.delete(`/admin/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // ========================
  // FILTER
  // ========================
  const filteredBookings = bookings.filter((b) => {
    const keyword = search.toLowerCase();

    const passengerName =
      b.tickets?.[0]?.passenger_name?.toLowerCase() || "";

    const flightId =
      b.flight?.id?.toString().toLowerCase() || "";

    return passengerName.includes(keyword) || flightId.includes(keyword);
  });

  // ========================
  // STATUS COLOR
  // ========================
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#28a745";
      case "pending":
        return "#fd7e14";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Admin Bookings Management</h2>

      {/* SEARCH */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search passenger or flight ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>

      {/* TABLE */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Passenger</th>
            <th>Flight</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>

                <td>
                  {b.tickets?.[0]?.passenger_name || "N/A"}
                </td>

                <td>
                  Flight #{b.flight?.id || "N/A"}
                </td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      color: "white",
                      background: getStatusColor(b.status),
                      fontSize: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {b.status}
                  </span>
                </td>

                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteBooking(b.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Bookings;