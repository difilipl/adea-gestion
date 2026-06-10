import Header from "../../components/layout/Header.jsx";
import UserManagement from "../../components/UserManagement";

export default function Index(){
    return (
        <>
            <Header titre="Les paramètres" />
            <div className="p-8">
                <h1 className="text-xl font-bold text-slate-900 mb-2">Paramètres</h1>
                <UserManagement />
            </div>




        </>

    )
}