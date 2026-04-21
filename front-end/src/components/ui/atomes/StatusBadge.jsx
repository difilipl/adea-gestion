export default function StatusBadge({couleur, icone}){
    return (
        <div className={`p-3 rounded-lg ${couleur}`}>
            {icone}
        </div>
        
    );
}