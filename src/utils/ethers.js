import { ethers } from "ethers"; // Importation de ethers.js pour interagir avec la blockchain

// Adresse du contrat déployé sur Sepolia
const CONTRACT_ADDRESS = "0x5b329bBe9b59b53eF2c06E1403178303b72280D8";

// Définition de l'ABI (Fonctions accessibles du contrat)
const CONTRACT_ABI = [
  "function getDocumentHash() public view returns (string memory)", 
  "function confirmDeath() public", 
  "function unlockTestament() public returns (string memory)", 
  "function isDeceased() public view returns (bool)", 
  "function heir() public view returns (address)", 
  "function notary() public view returns (address)", 
  "function unlockTime() public view returns (uint256)", 
  "function testator() public view returns (address)" 
];

/**
 * Connecte Metamask et récupère l'adresse de l'utilisateur.
 */
export async function connectWallet() {
  console.log("[connectWallet] Vérification de Metamask...");

  if (!window.ethereum) {
    alert("Installez Metamask pour utiliser cette application !");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log("[connectWallet] Compte connecté :", accounts[0]);
    return accounts[0]; 
  } catch (error) {
    console.error("[connectWallet] Erreur de connexion :", error);
    return null;
  }
}

/**
 * Récupère une instance du contrat déployé.
 */
export async function getContract() {
  console.log("[getContract] Récupération du contrat...");

  if (!window.ethereum) {
    alert("Installez Metamask !");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    console.log("[getContract] Contrat récupéré :", contract);
    return contract;
  } catch (error) {
    console.error("[getContract] Erreur récupération contrat :", error);
    return null;
  }
}

/**
 * Récupère **le contenu du testament**.
 */
export async function getDocumentHash() {
  try {
    const contract = await getContract();
    if (!contract) return null;

    console.log("[getDocumentHash] Récupération du testament...");
    const docHash = await contract.getDocumentHash();
    console.log("[getDocumentHash] Contenu :", docHash);

    return docHash;
  } catch (error) {
    console.error("[getDocumentHash] Erreur récupération testament :", error);
    return null;
  }
}

/**
 * Vérifie si le **testateur est décédé**.
 */
export async function isDeceased() {
  try {
    const contract = await getContract();
    if (!contract) return null;

    console.log("[isDeceased] Vérification statut testateur...");
    const status = await contract.isDeceased();
    console.log(`[isDeceased] Statut : ${status ? "☠️ Décédé" : "👤 En vie"}`);
    
    return status;
  } catch (error) {
    console.error("[isDeceased] Erreur récupération statut testateur :", error);
    return null;
  }
}

/**
 * Récupère **l'adresse de l'héritier**.
 */
export async function getHeir() {
  try {
    const contract = await getContract();
    if (!contract) return null;

    console.log("[getHeir] Récupération de l'héritier...");
    const heirAddress = await contract.heir();
    console.log("[getHeir] Héritier :", heirAddress);

    return heirAddress;
  } catch (error) {
    console.error("[getHeir] Erreur récupération héritier :", error);
    return null;
  }
}

/**
 * Récupère **l'adresse du notaire**.
 */
export async function getNotary() {
  try {
    const contract = await getContract();
    if (!contract) return null;

    console.log("[getNotary] Récupération du notaire...");
    const notaryAddress = await contract.notary();
    console.log("[getNotary] Notaire :", notaryAddress);

    return notaryAddress;
  } catch (error) {
    console.error("[getNotary] Erreur récupération notaire :", error);
    return null;
  }
}

/**
 * Récupère **l'adresse du testateur**.
 */
export async function getTestator() {
  try {
    const contract = await getContract();
    if (!contract) return null;

    console.log("[getTestator] Récupération du testateur...");
    const testatorAddress = await contract.testator();
    console.log("[getTestator] Testateur :", testatorAddress);

    return testatorAddress;
  } catch (error) {
    console.error("[getTestator] Erreur récupération testateur :", error);
    return null;
  }
}

/**
 ***Notaire** : Confirme le décès du testateur.
 */
export async function confirmDeath() {
  try {
    const contract = await getContract();
    if (!contract) return;

    console.log("📡 [confirmDeath] Confirmation décès...");
    const tx = await contract.confirmDeath();
    await tx.wait();

    console.log("[confirmDeath] Décès confirmé !");
    alert("Décès confirmé !");
  } catch (error) {
    console.error("[confirmDeath] Erreur confirmation décès :", error);
    alert("Erreur confirmation décès.");
  }
}

/**
 ***Héritier** : Déverrouille le testament.
 */
/**export async function unlockTestament() {
  try {
    const contract = await getContract();
    if (!contract) return;

    console.log("📡 [unlockTestament] Déblocage testament...");
    const docHash = await contract.unlockTestament();

    console.log("[unlockTestament] Testament :", docHash);
    alert(`Testament : ${docHash}`);
  } catch (error) {
    console.error("[unlockTestament] Erreur déblocage :", error);
    alert("Erreur déblocage testament.");
  }
}*/




/**
 * **Héritier** : Déverrouille le testament.
 */
export async function unlockTestament() {
  try {
    const contract = await getContract();
    if (!contract) return;

    console.log("[unlockTestament] Déblocage testament (transaction en cours)...");
    const tx = await contract.unlockTestament(); // Déclenche la transaction
    console.log("[unlockTestament] Attente de la confirmation de la transaction...");
    await tx.wait(); // Attend la confirmation de la transaction

    console.log("[unlockTestament] Transaction confirmée, récupération du testament...");
    const docHash = await contract.getDocumentHash(); // Récupération du contenu du testament

    console.log("[unlockTestament] Testament récupéré :", docHash);
    alert(`📜 Testament : ${docHash}`);
  } catch (error) {
    console.error("[unlockTestament] Erreur déblocage :", error);
    alert("Erreur déblocage testament.");
  }
}


/**
 * Récupère le **timestamp de déverrouillage**.
 */
export async function getUnlockTime() {
  try {
    const contract = await getContract();
    if (!contract) return null;

    console.log("[getUnlockTime] Récupération timestamp...");
    const unlockTimestamp = await contract.unlockTime();
    console.log("[getUnlockTime] Timestamp :", unlockTimestamp);

    return Number(unlockTimestamp);
  } catch (error) {
    console.error("[getUnlockTime] Erreur récupération timestamp :", error);
    return null;
  }
}
