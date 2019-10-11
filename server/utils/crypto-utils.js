const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
import sha256 from "crypto-js/sha256";

const splitSignatureToRS = (signatureStr) => {
    // const m = signature.match(/([a-f\d]{64})/gi);
    return {
        r: signatureStr.substring(0, 64),
        s: signatureStr.substring(64)
    }
};

const verifySignature = (publicKey, fullSignature, data) => {
  const actualSignature = splitSignatureToRS(fullSignature);
  const actualPublicKey = ec.keyFromPublic(publicKey, "hex");
  return actualPublicKey.verify(data, actualSignature);
};

const sign = (privateKey, data) => {
    let actualKeyPair = ec.keyFromPrivate(privateKey, "hex");
    let raw = actualKeyPair.sign(data);
    return raw.r.toString("hex") + raw.s.toString("hex")
};

const hash = data => sha256(data).toString();

//Testing
// const test = ec.keyFromPrivate("238f831621304f30764ed0b062947468db6ff039ae1e73a50bb722147967be8d", "hex");
// let temp = test.sign("cac");
// const test2= ec.keyFromPublic("04ee01d9d433b582e6845dbfae461b6c672a6caea25997f550d34e003221e97af4cc604980c43a4f491342fdacb8dc0e58da847aa841337bf0081e37082f941971", "hex");
// var signature = temp.r.toString("hex") + temp.s.toString("hex");
// console.log(signature)
// console.log(test2.verify("cac", splitSignatureToRS(signature)))
module.exports = { ec, hash, sign, verifySignature};