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

  const fetchBookings = async () => {
    setLoading(true);

    try {
      const res = await api.get("/admin/bookings");

      console.log("API RAW:", res.data);

      setBookings(res.data.data ?? []);
    } catch (err) {
      console.log(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    await api.delete(`/admin/bookings/${id}`);

    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const filteredBookings = bookings.filter((b) => {
    const keyword = search.toLowerCase();

    return (
      (b.user?.name || "").toLowerCase().includes(keyword) ||
      (b.flight?.flight_number || "").toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Bookings Management</h2>

      <Form className="mb-3">
        <Form.Control
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>

      <Table bordered hover>
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
                <td>{b.user?.name || "N/A"}</td>
                <td>{b.flight?.flight_number || "N/A"}</td>
                <td>{b.status}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
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