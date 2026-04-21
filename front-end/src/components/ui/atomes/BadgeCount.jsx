export default function BadgeCount({label, couleur}) {
    return(
        <div className="text-right hidden sm:block">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${couleur}`}>
                {label}
            </span>
        </div>


    );

}