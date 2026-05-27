import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header.jsx";

export default function Index() {
    const navigate = useNavigate();


    const IconEtapes = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-9.75-10.5h.375c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H4.875a1.125 1.125 0 0 1-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125h.375Z" />
        </svg>
    );

    const IconMissions = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.099.277-4.223.42-6.378.42s-4.279-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38a3.788 3.788 0 0 1-2.404 0 3.787 3.787 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 12 11.106a2.18 2.18 0 0 1-1.668.748m1.668-3.007a.75.75 0 1 1-3 0 .75.75 0 0 1 3 0ZM3 8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
        </svg>
    );

    const IconDocuments = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    );

    const sections = [
        {
            titre: "Les Étapes",
            description: "ajouter des étapes type, qui reviennent souvent",
            path: "/registry/etapes",
            Icone: IconEtapes
        },
        {
            titre: "Les modèle de Missions",
            description: "Consultez la liste complète de vos missions type, definissé un ordre a vos étapes précédement créé",
            path: "/registry/missions",
            Icone: IconMissions
        },
        {
            titre: "Les Documents",
            description: "une banque de documents prérempli afin depouvoir rapidement les récuperer et les affecter a un client",
            path: "/registry/documents",
            Icone: IconDocuments
        }
    ];

    return (
        <>
            <Header titre="TABLEAU DE BORD REGISTRY" />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Raccourcis de gestion</h2>
                            <p className="text-sm text-gray-500">Sélectionnez un espace pour commencer à travailler.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sections.map((item, index) => {
                            const { Icone } = item;

                            return (
                                <div
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                            <Icone className="w-6 h-6" />
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                            {item.titre}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="text-sm text-blue-500 font-medium flex items-center mt-6 opacity-80 group-hover:opacity-100 transition-opacity">
                                        Ouvrir l'espace <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}