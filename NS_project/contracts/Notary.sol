pragma solidity ^0.4.15;
// Proof of Existence contract, version 3
contract Notary {
  mapping (bytes32 => bool) private proofs;
  //mapping (bytes32 => bytes32) public proof4;
  // store a proof of existence in the contract state



  function storeProof(bytes32 proof) public {
    proofs[proof] = true;
    //proof4[proof] = proof;
  }
  // calculate and store the proof for a document
  function notarize(string document) public {
    var proof = proofFor(document);
    storeProof(proof);
  }
  // helper function to get a document's sha256
  function proofFor(string document) public constant returns (bytes32) {
    return sha256(document);
  }

  // check if a document has been notarized
  function checkDocument(string document) public constant returns (bool) {
    var proof = proofFor(document);
    return hasProof(proof);
  }

//  function hashash(bytes32 proof)  constant returns(string) {
//    return proof4[proof];
//  }

  // returns true if proof is stored
  function hasProof(bytes32 proof)  constant returns(bool) {
    return proofs[proof];
  }
}
