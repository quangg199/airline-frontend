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

  // GET ALL
  const fetchBookings = async () => {
    setLoading(true);

    try {
      const response = await api.get("/bookings.php");
      setBookings(response.data || []);
    } catch (error) {
      console.log("API chưa có → dùng mock data");

      setBookings([
        {
          id: 1,
          customerName: "Nguyen Van A",
          flightCode: "VN123",
          status: "confirmed",
        },
        {
          id: 2,
          customerName: "Tran Thi B",
          flightCode: "VJ456",
          status: "pending",
        },
        {
          id: 3,
          customerName: "Le Van C",
          flightCode: "QH789",
          status: "cancelled",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // DELETE (mock + ready API)
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Delete this booking?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/bookings.php?id=${id}`);

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.log("Delete failed (mock mode)");

      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // SAFE FILTER
  const filteredBookings = bookings.filter((b) => {
    const keyword = search.toLowerCase();

    return (
      (b.customerName || "").toLowerCase().includes(keyword) ||
      (b.flightCode || "").toLowerCase().includes(keyword)
    );
  });

  // STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "gray";
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
      <h2 className="mb-3">Bookings Management</h2>

      {/* SEARCH */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search customer or flight code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>

      {/* TABLE */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
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
                <td>{b.customerName}</td>
                <td>{b.flightCode}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      color: "white",
                      background: getStatusColor(b.status),
                      fontSize: "12px",
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