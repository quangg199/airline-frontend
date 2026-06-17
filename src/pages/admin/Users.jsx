import { useEffect, useState } from "react";
import api from "../../api";
import { Table, Button, Spinner, Form } from "react-bootstrap";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // GET ALL USERS
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await api.get("/users.php");
      setUsers(response.data || []);
    } catch (error) {
      console.log("API chưa có → dùng mock data");

      setUsers([
        {
          id: 1,
          name: "Nguyen Van A",
          email: "a@gmail.com",
          role: "admin",
        },
        {
          id: 2,
          name: "Tran Thi B",
          email: "b@gmail.com",
          role: "user",
        },
        {
          id: 3,
          name: "Le Van C",
          email: "c@gmail.com",
          role: "user",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // DELETE USER (ready API)
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/users.php?id=${id}`);

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.log("Delete failed (mock mode)");

      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // SAFE FILTER
  const filteredUsers = users.filter((u) => {
    const keyword = search.toLowerCase();

    return (
      (u.name || "").toLowerCase().includes(keyword) ||
      (u.email || "").toLowerCase().includes(keyword)
    );
  });

  // ROLE COLOR
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "purple";
      case "user":
        return "blue";
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
      <h2 className="mb-3">Users Management</h2>

      {/* SEARCH */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>

      {/* TABLE */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      color: "white",
                      background: getRoleColor(u.role),
                      fontSize: "12px",
                    }}
                  >
                    {u.role}
                  </span>
                </td>

                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Users;