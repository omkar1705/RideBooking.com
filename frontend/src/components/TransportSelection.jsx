import bikeIcon from "../assets/images/bike.png";
import carIcon from "../assets/images/car.png";
import electricBikeIcon from "../assets/images/electric-bike.png";
import busIcon from "../assets/images/bus.png";

// src/components/TransportSelection.jsx
const transportOptions = [
  {
    id: "car",
    name: "Car",
    icon: <img src={carIcon} alt="Car" className="w-8 h-8" />,
    pricePerKm: 15,
  },
  {
    id: "bike",
    name: "Bike",
    icon: <img src={bikeIcon} alt="Bike" className="w-8 h-8" />,
    pricePerKm: 10,
  },
  {
    id: "electric_bike",
    name: "Electric Bike",
    icon: (
      <img src={electricBikeIcon} alt="Electric Bike" className="w-8 h-8" />
    ),
    pricePerKm: 12,
  },
  {
    id: "bus",
    name: "Bus",
    icon: <img src={busIcon} alt="Bus" className="w-8 h-8" />,
    pricePerKm: 8,
  },
];

export default function TransportSelection({ selectedTransport, onSelect }) {
  return (
    <div className="space-y-4">
      {transportOptions.map((transport) => (
        <button
          key={transport.id}
          type="button"
          onClick={() => onSelect(transport)}
          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
            selectedTransport?.id === transport.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center space-x-4">
            <span className="text-2xl">{transport.icon}</span>
            <span className="font-medium">{transport.name}</span>
          </div>
          <span className="text-gray-600">₹{transport.pricePerKm}/km</span>
        </button>
      ))}
    </div>
  );
}
