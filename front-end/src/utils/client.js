export const getNomClient = (client) => {
    return client?.nom_entreprise || client?.nom || "Client inconnu";
};