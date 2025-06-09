import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/ERC20Wildcard/ERC20";
import { ERC20  } from "../generated/ERC20Wildcard/ERC20";
import { ERC721 } from "../generated/ERC20Wildcard/ERC721";


import {
  Token,
  Account,
  Balance,
  NFTContract,
  NFT,
  TransferEvent,
  MintEvent
} from "../generated/schema";


export function handleTransfer(ev: Transfer): void {
  const addr = ev.address;

  // try ERC-20 probe first
  const bound20   = ERC20.bind(addr);
  const decResult = bound20.try_decimals();

  if (!decResult.reverted) {
    /* ─ ERC-20 branch ─ */
    ensureToken(addr, bound20, decResult.value);
    updateFungible(ev.params.from, addr, ev.params.value.neg());
    updateFungible(ev.params.to,   addr, ev.params.value);

    createTransferEvent(ev, "ERC20");
    return;
  }

  /* ─ ERC-721 branch ─ */
  handleNFTTransfer(ev);
  createTransferEvent(ev, "ERC721");

  if (ev.params.from.equals(Address.zero())) {
    createMintEvent(ev);
  }
}

/* ──────────────────────  ERC-20 helpers  ───────────────────────── */
function ensureToken(addr: Address, bound: ERC20, decimals: i32): void {
  let token = Token.load(addr.toHex());
  if (token) return;

  const symCall = bound.try_symbol();
  token = new Token(addr.toHex());
  token.symbol   = symCall.reverted ? "?" : symCall.value;
  token.decimals = decimals;
  token.save();
}

function updateFungible(owner: Address, tokenAddr: Address, delta: BigInt): void {
  const id  = tokenAddr.toHex() + "/" + owner.toHex();
  let bal   = Balance.load(id);
  if (!bal) {
    newAccount(owner);
    bal          = new Balance(id);
    bal.account  = owner.toHex();
    bal.token    = tokenAddr.toHex();
    bal.value    = BigInt.zero();
  }
  bal.value = bal.value.plus(delta);
  bal.save();
}

/* ──────────────────────  ERC-721 helpers  ──────────────────────── */
function handleNFTTransfer(ev: Transfer): void {
  ensureNFTContract(ev.address);

  const tokenId = ev.params.value;
  const nftId   = ev.address.toHex() + "/" + tokenId.toString();

  let nft = NFT.load(nftId);
  if (!nft) {
    nft            = new NFT(nftId);
    nft.contract   = ev.address.toHex();
    nft.tokenId    = tokenId;

    /* ─ pull tokenURI once ─ */
    const bound    = ERC721.bind(ev.address);
    const uriCall  = bound.try_tokenURI(tokenId);
    nft.tokenUri   = uriCall.reverted ? "" : uriCall.value;
  }

  // burn check
  if (ev.params.to.notEqual(Address.zero())) {
    newAccount(ev.params.to);
    nft.owner = ev.params.to.toHex();
    nft.save();
  }
}

function ensureNFTContract(addr: Address): void {
  let coll = NFTContract.load(addr.toHex());
  if (coll) return;

  const bound   = ERC721.bind(addr);
  const symCall = bound.try_symbol();

  coll          = new NFTContract(addr.toHex());
  coll.symbol   = symCall.reverted ? "NFT" : symCall.value;
  coll.save();
}

/* ─────────────────────── utilities ─────────────────────────────── */
function newAccount(addr: Address): void {
  if (Account.load(addr.toHex()) == null) {
    new Account(addr.toHex()).save();
  }
}

function createTransferEvent(ev: Transfer, kind: string): void {
  const transferId = ev.transaction.hash.toHex() + "-" + ev.logIndex.toString();
  let transferEvent = new TransferEvent(transferId);

  transferEvent.txHash = ev.transaction.hash.toHex();
  transferEvent.blockNumber = ev.block.number;
  transferEvent.timestamp = ev.block.timestamp;
  transferEvent.from = ev.params.from.toHex();
  transferEvent.to = ev.params.to.toHex();
  transferEvent.kind = kind;

  transferEvent.direction = "Unknown";

  let gasUsed = BigInt.zero();
  if (ev.receipt !== null) {
    gasUsed = ev.receipt!.gasUsed;
  }
  const gasPrice = ev.transaction.gasPrice;
  transferEvent.fee = gasUsed.times(gasPrice);
  transferEvent.gasUsed = gasUsed;
  transferEvent.gasPrice = gasPrice;

  if (kind == "ERC20") {
    transferEvent.token = ev.address.toHex();
    transferEvent.value = ev.params.value;
  } else {
    transferEvent.nft = ev.address.toHex() + "/" + ev.params.value.toString();
    transferEvent.value = BigInt.fromI32(1);
  }

  transferEvent.save();
}

function createMintEvent(ev: Transfer): void {
  const mintId = ev.transaction.hash.toHex() + "-mint-" + ev.logIndex.toString();
  let mintEvent = new MintEvent(mintId);

  mintEvent.txHash = ev.transaction.hash.toHex();
  mintEvent.blockNumber = ev.block.number;
  mintEvent.timestamp = ev.block.timestamp;
  mintEvent.to = ev.params.to.toHex();
  mintEvent.nft = ev.address.toHex() + "/" + ev.params.value.toString();

  mintEvent.direction = "In";

  let gasUsed = BigInt.zero();
  if (ev.receipt !== null) {
    gasUsed = ev.receipt!.gasUsed;
  }
  const gasPrice = ev.transaction.gasPrice;
  mintEvent.fee = gasUsed.times(gasPrice);
  mintEvent.gasUsed = gasUsed;
  mintEvent.gasPrice = gasPrice;
  
  mintEvent.save();
}
