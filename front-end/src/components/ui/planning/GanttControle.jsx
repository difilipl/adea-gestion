export default function GanttControle({vStart,vEnd, setVStart, setVEnd}){

    const avancerGantt = () => {
        const nouveauxVStart = new Date(vStart);
        const nouveauxVEnd = new Date(vEnd);

        nouveauxVStart.setMonth(nouveauxVStart.getMonth()+1);
        nouveauxVEnd.setMonth(nouveauxVEnd.getMonth()+1);

        setVStart(nouveauxVStart);
        setVEnd(nouveauxVEnd);
    }

    const reculerGantt = () => {
        const nouveauxVStart = new Date(vStart);
        const nouveauxVEnd = new Date(vEnd);

        nouveauxVStart.setMonth(nouveauxVStart.getMonth()-1);
        nouveauxVEnd.setMonth(nouveauxVEnd.getMonth()-1);

        setVStart(nouveauxVStart);
        setVEnd(nouveauxVEnd);
    }

    const dezoomer = () => {
        const nouveauxVEnd = new Date(vEnd);

        nouveauxVEnd.setMonth(nouveauxVEnd.getMonth()+1);

        setVEnd(nouveauxVEnd);
    }

    const zoomer = () => {
        const nouveauxVEnd = new Date(vEnd);

        nouveauxVEnd.setMonth(nouveauxVEnd.getMonth()-1);

        setVEnd(nouveauxVEnd);
    }


    return (
        <>
            <button onClick={avancerGantt}> avancer </button>
            <button onClick={reculerGantt}> reculer </button>
            <button onClick={zoomer}> zoomer </button>
            <button onClick={dezoomer}> dezoomer </button>
        </>
    );
}