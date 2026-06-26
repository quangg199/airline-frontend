import { useEffect, useState, useCallback } from "react";
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

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [searchInput]);

  // FETCH DATA
  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      const res = await api.get("/admin/flights", {
        params: { search, page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFlights(res.data.data || []);
      setLastPage(res.data.meta?.last_page || 1);
    } catch (err) {
      console.log("API error:", err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  // ADD
  const handleAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShow(true);
  };

  // EDIT
  const handleEdit = (f) => {
    setEditId(f.id);
    setForm(f);
    setShow(true);
  };

  // SAVE
  const handleSave = async () => {
    try {
      setSaving(true);

      if (editId) {
        await api.put(`/admin/flights/${editId}`, form);
      } else {
        await api.post("/admin/flights", form);
      }

      setShow(false);
      fetchFlights();
    } catch (err) {
      console.log("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight?")) return;

    try {
      await api.delete(`/admin/flights/${id}`);
      fetchFlights();
    } catch (err) {
      console.log(err);
    }
  };

  const statusBadge = (status) => {
    const map = {
      scheduled: "success",
      delayed: "warning",
      cancelled: "danger",
    };
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="container mt-4">

      <Card className="p-3 mb-3">
        <Row>
          <Col md={8}>
            <h4>Flight Management</h4>
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

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
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
                <td>{(page - 1) * 10 + i + 1}</td>
                <td>{f.flight_number}</td>
                <td>
                  {f.departure_airport_id} → {f.arrival_airport_id}
                </td>
                <td>
                  {f.departure_time} <br />
                  {f.arrival_time}
                </td>
                <td>{f.base_price}</td>
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
            ))}
          </tbody>
        </Table>
      )}

      <Pagination className="justify-content-center">
        {Array.from({ length: lastPage }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={page === i + 1}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>

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

                {key === "status" ? (
                  <Form.Select
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="delayed">Delayed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                ) : (
                  <Form.Control
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                )}
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
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