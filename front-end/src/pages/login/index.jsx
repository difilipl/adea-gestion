import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Index() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit() {
        setErreur("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch {
            setErreur("Email ou mot de passe incorrect");
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSubmit();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        <span className="text-blue-600">ADEA</span>{" "}
                        <span className="text-slate-900">GESTION</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Connectez-vous à votre espace
                    </p>
                </div>

                {/* Carte */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="vous@adea-vb.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                            />
                        </div>

                        {erreur && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-2.5">
                                {erreur}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                        >
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    © {new Date().getFullYear()} ADEA – EI Véronique Bret
                </p>
            </div>
        </div>
    );
}