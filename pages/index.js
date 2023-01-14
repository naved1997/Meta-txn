import Head from "next/head";
import styles from "../styles/Home.module.css";
import web3modal from "web3modal";
import { providers } from "ethers";
import { useEffect, useState, useRef } from "react";
import { ChainConfig } from "../config";
import axios from 'axios';
import 'isomorphic-unfetch';



export default function Home() {
  const chainConfig = ChainConfig.bnb.testnet;
  const chainId = chainConfig.ChainConfig.chainId;
  const rpcUrl = chainConfig.ChainConfig.rpcUrls;


  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();
  const [account, updateAccount] = useState(null);

  const getProviderorSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const _chainId = await web3Provider.getNetwork();
    if (_chainId.chainId != 97) {
      window.alert("Change network to bsctesnet");
      throw new Error("Change the network to right one");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderorSigner();
      setWalletConnected(true);
      await getAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const getAccounts = async () => {
    const signer = await getProviderorSigner(true);
    // Get the address associated to the signer which is connected to  MetaMask
    const address = await signer.getAddress();
    console.log(address);
    updateAccount(address);
    return address;
  };

  

  const GetReward = async () => {
    try {
      console.log("clicked");
      //("0x7B1599fd58dA00DC505157F783Ef4d4D39145b81","1000000000")

      let address=account;
      let amount=1000000000;
      let response = await axios.post('/api/distribute-reward',{ address: address, amount: amount})
      alert(response.data.message);
      console.log('Tansaction Hash',response.data.tx.hash);
      console.log(response.data.tx);

    } catch (error) {
      console.log(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
        return (
          <button onClick={GetReward} className={styles.button}>
    Get the Reward
          </button>
        );
    
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new web3modal({
        network: "bnbt",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);



  return (
    <div>
      <Head>
        <title>MetaTxn</title>
        <meta name="description" content="WhiteList-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Great Welcome!!</h1>
          <div className={styles.description}>
Backend Transaction using Defender Relay
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>
      <footer className={styles.footer}>Made with Love!!</footer>
    </div>
  );
}
