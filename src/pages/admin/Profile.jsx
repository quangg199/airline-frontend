import { useEffect, useState } from "react";
import api from "../../api";
import { Card, Spinner } from "react-bootstrap";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");

      setUser(response.data);
    } catch (error) {
      console.log("API chưa sẵn sàng");

      // Mock data khi backend chưa xong
      setUser({
        id: 1,
        name: "Admin SkyLink",
        email: "admin@skylink.com",
        role: "Admin",
        membership_tier: "Gold",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="container mt-4">
      <h2>My Profile</h2>

      <Card className="mt-3 shadow-sm">
        <Card.Body>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Membership:</strong> {user.membership_tier}</p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;