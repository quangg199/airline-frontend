import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PaperPlaneTilt, SignOut } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Reusable Global Navbar Component
 * Premium Light Theme, Glassmorphic Scroll Physics, Session Tracking.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoutMsg, setLogoutMsg] = useState("");

  useEffect(() => {
    // Check auth session
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }

    // Scroll listener for sticky glass effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    setUser(null);
    setLogoutMsg("Đã đăng xuất thành công.");
    setTimeout(() => {
      setLogoutMsg("");
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/50 shadow-sm py-4" 
          : "bg-transparent py-6"
      }`}>
        <div className="w-full px-6 md:px-12 flex justify-between items-center">
          
          <div className="flex items-center gap-8 md:gap-16">
            {/* Logo */}
            <div 
              onClick={() => navigate("/")} 
              className="text-2xl font-bold tracking-tighter text-zinc-900 cursor-pointer flex items-center gap-2 select-none"
            >
              <PaperPlaneTilt weight="fill" className="text-blue-600 animate-pulse" />
              SKYLINK
            </div>
            
            {/* Nav Links */}
            <div className="hidden md:flex gap-8 text-sm font-semibold text-zinc-650">
              <a href="/flights" className="hover:text-blue-600 transition-colors">Chuyến bay</a>
              <a href="/services" className="hover:text-blue-600 transition-colors">Dịch vụ</a>
              <a href="/promotions" className="hover:text-blue-600 transition-colors">Khuyến mãi</a>
              <a href="/skyclub" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                SkyClub
              </a>
            </div>
          </div>
          
          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/my-bookings")}
                className="text-sm font-semibold text-zinc-600 hover:text-blue-600 flex items-center gap-2 transition-colors cursor-pointer"
              >
                Chuyến của tôi
              </button>
              
              {/* Premium Account Pill */}
              <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1 pl-3 pr-4 shadow-sm gap-3 relative group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{user.name}</span>
                </div>
                <div className="w-px h-4 bg-zinc-200"></div>
                <button 
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-red-650 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <SignOut size={18} weight="bold" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/login")}
                className="text-sm font-semibold text-zinc-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Đăng nhập
              </button>
              <button 
                onClick={() => navigate("/register")}
                className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-800 transition-colors active:scale-95 cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {logoutMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl"
          >
            {logoutMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
