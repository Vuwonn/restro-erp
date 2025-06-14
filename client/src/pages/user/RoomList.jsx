import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "@/components/custumer/RoomCard";
import { ROOM_API_END_POINT } from "@/utils/constant";

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roomType, setRoomType] = useState("All");
  const [capacity, setCapacity] = useState("All");

  useEffect(() => {
    axios
      .get(`${ROOM_API_END_POINT}/getrooms`)
      .then((res) => {
        setRooms(res.data);
        setFilteredRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...rooms];

    if (roomType !== "All") {
      filtered = filtered.filter((room) => room.roomType === roomType);
    }

    if (capacity !== "All") {
      filtered = filtered.filter(
        (room) => String(room.capacity) === capacity
      );
    }

    setFilteredRooms(filtered);
  }, [roomType, capacity, rooms]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-10 px-6 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2">🏨 Book Your Perfect Room</h1>
        <p className="text-lg">Find and book the best rooms for your stay</p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mt-8 px-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4 flex-wrap">
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="px-4 py-2 rounded-lg shadow bg-white border"
          >
            <option value="All">All Room Types</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
          </select>

          <select
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="px-4 py-2 rounded-lg shadow bg-white border"
          >
            <option value="All">All Capacities</option>
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="3">3 People</option>
            <option value="4">4+ People</option>
          </select>
        </div>

        <button
          onClick={() => {
            setRoomType("All");
            setCapacity("All");
          }}
          className="text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Room Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-6 pb-10">
        {loading ? (
          <p className="text-center text-gray-600 text-lg mt-10">Loading rooms...</p>
        ) : filteredRooms.length === 0 ? (
          <p className="text-center text-gray-600 text-lg mt-10">No rooms found matching your filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsList;
