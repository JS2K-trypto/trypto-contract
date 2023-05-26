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
        it("should return all nfts of specific User with Array type", async function() {
            const {trypto1, owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);
    
            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);
            await trypto1.connect(owner).safeMint(owner.address, _tokenURI2);

            const result = await trypto1.getNftsOf(owner.address);
            
            
            const expected = [_tokenURI1,_tokenURI2]
            
            assert.deepStrictEqual(result,  expected, "Error: must be same")
            
        });



    })

    describe("#upgradeBadge", async function () {
        it("should change tokenURI of specific NFT", async function() {
            const {trypto1, owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);
    
            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);

            const newTokenUri = "cold";

            const upgradeBadge = await trypto1.upgradeBadge(0, newTokenUri);

            const getTokenUri = await trypto1.tokenURI(0);
            

            //console.log(result);
            expect(newTokenUri).to.equal(getTokenUri);



            
            
            
            
            //assert.deepStrictEqual(result,  expected, "Error: must be same")
            
        });




    })

    describe("#increasebadgeLevel", async function() {
        it("should be done only by Owner", async function() {
            const {trypto1, otherAccount,owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);

            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);

            await expect(
                trypto1
                .connect(otherAccount)
                .increasebadgeLevel(0))
                .to.be.reverted.revertedWith('Ownable: caller is not the owner')


        })

        it("should increase badgeLevel", async function() {
            const {trypto1, otherAccount,owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);

            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);
            await trypto1.connect(owner).increasebadgeLevel(0);
            let result;
            await trypto1.badgeLevel(0).then((res) => {
                result = res.toNumber()
            });

            expect(result).to.equal(1);
            

        })

        it("should be reverted if badeLevel is 2", async function() {
            const {trypto1, otherAccount,owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);

            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);
            await trypto1.connect(owner).increasebadgeLevel(0);
            await trypto1.connect(owner).increasebadgeLevel(0);
            
            await expect(trypto1
                .connect(owner)
                .increasebadgeLevel(0)
            ).to.be.reverted;

            

        })
    })

    describe("#tokenURI", async function() {
        it("should call tokenURI of NFT", async function() {
            const {trypto1, otherAccount,owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);

            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);

            const result = await trypto1.tokenURI(0);
            expect(result).to.equal(_tokenURI1);
        })

    })

    describe("#upgrade", async function() {
        it("should change every nft's tokenURI if badgeLevel is 1 or 2 ", async function() {
            const {trypto1, otherAccount,owner, _tokenURI1, _tokenURI2} = await loadFixture(deployTrypto1Fixture);


            // mint 3 nfts
            await trypto1.connect(owner).safeMint(owner.address, _tokenURI1);
            await trypto1.connect(owner).safeMint(owner.address, _tokenURI2);
            await trypto1.connect(owner).safeMint(owner.address, "dummy");

            // level up tokenId(0) to level 2
            // level up tokenId (1) to level 1
            await trypto1.connect(owner).increasebadgeLevel(0);
            await trypto1.connect(owner).increasebadgeLevel(0);
            await trypto1.connect(owner).increasebadgeLevel(1);

            // execute upgrade()
            await trypto1.upgrade();

            // check nfts tokenUri
            const tokenUri_gold = await trypto1.tokenURI(0);
            const tokenUri_silver = await trypto1.tokenURI(1);
            const tokenUri_bronze = await trypto1.tokenURI(2);

            
            
            
            const gold = "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/gold.json";        
            const silver = "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/silver.json";
         
            const bronze = "dummy"
            

            expect(tokenUri_gold).to.equal(gold)
            
            expect(tokenUri_bronze).to.equal(bronze)
            expect(tokenUri_silver).to.equal(silver)


            


        })

    })


    
    

})