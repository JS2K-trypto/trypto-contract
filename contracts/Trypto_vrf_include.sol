// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";





contract TryptoForRemix is ERC721, ERC721URIStorage, Ownable, AutomationCompatibleInterface, VRFConsumerBaseV2{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Counter : mapping for badge upgrades
    
    // badgeLevel 
    // ex ) 5(tokenId) : 0(level)
    // ex ) 8(tokenId) : 2(level)
    mapping(uint => uint) public badgeLevel;

    // pendingUpgrade is for counting badgeLevel
    uint pendingUpgrade;

    // Metadata information for each stage of the NFT on IPFS.
    string[] IpfsUri = [
        "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/bronze.json",
        "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/silver.json",
        "https://ipfs-2.thirdwebcdn.com/ipfs/QmPwAZ6xZkVsTYjtnCmuEK1AfAT3TVvBHQ6N32w76A51yn/gold.json"
        
    ];

    uint lastTimeStamp;
    uint interval;
    // For Data Feed (EUR/USD)
    AggregatorV3Interface internal priceFeed;

    // For Event Interval (5 minutes)
    uint public  eventTimeInterval;

    //VRF
    VRFCoordinatorV2Interface COORDINATOR;
    // Mumbai vrfCoordinator, keyHash
    address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 3;
    // number of random words
    uint32 numWords =  1;
    uint64 public s_subscriptionId;
    uint256[] public s_randomWords;
    uint256 public s_requestId;
    address s_owner;

    uint256 public randomResult;
    // range of random number(0~maximum)
    uint256 public maximum;
    uint256 public result;
    




     

    constructor(uint _interval, uint64 subscriptionId) ERC721("Trypto", "TRT") VRFConsumerBaseV2(vrfCoordinator){
        interval = _interval;
        lastTimeStamp = block.timestamp;
        /**
        * Network: Mumbai
        * Aggregator: EUR/USD
        * Address: 0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A
        */
        priceFeed = AggregatorV3Interface(0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A);
        eventTimeInterval = 0;
        //VRF
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
        
    }

    // for Event (Present for users who owns nfts)
    // This function calls fulfillRandomWords and call random number.
    function getTokens() public{
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }


    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        s_randomWords = randomWords;
        maximum = 5;
        randomResult = s_randomWords[0] % maximum + 1;
        eventDrop(randomResult);
        
        }
    



    // Mint NFT(Badge)
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
    }


    // (ONLY FOR TEST, WILL BE DELETED LATER) upgrade nft by Change tokenURI
    function upgradeBadge(uint _tokenId, string memory _uri) public onlyOwner {
        _setTokenURI(_tokenId, _uri);

    }

    // get All nfts of User
    function getNftsOf(address _address) public view returns (string[] memory) {
        uint tokenCounts = _tokenIdCounter.current();
        string[] memory badges = new string[](tokenCounts);
        uint index = 0;
        for (uint i=0; i<tokenCounts; i++) {
            if (ownerOf(i) == _address) {
                string memory nftInfo = tokenURI(i);
                badges[index] = nftInfo;
                index++;
            }     
        }  
        return badges;
    }

    /// increase badgeLevel if user visit the country again and click the button
    function increasebadgeLevel(uint _tokenId) public onlyOwner {
        require(badgeLevel[_tokenId] < 2);
        badgeLevel[_tokenId]++;
        pendingUpgrade++;
    }

    
    // Automation calls this functions every interval,
    // upgrade every badges that badeLevels are 1 or 2  
    function upgrade() public {
        uint nftcounts = _tokenIdCounter.current();
        for(uint i=0;i<nftcounts;i++){
            if(badgeLevel[i] == 1) {
                _setTokenURI(i, IpfsUri[1]);
            } else if (badgeLevel[i] == 2) {
                _setTokenURI(i, IpfsUri[2]);
            }
            
        }
    }

    // every 5 minutes, pick random tokenId using VRF(0 to _tokenIdCounter.current())
    // then Search the address who own the tokenId.
    // then Give Present to the address.
    function eventDrop(uint _tokenId) public {
        address owner = ownerOf(0);
        string memory giftUri = "Plane ticket";
        safeMint(owner, giftUri);


        
    }



    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            upgrade();
            eventTimeInterval++;
            if(eventTimeInterval >= 5) {
                getTokens();
                eventTimeInterval = 0;
            }

        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }


    /**
    * Returns the latest price
    */
    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }




    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    // shows NFT's Metadata  
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}