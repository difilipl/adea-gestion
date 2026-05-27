import GanttBarre from "./GanttBarre.jsx";
import {useState} from "react";


export default function GanttLigne({mission, viewStart, viewEnd}) {
    const [isOpen, setIsOpen] = useState(false);

    const hasSteps = mission.etapes && mission.etapes.length > 0;

    const getBadgeClass = (statut) => {
        if (!statut) return 'bg-gray-200 text-gray-600';
        if (statut.toLowerCase() === 'terminé' || statut.toLowerCase() === 'terminée') return 'bg-green-200 text-green-800';
        if (statut.toLowerCase() === 'en cours') return 'bg-blue-200 text-blue-800';
        return 'bg-gray-200 text-gray-800';
    };

    const getMissionColor = (statut) => {
        if (statut && statut.toLowerCase().includes('terminé')) return 'bg-green-600';
        return 'bg-blue-500';
    };
    return (
        <>
            <div className="flex border-b border-gray-200 min-h-[50px] items-center hover:bg-gray-50 bg-white">

                <div className="w-1/4 p-3 border-r border-gray-200 flex items-center">
                    {hasSteps ? (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="mr-2 text-xs text-gray-500 hover:text-gray-800 w-4 text-center cursor-pointer"
                        >
                            {isOpen ? '▼' : '▶'}
                        </button>
                    ) : (
                        <span className="mr-2 w-4"></span>
                    )}

                    <span className="font-medium text-sm text-gray-800 truncate pr-2 flex-1">
                        {mission.titre}
                    </span>

                    <span className={`text-xs px-2 py-0.5 rounded-sm whitespace-nowrap ${getBadgeClass(mission.statut)}`}>
                        {mission.statut || "Non défini"}
                    </span>
                </div>

                <div className="w-3/4 relative h-full min-h-[50px]">
                    <GanttBarre
                        startDate={mission.date_debut}
                        endDate={mission.date_fin_prevue}
                        viewStart={viewStart}
                        viewEnd={viewEnd}
                        color={getMissionColor(mission.statut)}
                    />
                </div>
            </div>

            {isOpen && hasSteps && mission.etapes.map((etape) => (
                <div key={etape.id} className="flex border-b border-gray-200 min-h-[40px] items-center bg-[#F9F9F6]">

                    <div className="w-1/4 p-3 pl-10 border-r border-gray-200 flex items-center">
                        <span className="text-gray-400 mr-2 text-xs">
                            {etape.est_terminee ? '✓' : '○'}
                        </span>
                        <span className="text-sm text-gray-600 truncate flex-1">
                            {etape.type_etape?.nom || "Étape en cours"}
                        </span>
                    </div>

                    <div className="w-3/4 relative h-full min-h-[40px]">
                        <GanttBarre
                            startDate={etape.date_debut}
                            endDate={etape.date_fin_prevue}
                            viewStart={viewStart}
                            viewEnd={viewEnd}
                            color={etape.est_terminee ? 'bg-[#A3C77E]' : 'bg-blue-300'}
                            isStep={true}
                        />
                    </div>
                </div>
            ))}



        </>

    );

}