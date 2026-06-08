import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AirplaneTilt, Ticket, ArrowLeft, CircleNotch, CalendarBlank, UserCircle, CurrencyCircleDollar, Clock } from "@phosphor-icons/react";
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

const CountdownTimer = ({ createdAt, onExpire }) => {
  const [minutesLeft, setMinutesLeft] = useState(null);

  useEffect(() => {
    const calculateTime = () => {
      // Parse created_at (assumes it's either UTC with 'Z' or local, adjust if needed)
      // Thêm 'Z' nếu chuỗi ngày tháng từ server không có múi giờ để đảm bảo đúng UTC
      const dateStr = createdAt.endsWith('Z') ? createdAt : createdAt + 'Z';
      const createdTime = new Date(dateStr).getTime();
      const now = new Date().getTime();
      const diffMs = (createdTime + 5 * 60 * 1000) - now;
      
      if (diffMs <= 0) {
        setMinutesLeft(0);
        if (onExpire) onExpire();
      } else {
        setMinutesLeft(Math.ceil(diffMs / 60000));
      }
    };

    calculateTime();
    // Cập nhật mỗi 1 phút (60000ms) theo yêu cầu
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [createdAt, onExpire]);

  if (minutesLeft === null || minutesLeft <= 0) return null;

  return (
    <span className="text-amber-600 font-bold ml-2 text-xs flex items-center gap-1 mt-1 animate-pulse">
      <Clock size={14} /> Hủy sau {minutesLeft} phút
    </span>
  );
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/bookings", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (response.ok && data.status === "success") {
          setBookings(data.data);
        } else {
          setError(data.message || "Lỗi khi tải lịch sử vé.");
        }
      } catch (err) {
        console.error(err);
        setError("Không thể kết nối tới máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch(status) {
      case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "paid": return "Đã thanh toán";
      case "pending": return "Chờ thanh toán";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans pb-24 pt-24 selection:bg-blue-600 selection:text-white"
    >
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Quay lại trang chủ */}
        <div className="mb-8 -ml-3">
          <BackButton />
        </div>

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Lịch sử đặt vé
            </h1>
            <p className="text-zinc-500 font-medium">
              Quản lý và xem lại các hành trình của bạn cùng Skylink.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-4">
            <CircleNotch size={40} className="animate-spin" />
            <p className="font-medium text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 border border-red-100 p-8 rounded-[2rem] text-center font-medium">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-zinc-200 p-16 rounded-[2rem] text-center shadow-sm"
          >
            <Ticket size={64} weight="duotone" className="mx-auto text-zinc-300 mb-6" />
            <h3 className="text-xl font-bold mb-3 text-zinc-900">Chưa có chuyến đi nào</h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-medium">
              Bạn chưa thực hiện bất kỳ giao dịch đặt vé nào. Hãy bắt đầu lên kế hoạch cho chuyến đi tiếp theo của bạn.
            </p>
            <button 
              onClick={() => navigate("/flights")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-[0.98]"
            >
              Tìm chuyến bay ngay
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, idx) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-white border border-zinc-200 p-8 rounded-[2rem] hover:shadow-md hover:border-zinc-300 transition-all group"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
                  
                  {/* Status & ID */}
                  <div className="w-full lg:w-1/4 space-y-5">
                    <div>
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </div>
                      {booking.status === "pending" && (
                        <CountdownTimer 
                          createdAt={booking.created_at} 
                          onExpire={() => {
                            // Gọi lại hàm fetchBookings để load lại trạng thái thành cancelled
                            // Dùng reload trang cho đơn giản hoặc update state
                            window.location.reload();
                          }} 
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Ticket size={14} /> Mã đặt chỗ (PNR)
                      </p>
                      <p className="text-2xl font-bold tracking-widest text-zinc-900">{booking.pnr_code}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <CalendarBlank size={14} /> Ngày đặt
                      </p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {new Date(booking.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  {/* Flight Route */}
                  <div className="flex-1 border-y lg:border-y-0 lg:border-x border-zinc-100 py-6 lg:py-0 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <p className="text-4xl font-bold tracking-tighter text-zinc-900">{booking.flight.departure_airport?.code}</p>
                      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-2">
                        {new Date(booking.flight.departure_time).toLocaleTimeString("vi-VN", {hour: "2-digit", minute:"2-digit"})}
                      </p>
                    </div>
                    <div className="flex-1 w-full md:w-auto flex flex-col items-center relative">
                      <div className="w-full h-[2px] bg-zinc-100"></div>
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-zinc-300">
                        <AirplaneTilt size={20} weight="fill" />
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-4 text-zinc-400">Bay thẳng</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-4xl font-bold tracking-tighter text-zinc-900">{booking.flight.arrival_airport?.code}</p>
                      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-2">
                        {new Date(booking.flight.arrival_time).toLocaleTimeString("vi-VN", {hour: "2-digit", minute:"2-digit"})}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="w-full lg:w-1/4 flex flex-col justify-center space-y-6 lg:pl-4">
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <UserCircle size={14} /> {booking.tickets?.length || 0} Hành khách
                      </p>
                      <div className="space-y-1">
                        {booking.tickets?.map((t, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="font-bold text-zinc-900 uppercase truncate max-w-[120px]" title={t.passenger_name}>
                              {t.passenger_name}
                            </span>
                            <span className="bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-bold">
                              Ghế {t.seat?.seat_number || "N/A"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <CurrencyCircleDollar size={14} /> Tổng tiền
                      </p>
                      <p className="text-2xl font-bold tracking-tighter text-zinc-900">
                        {formatCurrency(booking.total_amount)}
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
