import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Button, Spinner, Form, Modal } from "react-bootstrap";

function Airports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    code: "",
  });

  // =====================
  // FETCH DATA
  // =====================
  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);

    try {
      const res = await api.get("/airports");

      console.log("API RESPONSE:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setAirports(data);
    } catch (err) {
      console.log("API ERROR:", err.response || err);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // ADD
  // =====================
  const handleAdd = () => {
    setEditId(null);
    setForm({ name: "", city: "", code: "" });
    setShow(true);
  };

  // =====================
  // EDIT
  // =====================
  const handleEdit = (airport) => {
    setEditId(airport.id);
    setForm({
      name: airport.name || "",
      city: airport.city || "",
      code: airport.code || "",
    });
    setShow(true);
  };

  // =====================
  // SAVE (CREATE / UPDATE)
  // =====================
  const handleSave = async () => {
    setSaving(true);

    try {
      if (editId) {
        await api.put(`/airports/${editId}`, form);
      } else {
        await api.post("/airports", form);
      }

      setShow(false);
      fetchAirports();
    } catch (err) {
      console.log("SAVE ERROR:", err.response || err);
    } finally {
      setSaving(false);
    }
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this airport?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/airports/${id}`);

      setAirports((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err.response || err);

      setAirports((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // =====================
  // FILTER
  // =====================
  const filteredAirports = airports.filter((a) => {
    const keyword = search.toLowerCase();

    return (
      (a.name || "").toLowerCase().includes(keyword) ||
      (a.city || "").toLowerCase().includes(keyword) ||
      (a.code || "").toLowerCase().includes(keyword)
    );
  });

  // =====================
  // LOADING UI
  // =====================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  // =====================
  // UI
  // =====================
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Airports Management</h2>

      {/* SEARCH + ADD */}
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="Search airport..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button onClick={handleAdd}>+ Add Airport</Button>
      </div>

      {/* TABLE */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredAirports.length > 0 ? (
            filteredAirports.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.city}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: "#2563eb",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  >
                    {a.code}
                  </span>
                </td>

                <td>
                  <Button size="sm" onClick={() => handleEdit(a)}>
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No airports found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Airport" : "Add Airport"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              placeholder="Airport Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Form.Control
              className="mb-2"
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <Form.Control
              className="mb-2"
              placeholder="Code (e.g. HAN)"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />
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

export default Airports;