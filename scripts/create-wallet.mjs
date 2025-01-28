import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { config } from "dotenv";
import { privateKeyToAccount } from "thirdweb/wallets";
import { safeTransferFrom } from "thirdweb/extensions/erc1155";
import { polygon } from "thirdweb/chains";

config();

app.use(
  cors({
    origin: "https://smartwalets-v5.vercel.app", // Asegúrate de que no haya una barra diagonal al final
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Ruta para manejar solicitudes POST
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
  }
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("THIRDWEB_SECRET_KEY is not set");
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const url = "https://embedded-wallet.thirdweb.com/api/v1/pregenerate";
  const headers = {
    "x-secret-key": process.env.THIRDWEB_SECRET_KEY,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    strategy: "email",
    email,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data:", data);

    try {
      const NFT_CONTRACT_ADDRESS = "0x31c1542CCAb41f15613F29F03E1750F30705F958";
      const chain = polygon;

      // Inicializar el cliente y la cuenta
      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY,
      });

      const account = privateKeyToAccount({
        client,
        privateKey: process.env.PRIVATE_KEY,
      });

      const nftContract = getContract({
        address: NFT_CONTRACT_ADDRESS,
        chain,
        client,
      });

      const transaction = safeTransferFrom({
        contract: nftContract,
        from: account.address,
        to: data.wallet.address,
        tokenId: BigInt(0),
        value: BigInt(1),
        data: "0x",
      });

      const txData = await sendTransaction({
        transaction: transaction,
        account: account,
      });

      console.log("Transaction Hash", txData.transactionHash);
    } catch (error) {
      console.error("Error:", error);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor solo en localhost
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Exportar la aplicación para Vercel
export default app;
