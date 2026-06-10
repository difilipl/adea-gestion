import { useEffect, useState } from 'react'
import Header from "../../components/layout/Header.jsx";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import api from "../../services/axios.js";

const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);


const COLORS = ['#3a7d67', '#c8b99a', '#94a3b8', '#f59e0b']

function getMissionsParMois(missions) {
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
        'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const counts = Array(12).fill(0)
    missions.forEach(m => {
        if (m.date_debut) {
            const date = new Date(m.date_debut)
            counts[date.getMonth()]++
        }
    })
    return mois.map((nom, i) => ({ mois: nom, missions: counts[i] }))
}

function getMissionsParStatut(missions) {
    const counts = {}
    missions.forEach(m => {
        const statut = m.statut || 'Non défini'
        counts[statut] = (counts[statut] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

export default function Index() {
    const [missions, setMissions] = useState([])

    useEffect(() => {
        api.get('http://localhost:8000/api/missions')
            .then(response => {
                setMissions(response.data.member || [])
            })
            .catch(error => {
                console.error("Erreur API:", error)
            })
    }, [])

    const missionsParMois = getMissionsParMois(missions)
    const missionsParStatut = getMissionsParStatut(missions)

    return (
        <>
            <Header titre="Vue globale" />
            <div className="flex-1 overflow-y-auto p-8">

                {/* Titre */}
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-950 mb-1.5 tracking-tight">Bonjour</h1>
                    <p className="text-slate-600">Synthèse de l'activité pour la journée
                        du {new Date().toLocaleDateString('fr-FR', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { title: 'Missions totales', value: missions.length },
                        { title: 'En cours de traitement', value: missions.filter(m => m.statut !== 'Terminé' && m.statut !== 'en attente').length },
                        { title: 'Nouveaux messages', value: 0 },
                    ].map(card => (
                        <div key={card.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-sm text-slate-500 font-medium mb-1.5">{card.title}</p>
                            <p className="text-4xl font-black text-slate-950 tracking-tight">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                    {/* Barres */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Missions par mois</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={missionsParMois}>
                                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="missions" fill="#3a7d67" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Camembert */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Répartition par statut</h3>
                        {missionsParStatut.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={missionsParStatut}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {missionsParStatut.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-52 text-slate-400 text-sm">
                                Aucune donnée disponible
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}