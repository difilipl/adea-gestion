import {useState} from "react";

export default function GanttHeader({start, end}) {

    function Calculermois(start, end){
        const list = [];

        let date = new Date(start);

        while(date.getTime() <= end.getTime()) {
            list.push(new Date(date));
            date.setMonth(date.getMonth() + 1);
        }
        return list;
    }
    let list = Calculermois(start, end);

    const share = 100 / list.length;

    return (
        <>
            <div className="flex w-full border-b border-gray-200 bg-gray-50 font-medium text-gray-600">

                <div className="w-1/4 p-3 border-r border-gray-200 flex items-center pl-4 text-sm">
                    Planning / Échéances
                </div>

                <div className="w-3/4 flex relative">
                    {list.map((item, index) => (
                        <div
                            key={index}
                            style={{ width: `${share}%` }}
                            className="p-3 text-center text-xs border-r border-gray-100 last:border-r-0 truncate"
                        >
                            {item.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}