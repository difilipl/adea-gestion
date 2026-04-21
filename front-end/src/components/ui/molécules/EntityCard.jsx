import StatusBadge from "../atomes/StatusBadge.jsx";
import BadgeCount from "../atomes/BadgeCount.jsx";

export default function EntityCard({
    title,
    subtitle,
    info1,
    info2,
    statusLabel,
    type,
    config,
    onClick,
    isDetails,
    children
}) {

    const style = config[type?.toLowerCase()] || {
        icone: "❓",
        couleur: "bg-gray-100 text-gray-500",
        hoverBanniere: "hover:border-gray-300",
        hoverTexte: "group-hover:text-gray-600"
    };

    return (
        <li
            onClick={onClick}
            className={`group bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all cursor-pointer ${style.hoverBanniere} hover:shadow-md`}
        >
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-[250px]">
                    <StatusBadge couleur={style.couleur} icone={style.icone}/>
                    <div>
                        <h3 className={`font-bold text-gray-900 transition-colors ${style.hoverTexte}`}>
                            {title}
                        </h3>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{subtitle}</p>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 items-center gap-8 text-sm text-gray-600">
                    <span className="truncate w-48">{info1}</span>
                    <span>{info2}</span>
                </div>

                <BadgeCount
                    label={statusLabel || type}
                    couleur={['en cours', 'client'].includes(statusLabel || type)
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-orange-50 text-orange-600 border-orange-100'}
                />
            </div>
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isDetails ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        {children}
                    </div>

                </div>
            </div>


        </li>
    )





}