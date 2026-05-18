export const getNomClient = (client) => {
    return client?.nomEntreprise || client?.nom || "Client inconnu";
};