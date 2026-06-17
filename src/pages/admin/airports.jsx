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

  useEffect(() => {
    fetchAirports();
  }, []);

  // ======================
  // GET ALL AIRPORTS
  // ======================
  const fetchAirports = async () => {
    try {
      setLoading(true);

      const res = await api.get("/airports");

      console.log("Airports:", res.data);

      setAirports(res.data || []);
    } catch (err) {
      console.error("Fetch airports failed:", err);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // OPEN ADD
  // ======================
  const handleAdd = () => {
    setEditId(null);

    setForm({
      name: "",
      city: "",
      code: "",
    });

    setShow(true);
  };

  // ======================
  // OPEN EDIT
  // ======================
  const handleEdit = (airport) => {
    setEditId(airport.id);

    setForm({
      name: airport.name,
      city: airport.city,
      code: airport.code,
    });

    setShow(true);
  };

  // ======================
  // SAVE
  // ======================
  const handleSave = async () => {
    if (!form.name || !form.city || !form.code) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        code: form.code.toUpperCase(),
      };

      if (editId) {
        await api.put(
          `/admin/airports/${editId}`,
          payload
        );
      } else {
        await api.post(
          "/admin/airports",
          payload
        );
      }

      setShow(false);

      fetchAirports();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Save airport failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this airport?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/airports/${id}`);

      setAirports((prev) =>
        prev.filter((a) => a.id !== id)
      );
    } catch (err) {
      console.error(err);

      alert("Delete airport failed");
    }
  };

  // ======================
  // FILTER
  // ======================
  const filteredAirports = airports.filter((a) => {
    const keyword = search.toLowerCase();

    return (
      a.name?.toLowerCase().includes(keyword) ||
      a.city?.toLowerCase().includes(keyword) ||
      a.code?.toLowerCase().includes(keyword)
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Airports Management</h2>

        <Button onClick={handleAdd}>
          + Add Airport
        </Button>
      </div>

      <Form.Control
        className="mb-3"
        type="text"
        placeholder="Search airport..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Airport Name</th>
            <th>City</th>
            <th>Code</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAirports.length > 0 ? (
            filteredAirports.map((airport) => (
              <tr key={airport.id}>
                <td>{airport.id}</td>

                <td>{airport.name}</td>

                <td>{airport.city}</td>

                <td>
                  <span className="badge bg-primary">
                    {airport.code}
                  </span>
                </td>

                <td>
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      handleEdit(airport)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      handleDelete(airport.id)
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center"
              >
                No airports found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editId
              ? "Edit Airport"
              : "Add Airport"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Airport Name
            </Form.Label>

            <Form.Control
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>

            <Form.Control
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Code</Form.Label>

            <Form.Control
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value.toUpperCase(),
                })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShow(false)}
          >
            Close
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Airport"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Airports;