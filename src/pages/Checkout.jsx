import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, AirplaneTilt, ArrowRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";

export default function Checkout() {
  const navigate = useNavigate();
  const [passenger, setPassenger] = useState({ name: "", cccd: "" });
  const [loading, setLoading] = useState(false);
  const [flight, setFlight] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const savedFlight = JSON.parse(localStorage.getItem("selected_flight"));
    const savedServices = JSON.parse(localStorage.getItem("selected_services")) || [];

    if (!savedFlight) {
      alert("Không tìm thấy thông tin chuyến bay! Vui lòng chọn lại.");
      navigate("/flights");
      return;
    }

    setFlight(savedFlight);
    setServices(savedServices);
  }, [navigate]);

  if (!flight) return null;

  const basePrice = Number(flight.base_price);
  const servicesTotal = services.reduce((sum, s) => sum + Number(s.price), 0);
  const totalAmount = basePrice + servicesTotal;

  const handleCheckout = async () => {
    if (!passenger.name || !passenger.cccd) {
      alert("Vui lòng nhập đầy đủ Họ tên và Số CCCD/Passport.");
      return;
    }

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    
    if (!token) {
      alert("Bạn cần đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          flight_id: flight.id,
          passenger_name: passenger.name,
          identity_number: passenger.cccd,
          service_ids: services.map(s => s.id)
        })
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        alert("Thanh toán thành công! Mã đặt chỗ của bạn là: " + data.data.pnr_code);
        localStorage.removeItem("selected_flight");
        localStorage.removeItem("selected_services");
        navigate("/my-bookings");
      } else {
        alert("Lỗi đặt vé: " + (data.message || "Vui lòng thử lại."));
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Không thể kết nối tới server.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };
  const formatDate = (timeString) => {
    return new Date(timeString).toLocaleDateString("vi-VN");
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
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Quay lại chọn dịch vụ */}
        <div className="mb-8 -ml-3">
          <BackButton to="/services" label="Quay lại chọn dịch vụ" />
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               Bước 03
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Thanh toán
          </h1>
          <p className="text-zinc-500 font-medium max-w-2xl">
            Hoàn tất thông tin hành khách và thanh toán để nhận mã đặt chỗ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN & PHƯƠNG THỨC */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* THÔNG TIN HÀNH KHÁCH */}
            <section className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-3 text-zinc-900">
                <div className="w-8 h-8 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                Thông tin hành khách
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Họ và Tên</label>
                  <input 
                    type="text" 
                    placeholder="NGUYEN VAN A" 
                    value={passenger.name}
                    onChange={(e) => setPassenger({...passenger, name: e.target.value.toUpperCase()})}
                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold uppercase" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Số CCCD / Passport</label>
                  <input 
                    type="text" 
                    placeholder="Nhập số giấy tờ" 
                    value={passenger.cccd}
                    onChange={(e) => setPassenger({...passenger, cccd: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold" 
                    required
                  />
                </div>
              </div>
            </section>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <section className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-3 text-zinc-900">
                <div className="w-8 h-8 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Thẻ Visa/Master", "Ví MoMo", "Chuyển khoản"].map((method, i) => (
                  <div 
                    key={i} 
                    className={`p-6 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-3
                      ${i === 0 ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-zinc-200 bg-white hover:border-zinc-300"}
                    `}
                  >
                     <CreditCard size={32} weight={i === 0 ? "fill" : "duotone"} className={i === 0 ? "text-blue-600" : "text-zinc-400"} />
                     <span className={`text-sm font-semibold ${i === 0 ? "text-blue-700" : "text-zinc-600"}`}>
                       {method}
                     </span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-zinc-400 font-medium">* Hệ thống đang chọn mặc định thẻ Visa/Master cho quá trình thử nghiệm.</p>
            </section>

          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (STICKY) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] sticky top-8 shadow-sm">
              <h3 className="text-lg font-bold tracking-tight mb-6 text-zinc-900">
                Chi tiết chuyến bay
              </h3>
              
              {/* Tóm tắt Flight */}
              <div className="border-b border-zinc-100 pb-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold tracking-tighter text-zinc-900">{flight.departure_airport?.code}</span>
                  <div className="flex flex-col items-center text-zinc-400 px-4">
                    <AirplaneTilt size={24} weight="fill" />
                  </div>
                  <span className="text-3xl font-bold tracking-tighter text-zinc-900">{flight.arrival_airport?.code}</span>
                </div>
                <p className="text-sm font-semibold text-zinc-500">
                  {flight.flight_number} &bull; {formatTime(flight.departure_time)}, {formatDate(flight.departure_time)}
                </p>
              </div>

              {/* Giá tiền */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Giá vé cơ bản</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(basePrice)}</span>
                </div>
                
                {services.map(s => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span className="text-zinc-500">{s.name}</span>
                    <span className="font-semibold text-zinc-900">+{formatCurrency(s.price)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Thuế, phí</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-6 mb-8 flex justify-between items-end">
                <span className="font-bold uppercase text-zinc-500 text-xs tracking-widest">Tổng thanh toán</span>
                <div className="text-right">
                   <span className="text-3xl font-bold tracking-tighter text-zinc-900 block leading-none mb-1">
                     {formatCurrency(totalAmount)}
                   </span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
                {!loading && <CheckCircle size={20} weight="bold" />}
              </button>

              <p className="mt-6 text-xs text-center text-zinc-400 font-medium leading-relaxed">
                Bằng việc nhấp vào thanh toán, bạn đồng ý với các Điều khoản & Điều kiện của Skylink.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}