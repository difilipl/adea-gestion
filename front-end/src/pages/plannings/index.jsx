import {useEffect, useState} from "react";
import axios from "axios";
import GanttControle from "../../components/ui/planning/GanttControle.jsx";
import GanttHeader from "../../components/ui/planning/GanttHeader.jsx";
import GanttLigne from "../../components/ui/planning/GanttLigne.jsx";


export default function Index(){

    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewStart, setViewStart] = useState(new Date());
    const fin = new Date()
    fin.setMonth(fin.getMonth() + 6)
    const [viewEnd, setViewEnd] = useState(fin)




    useEffect(()=>{
        axios.get('http://localhost:8000/api/missions')
            .then(response => {
                    const data = response.data.member || [];
                    setMissions(data);
                    setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="p-4 text-center text-gray-500">Chargement du planning...</p>;
    }
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-800">Suivi des Missions</h1>
                    <GanttControle
                        vStart={viewStart}
                        vEnd={viewEnd}
                        setVStart={setViewStart}
                        setVEnd={setViewEnd}
                    />
                </div>

                <div className="flex flex-col w-full">

                    <GanttHeader start={viewStart} end={viewEnd} />

                    <div className="divide-y divide-gray-200">
                        {missions.length > 0 ? (
                            missions.map((mission) => (
                                <GanttLigne
                                    key={mission.id}
                                    mission={mission}
                                    viewStart={viewStart}
                                    viewEnd={viewEnd}
                                />
                            ))
                        ) : (
                            <p className="p-8 text-center text-gray-400 text-sm">Aucune mission trouvée.</p>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );




}