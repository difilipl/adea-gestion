import { useState, useEffect } from "react";
import api from "../services/axios.js";
import { isAdmin } from "../services/auth.js";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const [loading, setLoading] = useState(false);

    const admin = isAdmin();

    async function chargerUsers() {
        try {
            const { data } = await api.get("/api/utilisateurs");
            // API Platform renvoie soit un tableau, soit { "member": [...] } en JSON-LD
            setUsers(data.member || data["hydra:member"] || data);
        } catch {
            setErreur("Impossible de charger les utilisateurs");
        }
    }

    useEffect(() => {
        if (admin) chargerUsers();
    }, [admin]);

    async function ajouterUser() {
        setErreur("");
        setLoading(true);
        try {
            await api.post("/api/utilisateurs", {
                email,
                roles: ["ROLE_USER"],
                plainPassword: password,
            });
            setEmail("");
            setPassword("");
            chargerUsers();
        } catch {
            setErreur("Erreur lors de la création (email déjà utilisé ?)");
        } finally {
            setLoading(false);
        }
    }

    async function supprimerUser(id) {
        if (!confirm("Supprimer cet utilisateur ?")) return;
        try {
            await api.delete(`/api/utilisateurs/${id}`);
            chargerUsers();
        } catch {
            setErreur("Erreur lors de la suppression");
        }
    }

    // Si pas admin, on n'affiche rien du tout
    if (!admin) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Gestion des utilisateurs
            </h2>
            <p className="text-sm text-slate-500 mb-5">
                Ajoutez ou supprimez les comptes ayant accès à l'application.
            </p>

            {erreur && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-2.5 mb-4">
                    {erreur}
                </div>
            )}

            {/* Formulaire d'ajout */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="email"
                    placeholder="Email du nouvel utilisateur"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                />
                <button
                    onClick={ajouterUser}
                    disabled={loading || !email || !password}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition whitespace-nowrap"
                >
                    {loading ? "Ajout..." : "Ajouter"}
                </button>
            </div>

            {/* Liste */}
            <div className="divide-y divide-slate-100">
                {users.length === 0 && (
                    <p className="text-sm text-slate-400 py-4">Aucun utilisateur.</p>
                )}
                {users.map((u) => (
                    <div key={u.id} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-slate-900 font-medium">{u.email}</p>
                            <p className="text-xs text-slate-400">
                                {(u.roles || []).includes("ROLE_ADMIN") ? "Administrateur" : "Utilisateur"}
                            </p>
                        </div>
                        {!(u.roles || []).includes("ROLE_ADMIN") && (
                            <button
                                onClick={() => supprimerUser(u.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                            >
                                Supprimer
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}