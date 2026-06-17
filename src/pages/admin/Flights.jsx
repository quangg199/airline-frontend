import { useEffect, useState } from "react";
import api from "../../api";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Badge,
  Card,
  Row,
  Col,
} from "react-bootstrap";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    flight_number: "",
    departure_airport_id: "",
    arrival_airport_id: "",
    departure_time: "",
    arrival_time: "",
    aircraft_id: "",
    base_price: "",
    available_seats: "",
    status: "scheduled",
  });

  // ================= FETCH =================
  useEffect(() => {
    fetchFlights();
  }, [search]);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/flights?search=${search}`);
      setFlights(res.data.data);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN ADD =================
  const handleAdd = () => {
    setEditId(null);
    setForm({
      flight_number: "",
      departure_airport_id: "",
      arrival_airport_id: "",
      departure_time: "",
      arrival_time: "",
      aircraft_id: "",
      base_price: "",
      available_seats: "",
      status: "scheduled",
    });
    setShow(true);
  };

  // ================= EDIT =================
  const handleEdit = (f) => {
    setEditId(f.id);
    setForm(f);
    setShow(true);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        ...form,
        base_price: Number(form.base_price),
        available_seats: Number(form.available_seats),
      };

      if (editId) {
        await api.put(`/admin/flights/${editId}`, payload);
      } else {
        await api.post(`/admin/flights`, payload);
      }

      setShow(false);
      fetchFlights();
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete flight?")) return;
    await api.delete(`/admin/flights/${id}`);
    fetchFlights();
  };

  // ================= STATUS BADGE =================
  const statusBadge = (status) => {
    const map = {
      scheduled: "success",
      delayed: "warning",
      cancelled: "danger",
    };

    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* ================= HEADER ================= */}
      <Card className="p-3 mb-3 shadow-sm">
        <Row>
          <Col md={8}>
            <h4>✈ Flight Management</h4>
          </Col>

          <Col md={4} className="d-flex gap-2">
            <Form.Control
              placeholder="Search flight..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button onClick={handleAdd}>+ Add</Button>
          </Col>
        </Row>
      </Card>

      {/* ================= TABLE ================= */}
      <Card className="shadow-sm">
        <Table hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Flight No</th>
              <th>Route</th>
              <th>Time</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {flights.map((f, i) => (
              <tr key={f.id}>
                <td>{i + 1}</td>
                <td><b>{f.flight_number}</b></td>

                <td>
                  {f.departure_airport_id} → {f.arrival_airport_id}
                </td>

                <td>
                  {f.departure_time} <br />
                  {f.arrival_time}
                </td>

                <td>${f.base_price}</td>

                <td>{f.available_seats}</td>

                <td>{statusBadge(f.status)}</td>

                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleEdit(f)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(f.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* ================= MODAL ================= */}
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Flight" : "Add Flight"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            {Object.keys(form).map((key) => (
              <Col md={6} key={key} className="mb-3">
                <Form.Label>{key}</Form.Label>

                <Form.Control
                  value={form[key]}
                  type={
                    key.includes("time")
                      ? "datetime-local"
                      : key.includes("price") ||
                        key.includes("seats")
                      ? "number"
                      : "text"
                  }
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Flight"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Flights;