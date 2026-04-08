export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-xl 
      bg-gradient-to-r from-primary to-secondary 
      text-white shadow-lg hover:scale-105 transition"
    >
      {children}
    </button>
  );
}