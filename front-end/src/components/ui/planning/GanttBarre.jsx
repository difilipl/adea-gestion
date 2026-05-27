export default function GanttBarre({startDate, endDate, viewStart, viewEnd, color = "bg-blue-500", isStep = false }) {
    const start= new Date(startDate).getTime();
    const end= new Date(endDate).getTime();
    const vStart= new Date(viewStart).getTime();
    const vEnd= new Date(viewEnd).getTime();

    const totalDuration = vEnd - vStart;

    const leftPercent = Math.max(0, ((start - vStart) / totalDuration) * 100);

    const widthPercent= ((end- start) / totalDuration) * 100;

    const heightClass = isStep ? "h-3" : "h-6 rounded-md";

    return (
        <>
            <div
                className={`absolute ${heightClass} ${color} opacity-90 hover:opacity-100 transition-opacity`}
                style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}
                title={`Du ${new Date(startDate).toLocaleDateString()} au ${new Date(endDate).toLocaleDateString()}`}
            >
            </div>
        </>

    );


}