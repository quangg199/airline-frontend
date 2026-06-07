import { motion } from "motion/react";
import { AirplaneTilt, SuitcaseRolling, Clock } from "@phosphor-icons/react";

/**
 * FlightCard Presentational Component (Dark Theme)
 * Displays a single flight's details.
 * Design: Bento-cell layout, Hover physics (Motion: 7), Density: 5.
 */
export default function FlightCard({ flight, onSelect }) {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const departureTime = new Date(flight.departure_time);
  const arrivalTime = new Date(flight.arrival_time);
  const durationMs = arrivalTime - departureTime;
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        hover: { type: "spring", stiffness: 400, damping: 22 },
      }}
      className="bg-blue-950/95 backdrop-blur-md rounded-[2rem] p-6 border border-blue-900/50 shadow-lg hover:shadow-xl hover:border-blue-800/50 transition-all duration-300 w-full list-none"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Timing & Route */}
        <div className="flex-1 flex items-center gap-4 md:gap-8">
          <div className="text-center min-w-[70px]">
            <div className="text-2xl font-bold tracking-tight text-white">
              {formatTime(flight.departure_time)}
            </div>
            <div className="text-xs font-bold text-blue-300/80 mt-1 uppercase tracking-wider">
              {flight.departure_airport?.code || flight.departure_airport_id}
            </div>
          </div>

          {/* Timeline Connector with glowing blue airplane */}
          <div className="flex-1 flex flex-col items-center relative px-2">
            <div className="text-xs font-semibold text-blue-200/80 mb-2 flex items-center gap-1.5">
              <Clock weight="bold" size={14} className="text-blue-400" /> {durationHours}h {durationMinutes}m
            </div>
            <div className="w-full h-[2px] bg-blue-900/55 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-400 bg-blue-950 border border-blue-900/60 px-2 py-0.5 rounded-full flex items-center">
                <AirplaneTilt size={16} weight="fill" className="text-blue-400 transform rotate-90" />
              </div>
            </div>
            <div className="text-[9px] text-blue-400/90 mt-2 font-bold tracking-widest uppercase">
              BAY THẲNG
            </div>
          </div>

          <div className="text-center min-w-[70px]">
            <div className="text-2xl font-bold tracking-tight text-white">
              {formatTime(flight.arrival_time)}
            </div>
            <div className="text-xs font-bold text-blue-300/80 mt-1 uppercase tracking-wider">
              {flight.arrival_airport?.code || flight.arrival_airport_id}
            </div>
          </div>
        </div>

        {/* Middle: Amenities & Flight Details */}
        <div className="flex-none md:w-48 flex flex-col justify-center gap-2.5 border-l-0 md:border-l border-blue-900/40 md:pl-6">
          <div className="flex items-center gap-2 text-sm text-blue-100/90">
            <SuitcaseRolling weight="duotone" className="text-blue-400" size={18} />
            <span>20kg Ký gửi miễn phí</span>
          </div>
          <div className="text-[10px] text-blue-300 font-semibold bg-blue-900/30 border border-blue-800/40 inline-flex px-2.5 py-1 rounded-lg w-fit uppercase tracking-wider">
            {flight.flight_number} • {flight.aircraft?.model || "A320neo"}
          </div>
        </div>

        {/* Right: Pricing & Action */}
        <div className="flex-none md:w-56 flex flex-col items-end justify-center pt-4 md:pt-0 border-t md:border-t-0 border-blue-900/40 md:pl-6">
          <div className="text-[10px] font-bold text-blue-300/70 mb-1 uppercase tracking-wider">
            Giá vé trọn gói
          </div>
          <div className="text-2xl md:text-3xl font-extrabold tracking-tighter text-white text-right mb-4">
            {formatCurrency(flight.base_price)}
          </div>
          <button
            onClick={() => onSelect(flight)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] active:scale-95 transition-all duration-200 outline-none cursor-pointer text-sm"
          >
            Chọn chuyến bay
          </button>
        </div>

      </div>
    </motion.li>
  );
}
