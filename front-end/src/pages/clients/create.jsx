
import {useNavigate} from "react-router-dom";


export default function Create(){
    const navigate = useNavigate();



    return (
        <>
            <div>
                <button
                    className="button"
                    onClick={() => navigate('/clients/create_business')}>
                    crée un client professionel
                </button>
            </div>
            <div>
                <button
                    className="button"
                    onClick={() => navigate('/clients/create_personal')}>
                    crée un client particulier
                </button>
            </div>
        </>




    );



}