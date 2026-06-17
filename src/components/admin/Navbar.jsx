import { useNavigate } from "react-router-dom";
import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { colors } from "../../styles/theme";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        height: "70px",
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {/* LEFT */}
      <div
        onClick={() => navigate("/admin")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: colors.primary,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontWeight: "700",
          }}
        >
          ✈
        </div>

        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            SkyLink Admin
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#6B7280",
            }}
          >
            Airline Management System
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* Notification */}
        <div
          style={{
            position: "relative",
            cursor: "pointer",
          }}
        >
          <FaBell size={20} color="#6B7280" />

          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#EF4444",
              color: "#fff",
              fontSize: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            3
          </span>
        </div>

        {/* User */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin/profile")}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: colors.primary,
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            {(user?.name?.charAt(0) || "A").toUpperCase()}
          </div>

          <div>
            <div
              style={{
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {user?.name || "Admin"}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#6B7280",
              }}
            >
              Administrator
            </div>
          </div>

          <FaChevronDown color="#6B7280" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            border: "none",
            background: "#EF4444",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;