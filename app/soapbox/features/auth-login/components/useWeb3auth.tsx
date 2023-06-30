import { useEffect, useState } from "react";
import { useStore } from 'react-redux';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import Web3 from "web3";
//import {fetchStateAndNonce} from '../api';

const client_Id = "BPuIHyUSw5QErKQDGE3BBmKaqP46hWQebRMChXJKupzQjLOHuktuGfGcR9myHZPe8BegwuMAolCmtiz2hlzaLmo"; // get from https://dashboard.web3auth.io
const ReUrl = "http://localhost:3000/auth/auth/openid_connect/callback";
let attempt = 0;
export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const store = useStore();

  useEffect(() => {
    if (provider&&attempt) {registerUser();}
  },[provider]);


  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthNoModal({
          clientId:client_Id, 
          web3AuthNetwork: "testnet", // mainnet, aqua, celeste, cyan or testnet
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: { 
            redirectUrl:ReUrl,
            loginConfig: {
              // Add login configs corresponding to the provider
              // Auth0 login works with jwt login config
              jwt: {
                verifier: "pinch.test", // Please create a verifier on the developer dashboard and pass the name here
                typeOfLogin: "jwt",
                clientId: "1rpInN05zKaq3P5QoT8yj5kxh7dCloAa", // use your app client id you got from auth0
              },
              // Add other login providers here
            },
          }
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        };

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  async function registerUser() {
    const authUrl = await createAuthUrl();
    window.location.href = authUrl;
  }


  const createAuthUrl = async() => {
/*     const rpc = new web3RPC(provider);
    const [wallet] = await Promise.all([
      rpc.getAccounts(),
    ]); */
    //const { state, nonce } = await fetchStateAndNonce(() => store.getState());
    //const [signedWallet] = await Promise.all([
      //rpc.signMessage(state),
    //]);
    const authUrl = new URL("https://dev-1pnhdssgehdystcp.eu.auth0.com/authorize");
    authUrl.searchParams.set("client_id", "1rpInN05zKaq3P5QoT8yj5kxh7dCloAa");
    authUrl.searchParams.set("nonce", "nonce"); // Replace with the actual nonce
    authUrl.searchParams.set("redirect_uri", "http://localhost:3000/auth/auth/openid_connect/callback");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email");
    authUrl.searchParams.set("state", "state"); // Replace with the actual state
    authUrl.searchParams.set("wallet", "wallet");
    return authUrl.toString();
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      mfaLevel: "default", // Pass on the mfa level of your choice: default, optional, mandatory, none
      // Auth0 login works with JWT loginProvider
      loginProvider: "jwt",
      extraLoginOptions: {
          domain: "https://dev-1pnhdssgehdystcp.eu.auth0.com/", // Please append "https://" before your domain
          verifierIdField: "sub", // For SMS & Email Passwordless, use "name" as verifierIdField
          responseType: "code",
          scope: "openid email"
      },
    });
    attempt=1;
    setProvider(web3authProvider);
  }

  const authenticateUser = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    console.log(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    console.log("web3auth logout being called");
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!web3auth) {
          console.log("web3auth not initialized yet");
          resolve();
          return;
        }
          await web3auth.logout();
          attempt=0;
          setProvider(null);
        /* try {
          await logOut();
        } catch (error) {
          console.error('Error logging out from Mastodon:', error);
        } */
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
  

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new web3RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new web3RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new web3RPC(provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new web3RPC(provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  const signMessage = async (msg: any) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new web3RPC(provider);
    const signedMessage = await rpc.signMessage(msg);
    console.log(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new web3RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };
  return {
    provider,
    login,
    logout,
    getChainId,
    getBalance,
    getAccounts,
    signMessage,
    getUserInfo,
    getPrivateKey,
    sendTransaction,
    authenticateUser,
  };
};


export default class web3RPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  async getChainId(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address),"wei" // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const destination = fromAddress;

      const amount = web3.utils.toWei("0.01","wei"); // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage(msg: any) {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const originalMessage = msg;

      // Sign the message
      const signedMessage = await web3.eth.sign(
        originalMessage,
        fromAddress,// configure your own password here.
      );

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}