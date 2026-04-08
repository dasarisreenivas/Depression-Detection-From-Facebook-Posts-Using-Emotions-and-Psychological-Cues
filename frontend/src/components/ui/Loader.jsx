import { motion } from "framer-motion";

export default function Loader({ text }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
      />

      <p className="text-white mt-4">{text}</p>
    </div>
  );
}