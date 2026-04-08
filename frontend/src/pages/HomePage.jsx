import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { BarChart3, Activity, HeartPulse } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HomePage() {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  const depressed = history.filter(h => h.prediction === "Depressed").length;
  const normal = history.length - depressed;

  const data = [
    { name: "Depressed", value: depressed },
    { name: "Healthy", value: normal },
  ];

  const COLORS = ["#ff4d6d", "#4ade80"];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* 🔥 HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="text-purple-500" />
            Dashboard Overview
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor mental health analytics in real-time
          </p>
        </motion.div>

        {/* 📊 STATS CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* TOTAL */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-700 
            p-6 rounded-2xl shadow-md"
          >
            <p className="text-gray-500 dark:text-gray-400">Total Scans</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {history.length}
            </h2>
          </motion.div>

          {/* DEPRESSED */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-700 
            p-6 rounded-2xl shadow-md"
          >
            <div className="flex items-center gap-2 text-red-500">
              <HeartPulse size={18} />
              <p>Depressed Cases</p>
            </div>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {depressed}
            </h2>
          </motion.div>

          {/* HEALTHY */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-700 
            p-6 rounded-2xl shadow-md"
          >
            <div className="flex items-center gap-2 text-green-500">
              <Activity size={18} />
              <p>Healthy Cases</p>
            </div>

            <h2 className="text-3xl font-bold text-green-500 mt-2">
              {normal}
            </h2>
          </motion.div>
        </div>

        {/* 📈 CHART + INSIGHTS */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* PIE CHART */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-700 
            p-6 rounded-3xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Mental Health Distribution
            </h2>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 🧠 AI INSIGHTS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 to-blue-500 
            text-white p-6 rounded-3xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">
              AI Insights
            </h2>

            <p className="text-sm opacity-90">
              {history.length === 0 && "No data available yet."}

              {history.length > 0 &&
                (depressed > normal
                  ? "⚠️ High risk detected. Many users show depressive patterns."
                  : "✅ Most users appear mentally stable. Keep monitoring trends.")}
            </p>

            <div className="mt-6 text-sm opacity-80">
              Total Analysis: {history.length}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}