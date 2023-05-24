import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import {assert, expect} from "chai";
import { json } from "hardhat/internal/core/params/argumentTypes";

describe.only("Trypto1 Unit Tests", function() {
    async function deployTrypto1Fixture(){
        const _tokenURI1 = "{name:Korea}";
        const _tokenURI2 = "{name:France}";

        const [owner,otherAccount] = await ethers.getSigners();

        const Trypto1Factory = await ethers.getContractFactory("Trypto");
        const trypto1 = await Trypto1Factory.connect(owner).deploy(60);

        return {_tokenURI1, _tokenURI2, owner, otherAccount, trypto1}
    }

    describe("#Owner", async function () {
        it("owner must be the one who deploys contract", async function() {
            const {trypto1, owner} = await loadFixture(deployTrypto1Fixture);
    
            const currentOwner = await trypto1.owner();
            assert(currentOwner == owner.address, "Owner was not set properly");
            
        });

    })
    
    describe("#safeMint", async function () {
        it("only owner can mint nft", async function() {
            const {trypto1, owner, otherAccount, _tokenURI1} = await loadFixture(deployTrypto1Fixture);
    

            await expect(
                trypto1
                .connect(otherAccount)
                .safeMint(owner.address, _tokenURI1))
                .to.be.reverted.revertedWith('Ownable: caller is not the owner')
            
            
        });

        it("should be owned by address : _to", async function() {
            const {trypto1, owner, _tokenURI1, otherAccount} = await loadFixture(deployTrypto1Fixture);

            await trypto1.connect(owner).safeMint(otherAccount.address, _tokenURI1);
            const result = await trypto1.ownerOf(0);
            
            
            expect(result).to.equal(otherAccount.address);



        })

        it("should put same tokenURI", async function() {
            const {trypto1, owner, _tokenURI1, otherAccount} = await loadFixture(deployTrypto1Fixture);

            await trypto1.connect(owner).safeMint(otherAccount.address, _tokenURI1);



            const tokenURI = await trypto1.tokenURI(0);
            expect(tokenURI).to.equal(_tokenURI1)


        })
        
    }) 

    describe("#getNftsOf", async function () {
        it("should return all nfts of specific User by JSON Object", async function() {
            const {trypto1, owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);
    
            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);
            await trypto1.connect(owner).safeMint(owner.address, _tokenURI2);

            const result = await trypto1.getNftsOf(owner.address);
            
            
            const expected = [_tokenURI1,_tokenURI2]
            
            assert.deepStrictEqual(result,  expected, "Error: must be same")
            
        });



    })
    
    

})