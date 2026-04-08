import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Image, Video } from "lucide-react";

import API from "../services/api";
import Layout from "../components/Layout";

export default function DetectPage() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preview handling
  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    if (!video) return;
    const url = URL.createObjectURL(video);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  // API CALL
  const handleDetect = async () => {
    setError("");

    if (!text && !image && !video) {
      setError("⚠️ Please provide at least one input");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if (text) formData.append("text", text);
      if (image) formData.append("image", image);
      if (video) formData.append("video", video);

      const res = await API.post("/predict", formData);
const history = JSON.parse(localStorage.getItem("history") || "[]");

history.unshift({
  ...res.data,
  time: new Date().toISOString(), // ✅ IMPORTANT FIX
});

localStorage.setItem("history", JSON.stringify(history));

      navigate("/result", { state: res.data });

    } catch (err) {
      console.error(err);
      setError("❌ Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      {/* 🔥 LOADING (PREMIUM AI EFFECT) */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50">
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-6"
          />

          <h2 className="text-xl font-semibold text-white mb-2">
            AI Processing...
          </h2>

          <p className="text-gray-300 text-sm">
            Analyzing your emotional patterns
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Multimodal AI Detection
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Analyze text, images, and videos with advanced AI
          </p>
        </motion.div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 text-red-500 border border-red-400/30 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* 📝 TEXT */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-700 
            p-6 rounded-2xl shadow-md col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-purple-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Text Analysis
              </h2>
            </div>

            <textarea
              placeholder="Write your thoughts..."
              className="w-full h-44 p-4 rounded-lg 
              bg-gray-100 dark:bg-gray-800 
              text-black dark:text-white
              outline-none resize-none focus:ring-2 focus:ring-purple-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <p className="text-xs text-gray-400 mt-2">
              {text.length} characters
            </p>
          </motion.div>

          {/* 📁 MEDIA */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-gray-900 
            border border-gray-200 dark:border-gray-700 
            p-6 rounded-2xl shadow-md"
          >
            <div className="flex items-center gap-2 mb-4">
              <UploadCloud className="text-blue-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Media Upload
              </h2>
            </div>

            {/* IMAGE */}
            <label className="block mb-4 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 
              p-4 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Image className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Upload Image</p>
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                className="mb-4 rounded-lg w-full h-32 object-cover"
              />
            )}

            {/* VIDEO */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 
              p-4 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Video className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Upload Video</p>
              </div>

              <input
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => setVideo(e.target.files?.[0] || null)}
              />
            </label>

            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="mt-4 rounded-lg w-full"
              />
            )}
          </motion.div>
        </div>

        {/* 🚀 ACTION BUTTON */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDetect}
            disabled={loading}
            className="px-12 py-3 rounded-xl text-lg font-semibold shadow-lg
            bg-gradient-to-r from-purple-600 to-blue-600 
            text-white hover:opacity-90 transition disabled:opacity-50"
          >
            Analyze with AI
          </motion.button>
        </div>
      </div>
    </Layout>
  );
}