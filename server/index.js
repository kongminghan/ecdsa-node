const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

/**
 
private key: 6f891650ed428af14b23decaf8d5132411aed5eb7f223cf4ec8c8fa825000848
public key: 049bc767ee6849d3994ba6c81761c51bf41f6bb2fbc0873250c4e37129cfb16266a2c131a357391c22b3fd2c5a920ef27f6a3223b6731c14010dfd82f43825ae47

private key: 0ff4e06bd4ce620e0c737fe956fc53ec9260475107d16906ac690023d1c2de63
public key: 04a5aadd3b5cf8b4ef3a04ad3e8a287c54da68ce8fd658c834f1feb3e559e0bbbeb35cf8b14b674a166ba5aeb438e40e0e15096d010915e49d1440c1dea94fc587

private key: 9aa7b1aa57f9045f733b039346905f9c537caacfdf6f6b704e794bf0587a5924
public key: 044ed325157d72163bb9fddbe0d3267bcd981cce4827d9f2dcec6f6bb321d6223f9deb83809659df9bc86b5a1a214b6c118dff63d3e40adc35ea035ff2f6125a2d
 */

const balances = {
  "049bc767ee6849d3994ba6c81761c51bf41f6bb2fbc0873250c4e37129cfb16266a2c131a357391c22b3fd2c5a920ef27f6a3223b6731c14010dfd82f43825ae47": 100,
  "04a5aadd3b5cf8b4ef3a04ad3e8a287c54da68ce8fd658c834f1feb3e559e0bbbeb35cf8b14b674a166ba5aeb438e40e0e15096d010915e49d1440c1dea94fc587": 50,
  "044ed325157d72163bb9fddbe0d3267bcd981cce4827d9f2dcec6f6bb321d6223f9deb83809659df9bc86b5a1a214b6c118dff63d3e40adc35ea035ff2f6125a2d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { senderSignature, senderMsgHash, recipient, amount } = req.body;

  const sender = toHex(
    secp.recoverPublicKey(senderMsgHash, senderSignature, 1)
  );

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
