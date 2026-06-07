import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { AirplaneTakeoff, MapPinLine, CalendarBlank, ArrowsLeftRight, Users, PaperPlaneTilt } from "@phosphor-icons/react";
import Navbar from "../components/Navbar";

/**
 * HomePage Smart Component
 * Premium Light Theme, High Variance Layout, Modern Utility Classes.
 */
export default function HomePage() {
  const navigate = useNavigate();
  
  const [airports, setAirports] = useState([]);
  const [searchData, setSearchData] = useState({
    departure: "",
    arrival: "",
    date: "",
    tripType: "one-way",
    flightClass: "economy",
    passengers: { adults: 1, children: 0 }
  });
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  const handleUpdatePassengers = (type, change) => {
    setSearchData(prev => {
      const current = prev.passengers[type];
      const next = Math.max(0, current + change);
      if (type === 'adults' && next < 1) return prev;
      return {
        ...prev,
        passengers: {
          ...prev.passengers,
          [type]: next
        }
      };
    });
  };

  const handleSwap = () => {
    setSearchData(prev => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure
    }));
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/airports")
      .then(res => setAirports(res.data.data || []))
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    if (!searchData.departure || !searchData.arrival) {
      alert("Vui lòng chọn đầy đủ điểm đi và điểm đến.");
      return;
    }
    localStorage.setItem("search_params", JSON.stringify(searchData));
    navigate("/flights");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans font-medium selection:bg-blue-600 selection:text-white"
    >
      
      {/* 1. TOP NAVIGATION */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
        {/* Background Image Area - 16:9 Aspect Ratio Container */}
        <div className="w-full max-w-7xl h-[60vh] md:h-[70vh] rounded-[2rem] overflow-hidden relative shadow-sm">
          <img 
            src="/hero-bg.png" 
            alt="Airplane wing in the sky" 
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-16 max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
              Khám phá thế giới <br/> với sự tĩnh lặng.
            </h1>
            <p className="text-lg text-white/90 font-medium max-w-[45ch]">
              Trải nghiệm hàng không chuẩn 5 sao. Không ồn ào, không rườm rà. Chỉ có bạn và hành trình phía trước.
            </p>
          </div>
        </div>

        {/* Floating Search Bento Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="relative z-10 w-full max-w-5xl bg-white border border-zinc-200 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-zinc-200/50 -mt-16 md:-mt-24"
        >
          {/* Search Panel Top Row: Toggles (Bento Search Engine) */}
          <div className="flex flex-wrap gap-4 mb-6 border-b border-zinc-100 pb-4 justify-between items-center relative z-20">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSearchData(prev => ({ ...prev, tripType: 'one-way' }))}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  searchData.tripType === 'one-way'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Một chiều
              </button>
              <button
                type="button"
                onClick={() => setSearchData(prev => ({ ...prev, tripType: 'round-trip' }))}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  searchData.tripType === 'round-trip'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Khứ hồi
              </button>
            </div>

            <div className="flex gap-4 items-center">
              {/* Flight Class Toggle */}
              <div className="flex gap-2 bg-zinc-50 p-1 rounded-full border border-zinc-200/60">
                <button
                  type="button"
                  onClick={() => setSearchData(prev => ({ ...prev, flightClass: 'economy' }))}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    searchData.flightClass === 'economy'
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  Phổ thông
                </button>
                <button
                  type="button"
                  onClick={() => setSearchData(prev => ({ ...prev, flightClass: 'business' }))}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    searchData.flightClass === 'business'
                      ? 'bg-blue-950 text-blue-100 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  Thương gia
                </button>
              </div>

              {/* Passenger Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 bg-zinc-50 border border-zinc-200 transition-all cursor-pointer"
                >
                  <Users size={14} /> {searchData.passengers.adults + searchData.passengers.children} Khách
                </button>

                {showPassengerDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowPassengerDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200/60 rounded-2xl p-4 shadow-xl z-30">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-zinc-900">Người lớn</div>
                            <div className="text-xs text-zinc-400">Từ 12 tuổi</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('adults', -1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold text-zinc-900 w-4 text-center">{searchData.passengers.adults}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('adults', 1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-zinc-900">Trẻ em</div>
                            <div className="text-xs text-zinc-400">Dưới 12 tuổi</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('children', -1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold text-zinc-900 w-4 text-center">{searchData.passengers.children}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePassengers('children', 1)}
                              className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-400 text-zinc-600 transition-colors cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end relative z-10">
            {/* Swap Button absolute positioned in between Departure (col 1) and Arrival (col 2) */}
            <div className="hidden md:flex absolute left-[23.5%] top-[55%] -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.button 
                type="button"
                onClick={handleSwap}
                whileHover={{ scale: 1.15, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-200 cursor-pointer transition-colors"
                title="Đổi điểm đi/điểm đến"
              >
                <ArrowsLeftRight size={14} weight="bold" />
              </motion.button>
            </div>
            
            {/* Điểm đi */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <AirplaneTakeoff size={14} /> Khởi hành
              </label>
              <select 
                className="w-full h-14 bg-zinc-50 border border-zinc-200 text-zinc-900 text-base font-semibold px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer transition-all"
                value={searchData.departure}
                onChange={(e) => setSearchData({...searchData, departure: e.target.value})}
              >
                <option value="">Chọn điểm đi</option>
                {airports.map(ap => (
                  <option key={ap.id} value={ap.iata_code}>{ap.city} ({ap.iata_code})</option>
                ))}
              </select>
            </div>

            {/* Điểm đến */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <MapPinLine size={14} /> Điểm đến
              </label>
              <select 
                className="w-full h-14 bg-zinc-50 border border-zinc-200 text-zinc-900 text-base font-semibold px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer transition-all"
                value={searchData.arrival}
                onChange={(e) => setSearchData({...searchData, arrival: e.target.value})}
              >
                <option value="">Bạn muốn đến đâu?</option>
                {airports.map(ap => (
                  <option key={ap.id} value={ap.iata_code}>{ap.city} ({ap.iata_code})</option>
                ))}
              </select>
            </div>

            {/* Ngày đi */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <CalendarBlank size={14} /> Ngày đi
              </label>
              <input 
                type="text" 
                placeholder="Chọn ngày đi"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
                className="w-full h-14 bg-zinc-50 border border-zinc-200 text-zinc-900 text-base font-semibold px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-zinc-400"
                value={searchData.date}
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
              />
            </div>

            {/* CTA */}
            <motion.button 
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-xl transition-all shadow-[0_8px_30px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.35)] cursor-pointer"
            >
              Tìm chuyến bay
            </motion.button>

          </div>
        </motion.div>
      </section>

      {/* 3. DỊCH VỤ NỔI BẬT (Bento Grid Style) */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 overflow-hidden">
        {/* Quầng sáng môi trường phía sau các thẻ dịch vụ */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-16 text-center md:text-left bg-gradient-to-r from-zinc-900 via-zinc-800 to-blue-900 bg-clip-text text-transparent">
          Dịch vụ đẳng cấp
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Suất ăn hạng nhất", desc: "Thực đơn tinh tuyển theo mùa, chế biến bởi bếp trưởng danh tiếng quốc tế.", link: "/services", btnText: "Xem thực đơn" },
            { title: "Phòng chờ thương gia", desc: "Không gian tĩnh lặng, đầy đủ tiện nghi đẳng cấp trước khi cất cánh.", featured: true, link: "/services", btnText: "Khám phá ngay" },
            { title: "Hành lý linh hoạt", desc: "Các gói hành lý đa dạng, dễ dàng thêm bớt theo nhu cầu thực tế.", link: "/services", btnText: "Mua thêm hành lý" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ 
                y: -8, 
                scale: 1.02, 
                transition: { type: "spring", stiffness: 300, damping: 22 } 
              }}
              className={`group relative bg-white/70 backdrop-blur-md border rounded-[2rem] p-8 transition-all duration-300 flex flex-col justify-between
                ${item.featured 
                  ? "border-blue-200/60 shadow-[0_12px_40px_rgba(37,99,235,0.06)] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-gradient-to-r before:from-blue-500 before:to-indigo-500 before:rounded-t-[2rem]" 
                  : "border-zinc-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:border-zinc-300/60"
                }
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]
              `}
            >
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/15 text-blue-600 font-bold rounded-2xl flex items-center justify-center mb-8 text-xl tracking-tight transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.2)]">
                  0{index + 1}
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4 transition-colors duration-300 group-hover:text-blue-900">
                  {item.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed text-lg font-medium tracking-wide mb-8">
                  {item.desc}
                </p>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.link)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer text-center block
                  ${item.featured 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.15)]" 
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                  }
                `}
              >
                {item.btnText}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <PaperPlaneTilt weight="fill" className="text-zinc-300" size={24} />
        </div>
        <p className="text-sm text-zinc-400 font-medium">
          © 2026 Skylink Aviation. Thiết kế bởi Antigravity.
        </p>
      </footer>

    </motion.div>
  );
}