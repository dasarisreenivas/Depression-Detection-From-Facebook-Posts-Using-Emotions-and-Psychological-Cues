import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    await loginWithGoogle();
    navigate("/home");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white/10 p-8 rounded-xl text-white text-center">
        <h2 className="text-3xl font-bold mb-6">MentalAI</h2>

        <button
          onClick={handleLogin}
          className="bg-white text-black px-6 py-2 rounded"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}