import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Trash2, BarChart3 } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function HistoryPage() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  // 🕒 Format DATE + TIME
  const formatTime = (time) => {
  const d = new Date(time);
  return d.toLocaleString();
};

  // 📊 Timeline Chart Data (old → new)
  const chartData = history
    .slice()
    .reverse()
    .map((item) => ({
      time: formatTime(item.time),
      confidence: Number((item.confidence * 100).toFixed(2)),
    }));

  const clearHistory = () => {
    localStorage.removeItem("history");
    window.location.reload();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
              
              <span className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md">
                <BarChart3 size={20} />
              </span>

              Analysis History
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Timeline of AI predictions
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm 
              bg-red-500 text-white rounded-xl shadow-md 
              hover:bg-red-600 transition"
            >
              <Trash2 size={16} />
              Clear
            </button>
          )}
        </motion.div>

        {/* EMPTY STATE */}
        {history.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-900 border 
            border-gray-200 dark:border-gray-700 
            rounded-2xl p-12 text-center shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              No History Yet
            </h2>
            <p className="text-gray-500 mt-2">
              Your predictions will appear here
            </p>
          </motion.div>
        )}

        {/* CONTENT */}
        {history.length > 0 && (
          <>
            {/* 📈 TIMELINE CHART */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
              border border-gray-200 dark:border-gray-700
              p-6 rounded-3xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Confidence Timeline
              </h2>

              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                    <XAxis dataKey="time" stroke="#888" />
                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="confidence"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* 📋 TABLE */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
              border border-gray-200 dark:border-gray-700
              rounded-3xl shadow-lg overflow-hidden"
            >
              <table className="w-full text-left text-gray-900 dark:text-white">

                {/* HEADER */}
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Prediction</th>
                    <th className="p-4">Confidence</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {history.map((item, i) => {
                    const confidence = (item.confidence * 100).toFixed(2);

                    return (
                      <tr
                        key={i}
                        className="border-t border-gray-200 dark:border-gray-700 
                        hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <td className="p-4 font-medium">{i + 1}</td>

                        <td className="p-4 text-sm text-gray-500 dark:text-gray-300">
                          {formatTime(item.time)}
                        </td>

                        <td className="p-4 font-semibold">
                          {item.prediction}
                        </td>

                        <td className="p-4">{confidence}%</td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.prediction === "Depressed"
                                ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300"
                                : "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300"
                            }`}
                          >
                            {item.prediction === "Depressed"
                              ? "⚠️ Risk"
                              : "✅ Safe"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
}