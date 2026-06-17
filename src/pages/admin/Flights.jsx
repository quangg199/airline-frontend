import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    flightCode: "",
    departure: "",
    destination: "",
    price: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  // GET ALL
  const fetchFlights = async () => {
    setLoading(true);

    try {
      const res = await api.get("/flights.php");
      setFlights(res.data || []);
    } catch (err) {
      console.log("Using mock data");

      setFlights([
        {
          id: 1,
          flightCode: "VN101",
          departure: "Hà Nội",
          destination: "TP.HCM",
          price: 1200000,
          status: "scheduled",
        },
        {
          id: 2,
          flightCode: "VJ202",
          departure: "Đà Nẵng",
          destination: "Hà Nội",
          price: 900000,
          status: "delayed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // OPEN ADD
  const handleAdd = () => {
    setEditId(null);
    setForm({
      flightCode: "",
      departure: "",
      destination: "",
      price: "",
      status: "scheduled",
    });
    setShow(true);
  };

  // OPEN EDIT (FIXED)
  const handleEdit = (flight) => {
    setEditId(flight.id);

    setForm({
      flightCode: flight.flightCode || "",
      departure: flight.departure || "",
      destination: flight.destination || "",
      price: flight.price || "",
      status: flight.status || "scheduled",
    });

    setShow(true);
  };

  // SAVE (ADD / UPDATE)
  const handleSave = async () => {
    setSaving(true);

    try {
      if (editId) {
        await api.put(`/flights.php?id=${editId}`, form);
      } else {
        await api.post("/flights.php", form);
      }

      setShow(false);
      fetchFlights();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flight?")) return;

    try {
      await api.delete(`/flights.php?id=${id}`);
      setFlights((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // SAFE FILTER (FIXED)
  const filteredFlights = flights.filter((f) => {
    const keyword = search.toLowerCase();

    return (
      (f.flightCode || "").toLowerCase().includes(keyword) ||
      (f.departure || "").toLowerCase().includes(keyword) ||
      (f.destination || "").toLowerCase().includes(keyword)
    );
  });

  // STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "green";
      case "delayed":
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
      <h2>Flights Management</h2>

      {/* SEARCH + ADD */}
      <div className="d-flex gap-2 align-items-center mb-3 mt-3">
        <input
          type="text"
          placeholder="Search flight..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 14px",
            width: "320px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
          }}
        />

        <Button onClick={handleAdd}>+ Add Flight</Button>
      </div>

      {/* TABLE */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>From</th>
            <th>To</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredFlights.length > 0 ? (
            filteredFlights.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.flightCode}</td>
                <td>{f.departure}</td>
                <td>{f.destination}</td>
                <td>{f.price}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      color: "#fff",
                      background: getStatusColor(f.status),
                      fontSize: "12px",
                    }}
                  >
                    {f.status}
                  </span>
                </td>

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
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No flights found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Flight" : "Add Flight"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              placeholder="Flight Code"
              value={form.flightCode}
              onChange={(e) =>
                setForm({ ...form, flightCode: e.target.value })
              }
            />

            <Form.Control
              className="mb-2"
              placeholder="Departure"
              value={form.departure}
              onChange={(e) =>
                setForm({ ...form, departure: e.target.value })
              }
            />

            <Form.Control
              className="mb-2"
              placeholder="Destination"
              value={form.destination}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
            />

            <Form.Control
              className="mb-2"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

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
          </Form>
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