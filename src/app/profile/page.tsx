"use client";

import { useEffect, useState } from "react";
import { useActiveWallet } from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { defineChain, getContract } from "thirdweb";
import Image from "next/image";
import { client } from "../client";
import { useActiveAccount } from "thirdweb/react";
import { polygon } from "thirdweb/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

interface NFTMetadata {
  image: string; // Asegúrate de que `image` sea de tipo `string`
  uri: string;
  name?: string; // `name` es opcional
  description?: string; // `description` es opcional
  animation_url?: string;
  external_url?: string;
  background_color?: string;
  properties?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  image_url?: string;
}

interface NFT {
  metadata: NFTMetadata;
  quantityOwned: number; // Cambiado a `number` para coincidir con tu interfaz
}

export default function Profile() {
  const [nfts, setNfts] = useState<NFT[] | null>(null);
  const [loading, setLoading] = useState(true);

  const walletInfo = useActiveWallet();
  const chain = defineChain(137);
  const walletAddress = walletInfo?.getAccount()?.address ?? "0x";
  const account = useActiveAccount();

  const nftContract = getContract({
    address: "0x9e079493c1382Ad5E55bc4DFc10D3D6805144c2C",
    chain,
    client,
  });

  useEffect(() => {
    if (walletAddress !== "0x") {
      const fetchNfts = async () => {
        try {
          await walletInfo?.switchChain(polygon);
          const fetchedNFTs = await getOwnedNFTs({
            contract: nftContract,
            start: 0,
            count: 10,
            address: walletAddress,
          });

          // Asegurar que las propiedades opcionales tengan valores por defecto
          const validatedNFTs = fetchedNFTs.map((nft) => ({
            ...nft,
            metadata: {
              ...nft.metadata,
              image: nft.metadata.image || "", // Si es undefined, se asigna un string vacío
              name: nft.metadata.name || "Unnamed NFT", // Valor por defecto para `name`
              description: nft.metadata.description || "No description available", // Valor por defecto para `description`
            },
            quantityOwned: Number(nft.quantityOwned), // Convertir `bigint` a `number`
          }));

          setNfts(validatedNFTs);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNfts();
    }
  }, [walletAddress, walletInfo, nftContract]);

  const formatIpfsUrl = (url: string) => {
    // Usa el gateway de Cloudflare para IPFS
    return url.replace("ipfs://", "https://f198cccbbdfc554d420f2bbd337858d3.ipfscdn.io/ipfs/");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        alert("Wallet address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy wallet address: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
            <span className="block">User Profile</span>
            <span className="block text-indigo-600">TulumCoin Rewards</span>
          </h1>
          <div className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your Smart Wallet Address:
            <div className="mt-2 flex items-center justify-between bg-white border border-gray-300 rounded-lg p-2">
              <span className="text-gray-800">{walletAddress}</span>
              <button
                onClick={copyToClipboard}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading Rewards...</p>
        ) : nfts && nfts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {nfts.map((nft, index) => (
                <div
                  key={index}
                  className="bg-white overflow-hidden shadow-xl rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={formatIpfsUrl(nft.metadata.image)}
                      alt={nft.metadata.name || "Unnamed NFT"}
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-t-2xl transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1 overflow-hidden">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                      {nft.metadata.name || "Unnamed NFT"}
                    </h2>
                    <p className="text-indigo-600 font-semibold mb-4">
                      Owned: {nft.quantityOwned.toString()}
                    </p>
                    <p className="text-gray-600 mb-4 flex-grow overflow-hidden">
                      {nft.metadata.description || "No description available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-white rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Congratulations!
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  By viewing this message, you've demonstrated your commitment to
                  a healthier planet. Thank you for being a valued member of the
                  TulumCoin Community.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 text-xl">
              You don't own any TulumCoin NFTs yet. Visit the home page to
              subscribe and claim yours!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}