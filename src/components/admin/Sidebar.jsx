import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      group: "MAIN",
      items: [
        { path: "/admin", label: "Dashboard", icon: "tachometer-alt" },
      ],
    },
    {
      group: "MANAGEMENT",
      items: [
        { path: "/admin/flights", label: "Flights", icon: "plane-departure" },
        { path: "/admin/airports", label: "Airports", icon: "map-marker-alt" },
        { path: "/admin/bookings", label: "Bookings", icon: "ticket-alt" },
        { path: "/admin/users", label: "Users", icon: "users" },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      style={{
        width: "270px",
        minHeight: "120vh",
        background: "#111827",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h4
          style={{
            margin: 0,
            fontWeight: "800",
            color: "#fff",
          }}
        >
          ✈ SkyLink
        </h4>

        <small
          style={{
            color: "#94a3b8",
          }}
        >
          Airline Admin Panel
        </small>
      </div>

      {/* MENU */}
      <nav style={{ flex: 1, paddingTop: "15px" }}>
        {menu.map((section, index) => (
          <div key={index}>
            <div
              style={{
                color: "#64748b",
                fontSize: "11px",
                fontWeight: "700",
                padding: "12px 24px",
                letterSpacing: "1px",
              }}
            >
              {section.group}
            </div>

            {section.items.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    margin: "6px 12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    textDecoration: "none",

                    background: active
                      ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                      : "transparent",

                    color: active ? "#fff" : "#cbd5e1",

                    boxShadow: active
                      ? "0 8px 20px rgba(37,99,235,0.35)"
                      : "none",

                    transition: "0.25s ease",
                  }}
                >
                  <i
                    className={`fas fa-${item.icon}`}
                    style={{
                      width: "20px",
                      textAlign: "center",
                    }}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* USER CARD */}
      <div
        style={{
          margin: "15px",
          padding: "15px",
          borderRadius: "14px",
          background: "#1e293b",
        }}
      >
        <div
          style={{
            fontWeight: "600",
            marginBottom: "4px",
          }}
        >
          Administrator
        </div>

        <small style={{ color: "#94a3b8" }}>
          SkyLink Airline System
        </small>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "15px 20px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        Version 1.0
      </div>
    </aside>
  );
}

export default Sidebar;