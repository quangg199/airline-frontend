import { useEffect, useState, useRef, useCallback } from "react";
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
  Pagination,
} from "react-bootstrap";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [saving, setSaving] = useState(false);

  const abortRef = useRef(null);

  const emptyForm = {
    flight_number: "",
    departure_airport_id: "",
    arrival_airport_id: "",
    departure_time: "",
    arrival_time: "",
    aircraft_id: "",
    base_price: "",
    available_seats: "",
    status: "scheduled",
  };

  const [form, setForm] = useState(emptyForm);

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ================= FETCH =================
  const fetchFlights = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);

      const res = await api.get("/admin/flights", {
        params: { search, page },
        signal: controller.signal,
      });

      setFlights(res.data.data);
      setLastPage(res.data.meta.last_page);
    } catch (err) {
      if (err.name === "CanceledError") return;
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  // ================= ADD =================
  const handleAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShow(true);
  };

  // ================= EDIT =================
  const handleEdit = (f) => {
    setEditId(f.id);
    setForm({
      flight_number: f.flight_number || "",
      departure_airport_id: f.departure_airport_id || "",
      arrival_airport_id: f.arrival_airport_id || "",
      departure_time: f.departure_time || "",
      arrival_time: f.arrival_time || "",
      aircraft_id: f.aircraft_id || "",
      base_price: f.base_price || "",
      available_seats: f.available_seats || "",
      status: f.status || "scheduled",
    });
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
      console.error(err);
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

  // ================= STATUS =================
  const statusBadge = (status) => {
    const map = {
      scheduled: "success",
      delayed: "warning",
      cancelled: "danger",
    };
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  // ================= PAGINATION =================
  const renderPagination = () => {
    return (
      <Pagination>
        {Array.from({ length: lastPage }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === page}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <Card className="p-3 mb-3">
        <Row>
          <Col md={8}>
            <h4>✈ Flight Management</h4>
          </Col>

          <Col md={4} className="d-flex gap-2">
            <Form.Control
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button onClick={handleAdd}>+ Add</Button>
          </Col>
        </Row>
      </Card>

      {/* TABLE */}
      <Card>
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
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : (
              flights.map((f, i) => (
                <tr key={f.id}>
                  <td>{(page - 1) * 10 + i + 1}</td>
                  <td>{f.flight_number}</td>
                  <td>{f.departure_airport_id} → {f.arrival_airport_id}</td>
                  <td>
                    {f.departure_time} <br />
                    {f.arrival_time}
                  </td>
                  <td>${f.base_price}</td>
                  <td>{f.available_seats}</td>
                  <td>{statusBadge(f.status)}</td>

                  <td>
                    <Button size="sm" onClick={() => handleEdit(f)}>
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
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* PAGINATION */}
      <div className="mt-3 d-flex justify-content-center">
        {renderPagination()}
      </div>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Flight" : "Add Flight"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            {Object.keys(form).map((key) => {

              // STATUS → SELECT
              if (key === "status") {
                return (
                  <Col md={6} key={key} className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="delayed">Delayed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Col>
                );
              }

              // AIRCRAFT → NUMBER INPUT (tạm thời)
              if (key === "aircraft_id") {
                return (
                  <Col md={6} key={key} className="mb-3">
                    <Form.Label>Aircraft</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.aircraft_id}
                      onChange={(e) =>
                        setForm({ ...form, aircraft_id: e.target.value })
                      }
                    />
                  </Col>
                );
              }

              // ARRIVAL TIME → DATETIME
              if (key === "arrival_time") {
                return (
                  <Col md={6} key={key} className="mb-3">
                    <Form.Label>Arrival Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={form.arrival_time}
                      onChange={(e) =>
                        setForm({ ...form, arrival_time: e.target.value })
                      }
                    />
                  </Col>
                );
              }

              // DEPARTURE TIME (giữ nguyên nhưng rõ ràng hơn)
              if (key === "departure_time") {
                return (
                  <Col md={6} key={key} className="mb-3">
                    <Form.Label>Departure Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={form.departure_time}
                      onChange={(e) =>
                        setForm({ ...form, departure_time: e.target.value })
                      }
                    />
                  </Col>
                );
              }

              // DEFAULT
              return (
                <Col md={6} key={key} className="mb-3">
                  <Form.Label>{key}</Form.Label>
                  <Form.Control
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </Col>
              );
            })}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Flights;