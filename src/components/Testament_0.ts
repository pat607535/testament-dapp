import { useState, useEffect } from "react";
import { 
  connectWallet, 
  getContract, 
  isDeceased, 
  getHeir, 
  getNotary, 
  getUnlockTime, 
  getDocumentHash 
} from "../utils/ethers";

export default function Testament() {
  const [account, setAccount] = useState<string | null>(null);
  const [documentHash, setDocumentHash] = useState<string | null>(null);
  const [isDeceasedStatus, setIsDeceasedStatus] = useState<boolean>(false);
  const [unlockTime, setUnlockTime] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [heirAddress, setHeirAddress] = useState<string | null>(null);
  const [notaryAddress, setNotaryAddress] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔄 [USE EFFECT] Vérification de la connexion Metamask...");
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      console.log("🔎 [CHECK WALLET] Tentative de connexion à Metamask...");
      const wallet = await connectWallet();
      if (!wallet) {
        console.warn("⚠️ [CHECK WALLET] Metamask non connecté.");
        return;
      }
      setAccount(wallet);
      console.log("✅ [CHECK WALLET] Compte connecté :", wallet);
      await fetchContractData(wallet);
    } catch (error) {
      console.error("❌ [CHECK WALLET] Erreur connexion Metamask :", error);
    }
  };

  const fetchContractData = async (userAccount: string) => {
    try {
      console.log("📡 [FETCH CONTRACT] Récupération des informations du contrat...");

      // 🔹 Récupération des rôles
      const heir = await getHeir();
      const notary = await getNotary();
      console.log("👥 [FETCH CONTRACT] Héritier :", heir);
      console.log("📜 [FETCH CONTRACT] Notaire :", notary);

      setHeirAddress(heir || "Non défini !");
      setNotaryAddress(notary || "Non défini !");

      // 🔹 Vérification du statut du testateur
      const deceased = await isDeceased();
      console.log("☠️ [FETCH CONTRACT] Statut du testateur :", deceased ? "Décédé" : "En vie");
      setIsDeceasedStatus(deceased);

      // 🔹 Récupération du timestamp de déverrouillage
      const unlockTimestamp = await getUnlockTime();
      console.log("⏳ [FETCH CONTRACT] Timestamp brut :", unlockTimestamp);
      const formattedTime = new Date(unlockTimestamp * 1000).toLocaleString();
      console.log("📅 [FETCH CONTRACT] Déverrouillage prévu :", formattedTime);
      setUnlockTime(formattedTime);

      // 🔹 Vérification du rôle actuel de l'utilisateur
      console.log("👤 [FETCH CONTRACT] Adresse utilisateur connecté :", userAccount);
      if (userAccount.toLowerCase() === heir?.toLowerCase()) {
        setRole("Héritier");
        console.log("🎭 [FETCH CONTRACT] Rôle détecté : Héritier");
      } else if (userAccount.toLowerCase() === notary?.toLowerCase()) {
        setRole("Notaire");
        console.log("🎭 [FETCH CONTRACT] Rôle détecté : Notaire");
      } else {
        setRole("Inconnu");
        console.log("🎭 [FETCH CONTRACT] Rôle : Inconnu");
      }

      // 🔹 Si le testament est déverrouillé, on récupère son contenu
      if (deceased && userAccount.toLowerCase() === heir?.toLowerCase()) {
        console.log("📜 [FETCH CONTRACT] Tentative de récupération du testament...");
        const hash = await getDocumentHash();
        console.log("✅ [FETCH CONTRACT] Testament déverrouillé :", hash);
        setDocumentHash(hash);
      }
    } catch (error) {
      console.error("❌ [FETCH CONTRACT] Erreur récupération des données du contrat :", error);
    }
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">📜 Testament DApp</h1>

      {!account ? (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={checkWalletConnection}>
          Connecter Metamask
        </button>
      ) : (
        <p className="text-green-600">✅ Compte connecté : {account}</p>
      )}

      {account && (
        <>
          <p className="mt-4">🎭 Rôle : <strong>{role || "Inconnu"}</strong></p>
          <p>📅 Déverrouillage prévu : <strong>{unlockTime || "..."}</strong></p>
          <p>⚰️ Le testateur est-il décédé ? <strong>{isDeceasedStatus ? "Oui" : "Non"}</strong></p>
          <p>👥 Héritier enregistré : <strong>{heirAddress || "Non défini !"}</strong></p>
          <p>📜 Notaire enregistré : <strong>{notaryAddress || "Non défini !"}</strong></p>

          {/* 🔹 Si l'utilisateur est le notaire et que le testateur n'est pas encore déclaré décédé */}
          {role === "Notaire" && !isDeceasedStatus && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={async () => {
                console.log("⚰️ [ACTION] Confirmation du décès en cours...");
                await confirmDeath();
                await fetchContractData(account);
              }}
            >
              Confirmer le décès
            </button>
          )}

          {/* 🔹 Si l'utilisateur est l'héritier et que le testateur est décédé */}
          {role === "Héritier" && isDeceasedStatus && !documentHash && (
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded mt-4"
              onClick={async () => {
                console.log("🔓 [ACTION] Déverrouillage du testament...");
                const hash = await getDocumentHash();
                setDocumentHash(hash);
              }}
            >
              Déverrouiller le testament
            </button>
          )}

          {/* 🔹 Affichage du testament si disponible */}
          {documentHash && (
            <div className="mt-4 p-4 bg-gray-200 rounded">
              <h2>📜 Contenu du testament :</h2>
              <p>{documentHash}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
