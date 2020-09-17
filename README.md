# MARU SERVER

#### 뉴노멀 시대에 언제, 어디서나 인문학적 소양을 기를 수 있고 진솔한 소통을 할 수 있는 공간, 마루입니다.


MARU는 대학생 연합 IT 벤처창업 동아리 SOPT 내에서 애플리케이션 개발 프로젝트를  함께한 멤버들로 구성되어 있습니다. 

팀 단위의 협업을 같이 경험하고 다양한 관점들을 공유한 저희는 “마루”를 개발하면서 다시 한 번 팀 단위의 역량을 배양할 수 있었습니다.
  
<br>

<div>
 <img src="https://user-images.githubusercontent.com/58697091/93447777-c4cece00-f90d-11ea-9720-70cb41d13168.png" width="200" height="300">
</div>
  
<br>

# 😊 About MARU

> [API Specification](https://github.com/bookmaru/MARU-SERVER/wiki)
> 
>  Project Period : 2020.08~2020.09

> Member : [정효원](https://github.com/Jeong-Hyowon),  [최정균](https://github.com/wjdrbs96),  [손예지](https://github.com/yezgoget)
  
<br>

# 💥 Main Function
>  소켓통신을 이용한 토론 - [정효원](https://github.com/Jeong-Hyowon)
```javascript
// 'connection' 이벤트 발생
io.on('connection', (socket) => {

  // 클라이언트 접속 끊을 시 on('disconnect') 발생
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  // room 나가기 : socket.leave
  socket.on('leaveRoom', (roomIdx, name) => {
    socket.leave(room[roomIdx], () => {
      io.to(room[roomIdx]).emit('leaveRoom', roomIdx, name);
    });
  });
  // 토론에서 벗어난 시간 체크
  socket.on('leave', (name, roomIdx) => {
    var date=new Date();
    let disconnectTime = moment(date).format('YYYY-MM-DD HH:mm:ss');

    //디비 통신 부분
  });

  // 특정 room 에게 이벤트 보낼 시 : io.to('room이름').emit()
    socket.on('joinRoom', (roomIdx, name) => {
    socket.join(room[roomIdx], () => {
      room.push('room'+roomIdx);
      io.to(room[roomIdx]).emit('joinRoom', roomIdx,name);
    });
  });

//클라 : socket.emit('chat message') , 서버 : socket.on('chat message') 매개변수 : name, msg, roomIdx
  socket.on('chat message', (name, msg, roomIdx) => {
    a=roomIdx;
    var date = new Date(); 
    let chatTime = moment(date).format('YYYY-MM-DD HH:mm:ss');

    //디비 통신 부분
    io.to(room[a]).emit('chat message', name, msg);
  });
  });
});
```
  
<br>

> KAKAO API를 이용한 책 검색 - [최정균](https://github.com/wjdrbs96)
 ```javascript
 const options = {
  kakaoTest: async(title) => {
    return {
      url: `https://dapi.kakao.com/v3/search/book?target=title`,
      method: 'GET',
      headers: {
        'Authorization': '',
      },
      qs: {
        query : title,
      },
      encoding: 'UTF-8',
    }
  }
}
module.exports = options;
 ```
 ```javascript
request(kakao, function (err, response, body) {
if (!err && response.statusCode == 200) {
  const book = JSON.parse(body).documents;
  
  // 검색한 결과가 존재하지 않을 때
  if (book.length === 0) {
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH));
    return;
  }

  // 검색 결과가 존재할 때
  bookList = [];
  
  for (let item of book) {
    bookList.push({
      authors : item.authors[0],
      title : item.title,
      thumbnail : item.thumbnail
    })
  }

  res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS_SEARCH, bookList))
}
 ```
   
<br>

> Firebase를 이용한 알림 구현 - [손예지](https://github.com/yezgoget)
```javascript
try {
    const deviceTokens = await alarmModel.getDeviceToken(roomIdx, nickName);
    const registrationTokens = []; //디바이스 등록

    for (let i = 0; i < deviceTokens.length; ++i) {
        if (deviceTokens[i].deviceToken == null) {
            res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.INTERNAL_SERVER_ERROR));
            return;
        }
        registrationTokens.push(deviceTokens[i].deviceToken);
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: ""
        });
    }
    var options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24 * 2
    };

    //payload
    var payload = {
        notification: {
            title: title,
            body: nickName + " : " + message,
        },
    };
```
  
<br>

## 💻 package.json
```
"dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^8.2.0",
    "ejs": "^3.1.5",
    "express": "~4.16.1",
    "fcm-node": "^1.5.2",
    "firebase-admin": "^9.2.0",
    "http-errors": "^1.6.3",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.27.0",
    "moment-timezone": "^0.5.31",
    "morgan": "~1.9.1",
    "nodemon": "^2.0.4",
    "pbkdf2": "^3.1.1",
    "promise-mysql": "^4.1.3",
    "rand-token": "^1.0.1",
    "request": "^2.88.2",
    "serve-favicon": "^2.5.0",
    "socket.io": "^2.3.0"
  }
```
  
<br>

## 🌟 RULE

* Coding Convention
* Git Convention

## 💬 Code Convention

> ❗naming

```
1. **변수명, 파일명** : 카멜케이스  (`inputBox`)
2. **폴더명** : 소문자 (`inputbox`)
3. **클래스명** : 첫글자 대문자 (`InputBox`)
```

*  var  보다는 let, const 지향
*  비동기
   *  promise의 then보다는 async/await 사용
  
<br>

# 👉 Git Convention

> branch

* master
  * develop
  * feature_jg
  * feature_yz
  * feature_hw
  

> Commit Message

```
CREATE - 기능 구현
UPDATE - 코드 수정
MERGE - 코드 병합
FIX - 버그 수정
RELEASE - 버전 배포
DELETE - 기능 삭제
DOCS - 문서 편집
```
