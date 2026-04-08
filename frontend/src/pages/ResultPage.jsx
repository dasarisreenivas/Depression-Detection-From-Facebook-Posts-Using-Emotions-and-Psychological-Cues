import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResultPage() {
  const { state } = useLocation();

  // 🛑 If no data
  if (!state) {
    return <p className="p-6">No data available</p>;
  }

  // ✅ FIX 1: Keep probability as number
  const probability = state.confidence * 100;

  // ✅ FIX 2: Safe access for details
  const details = state.details || {
    text: 0,
    image: 0,
    video: 0,
  };

  const data = [
    { name: "Text", value: (details.text || 0) * 100 },
    { name: "Image", value: (details.image || 0) * 100 },
    { name: "Video", value: (details.video || 0) * 100 },
  ];

  // ✅ FIX 3: Safe reduce
  const primarySignal =
    Object.keys(details).length > 0
      ? Object.keys(details).reduce((a, b) =>
          details[a] > details[b] ? a : b
        )
      : "N/A";

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Mental Health Analysis
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1">
            Multimodal prediction insights
          </p>
        </motion.div>

        {/* TOP GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* 🧠 CONFIDENCE CIRCLE */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-900 border 
            border-gray-200 dark:border-gray-700 
            p-6 rounded-3xl shadow-lg flex flex-col items-center"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Confidence
            </p>

            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="transparent"
                />

                <motion.circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#8b5cf6"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (377 * probability) / 100}
                  initial={{ strokeDashoffset: 377 }}
                  animate={{
                    strokeDashoffset:
                      377 - (377 * probability) / 100,
                  }}
                  transition={{ duration: 1.2 }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white">
                {probability.toFixed(2)}%
              </div>
            </div>

            {/* STATUS */}
            <span
              className={`mt-4 px-4 py-1 rounded-full text-sm font-semibold ${
                state.prediction === "Depressed"
                  ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300"
                  : "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300"
              }`}
            >
              {state.prediction || "Unknown"}
            </span>
          </motion.div>

          {/* 📈 TREND CHART */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 bg-white dark:bg-gray-900 border 
            border-gray-200 dark:border-gray-700 
            p-6 rounded-3xl shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Contribution Trend
            </h2>

            <div className="h-52">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <XAxis dataKey="name" stroke="#888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* 📊 PROGRESS BARS */}
        <div
          className="bg-white dark:bg-gray-900 border 
          border-gray-200 dark:border-gray-700 
          p-6 rounded-3xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">
            Detailed Breakdown
          </h2>

          {["text", "image", "video"].map((key) => {
            const value = ((details[key] || 0) * 100).toFixed(1);

            return (
              <div key={key} className="mb-5">
                <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-300">
                  <span className="capitalize">{key}</span>
                  <span>{value}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1 }}
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 🧠 AI INSIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-900 border 
          border-gray-200 dark:border-gray-700 
          p-6 rounded-3xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            AI Insight
          </h2>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            The system detected{" "}
            <span className="font-semibold text-purple-500">
              {state.prediction || "Unknown"}
            </span>{" "}
            with <b>{probability.toFixed(2)}% confidence</b>.
            <br /><br />
            <b>Primary signal:</b> {primarySignal}
            <br /><br />
            This suggests emotional patterns are primarily influenced by this modality.
          </p>
        </motion.div>

      </div>
    </Layout>
  );
}