# Trypto1.sol 설명

### 1. badgeLevel & pendingUpgrade

badgeLevel은 tokenId : level 매핑 타입이고,

pendingUpgrade은 badgeLevel의 len을 세기 위한 변수다. (매핑은 len 확인이 안된다)

---

## 2. safeMint (중요)

유저가 뱃지 받을 자격이 있으면 nft를 민팅하는 함수다

현재는 두 번째 인자로 uri를 받는데, 만약 뱃지 종류가 1개(한국)이라면 필요가 없을 것이다.

---

### 3. upgradeBadge(삭제 예정)

nft의 메타데이터를 정말 바꿀 수 있는지 테스트를 위한 함수

---

## 4. getNftsOf (중요)

유저의 주소를 넣어 실행하면 nft들의 메타데이터(uri)를 배열에 담아 반환하는 함수

유저가 뱃지들 볼 수 있는 페이지에서 실행해야 한다.

(뱃지 종류가 1개라면 배열도 필요가 없을 것이다...)

---

## 5. increasebadgeLevel (중요)

서버에서 조건이 맞는 경우(5번 클릭했다던지, 쿨타임이 지났던지) 

실행해 특정 뱃지의 level을 올려준다.

레벨은 (0,1,2)까지 있다.

---

## 6. upgrade (중요)

5번 함수를 통해 mapping이 계속 업데이트 될 것이다.

tokenId <-> level <br/>
3 ------ 2 <br/>
9 ------ 1 <br/>
14 ------- 2 <br/>

(레벨이 0인 뱃지들은 들어오지 않는다)

---
이 함수는 Automation으로 실행되며, 1분마다 체인링크 노드가 실행시킨다. 
이 함수가 매핑에 들어있는 데이터 개수만큼 반복문을 돌려서, 
레벨 1인 뱃지는 실버등급에 맞는 uri를 , 레벨 2인 뱃지는 골드 uri로 바꿔준다.












