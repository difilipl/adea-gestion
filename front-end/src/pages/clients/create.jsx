import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header.jsx";

export default function Create() {
    const navigate = useNavigate();

    const IconPro = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    );

    const IconParticulier = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );

    const types = [
        {
            titre: "Client Professionnel",
            description: "Créez un compte pour une entreprise ou un professionnel. Vous pourrez renseigner le nom de l'entreprise, le SIRET et les contacts associés.",
            path: "/clients/create_business",
            Icone: IconPro
        },
        {
            titre: "Client Particulier",
            description: "Créez un compte pour un particulier. Vous renseignerez son nom, prénom, email et numéro de téléphone.",
            path: "/clients/create_personal",
            Icone: IconParticulier
        }
    ];

    return (
        <>
            <Header titre="Nouveau client" />

            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800">Quel type de client souhaitez-vous créer ?</h2>
                        <p className="text-sm text-gray-500 mt-1">Sélectionnez le profil correspondant à votre nouveau client.</p>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/clients')}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Retour à la liste des clients
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {types.map((item, index) => {
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
                                        Sélectionner <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
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