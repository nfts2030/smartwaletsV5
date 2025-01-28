import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { config } from "dotenv";
import { privateKeyToAccount } from "thirdweb/wallets";
import { safeTransferFrom } from "thirdweb/extensions/erc1155";
import { polygon } from "thirdweb/chains";

config();

const main = async () => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
  }
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("THIRDWEB_SECRET_KEY is not set");
  }

  try {
    const NFT_CONTRACT_ADDRESS = "0x9e079493c1382Ad5E55bc4DFc10D3D6805144c2C";
    const chain = polygon;

    // Initialize the client and the account
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

    const destinationAccount = "0x6A81969e6ba33D55F40A99154240965d9f711918";

    const transaction = safeTransferFrom({
      contract: nftContract,
      from: account.address,
      to: destinationAccount,
      tokenId: BigInt(0),
      value: BigInt(1),
      data: "0x",
    });

    const txData = await sendTransaction({
      transaction: transaction,
      account: account,
    });

    console.log("NFT Transsfered:", txData);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
