import { useState, useEffect } from "react";
import { 
  connectWallet, 
  getContract, 
  isDeceased, 
  getHeir, 
  getNotary, 
  getUnlockTime, 
  getDocumentHash,
  getTestator,
  confirmDeath 
} from "../utils/ethers";

export default function Testament() {
  const [account, setAccount] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isDeceasedStatus, setIsDeceasedStatus] = useState<boolean>(false);
  const [unlockTime, setUnlockTime] = useState<string | null>(null);
  const [heirAddress, setHeirAddress] = useState<string | null>(null);
  const [notaryAddress, setNotaryAddress] = useState<string | null>(null);
  const [testatorAddress, setTestatorAddress] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔄 [USE EFFECT] Vérification de la connexion Metamask...");
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const wallet = await connectWallet();
      if (!wallet) return;
      setAccount(wallet);
      await fetchContractData(wallet);
    } catch (error) {
      console.error("❌ [CHECK WALLET] Erreur connexion Metamask :", error);
    }
  };

  const fetchContractData = async (userAccount: string) => {
    try {
      const heir = await getHeir();
      const notary = await getNotary();
      const testator = await getTestator();

      setHeirAddress(heir || "Non défini !");
      setNotaryAddress(notary || "Non défini !");
      setTestatorAddress(testator || "Non défini !");

      const deceased = await isDeceased();
      setIsDeceasedStatus(deceased);

      const unlockTimestamp = await getUnlockTime();
      setUnlockTime(new Date(unlockTimestamp * 1000).toLocaleString());

      if (userAccount.toLowerCase() === heir?.toLowerCase()) {
        setRole("Héritier");
      } else if (userAccount.toLowerCase() === notary?.toLowerCase()) {
        setRole("Notaire");
      } else if (userAccount.toLowerCase() === testator?.toLowerCase()) {
        setRole("Testateur");
      } else {
        setRole("Inconnu");
      }
    } catch (error) {
      console.error("❌ [FETCH CONTRACT] Erreur récupération contrat :", error);
    }
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">📜 Testament DApp</h1>
      <p>🎭 Rôle : <strong>{role || "Inconnu"}</strong></p>
      <p>📜 Notaire : <strong>{notaryAddress}</strong></p>
      <p>👥 Héritier : <strong>{heirAddress}</strong></p>
      <p>👤 Testateur : <strong>{testatorAddress}</strong></p>
      
      {role === "Notaire" && !isDeceasedStatus && (
        <button onClick={async () => await confirmDeath()}>Confirmer le décès</button>
      )}
    </div>
  );
}
