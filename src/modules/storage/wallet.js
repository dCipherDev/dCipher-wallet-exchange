import {toNumber} from "LoopringJS/common/formatter";
import validator from 'LoopringJS/ethereum/validator';

const setWallet = (wallet) => {
  const wallets = localStorage.wallet ? JSON.parse(localStorage.wallet) : [];
  const otherWallets = wallets.filter(w => w.address.toLowerCase() !== wallet.address.toLowerCase());
  otherWallets.push({address:wallet.address,nonce:toNumber(wallet.nonce) + 1});
  localStorage.wallet = JSON.stringify(otherWallets)
};

const getWallet = (address) => {
  const wallets = localStorage.wallet ? JSON.parse(localStorage.wallet) : [];
  return wallets.find((wallet) => wallet.address.toLowerCase() === address.toLowerCase())
};

const getNonce = async (address) => {
  try {
    validator.validate({value: address, type: "ETH_ADDRESS"});
    const nonce = toNumber((await window.ETH.getTransactionCount({address})).result) || 0;
    const localNonce = getWallet(address) && getWallet(address).nonce ? getWallet(address).nonce : 0;
    return Math.max(nonce,localNonce)
  } catch (e) {
    throw  new Error(e.message)
  }
};

const storeUnlockedAddress = (unlockType, address) => {
  localStorage.unlockedType = unlockType;
  localStorage.unlockedAddress = address
};

const getUnlockedAddress = () => {
  return localStorage.unlockedAddress || ''
};

const getUnlockedType = () => {
  return localStorage.unlockedType || ''
};

const clearUnlockedAddress = () => {
  localStorage.unlockedType = ''
  localStorage.unlockedAddress = ''
};


export default {
  setWallet,
  getWallet,
  getNonce,
  storeUnlockedAddress,
  getUnlockedAddress,
  getUnlockedType,
  clearUnlockedAddress
}

