/**
 * Created by HongIl on 2015-08-25.
 */
enchant();          // 전역에 enchant모듈의 객체?가 생김

//WCS                We Cording Success 네임스페이스
var WCS = WCS || {};

if(!enchant.Node.prototype.hong || !enchant.Node.prototype.emit) {
    enchant.Node.prototype.hong = function(evtname, handler) {
        if(this['_eventhandler_' + evtname]) {
            this['_eventhandler_' + evtname].push( handler );
        } else {
            this['_eventhandler_' + evtname] = [handler];
        }
    }
    enchant.Node.prototype.emit = function(evtname) {


        if(this['_eventhandler_' + evtname]) {
            var arr = this['_eventhandler_' + evtname];
            for(var i in arr) {
                arr[i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
}

if(!WCS.on || !WCS.emit) {
    WCS.on = function(evtname, handler) {
        if(this['_eventhandler_' + evtname]) {
            this['_eventhandler_' + evtname].push( handler );
        } else {
            this['_eventhandler_' + evtname] = [handler];
        }
    }
    WCS.emit = function(evtname) {

        if(this['_eventhandler_' + evtname]) {
            var arr = this['_eventhandler_' + evtname];
            for(var i in arr) {
                arr[i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
}

WCS.namespace = function (inputString) {
    var parts = inputString.split("."),
        parent = WCS,
        i;

    // 처음에 중복되는 전역 객체명의 제거한다.
    if (parts[0] === "WCS") {
        parts = parts.slice(1);
    }

    for (var i = 0, max = parts.length; i < max; i++) {
        // 프로퍼티가 존재하지 않으면 생성한다.
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
};


/*
 WCS.players -> 플레이어들
 */
WCS.players = {};
WCS.namespace("players.red");   // reference -> 자신의 참조, enemy -> 적의 참조
WCS.namespace("players.blue");
WCS.players.admin = (function(){
    var i = 0;
    WCS.on("newPlayer", function(data){

        i +=1;
        switch(i){
            case 1 :
                console.log("red생성");
                WCS.namespace("players.red").name = data.name;
                WCS.namespace("players.red").reference = data.reference;
                break;
            case 2 :
                console.log("blue생성");
                WCS.namespace("players.blue").name = data.name;
                WCS.namespace("players.blue").reference = data.reference;

                WCS.namespace("players.red").enemy = data.reference;
                WCS.namespace("players.red").reference.setEnemy(data.reference);

                WCS.namespace("players.blue").enemy = WCS.namespace("players.red").reference;
                WCS.namespace("players.blue").reference.setEnemy(WCS.namespace("players.blue").enemy);
                break;
            default :
                console.log("캐릭터는 2명을 초과할 수 없습니다.")
                break;
        };
    });
}());



/*
 WCS.image -> 이미지 폴더및 파일 배열
 */
WCS.namespace("image.basic");
WCS.image.basic.path = "/wcsGame/image/basic/";
WCS.image.basic.images = ["angleBack.png",                // 0  각도 배경
    "attackArrow.png",              // 1  공격 각도 화살표
    "character.png",                // 2  기본 캐릭터 이미지
    "exclosionEffect.png",          // 3  폭발 이미지
    "hitIcon.gif",                  // 4  히트 아이콘
    "icon0.png",                    // 5  아이콘 모음(Apple)
    "mark.png",                     // 6  느낌표 이미지
    "seeAngle.png",                 // 7  시야각 이미지
    "finalMap.gif",                 // 8  맵
    "Achar.png",                    // 9  A 캐릭터
    "Bchar.png",                    // 10 B 캐릭터
    "back.png",                     // 11 back(각도)
    "keyboard.png",                 // 12 key(키)
    "weapon1.png",                  // 13 무기
    "bar.png",                       // 14 체력바
    "winLose.png"                   // 15 winLose
    ];
WCS.image.basic.imageArray = (function () {
    // path + images를 리턴하는 즉시함수
    var path = WCS.image.basic.path,
        images = WCS.image.basic.images,
        arrays = [];

    for (var i = 0, max = images.length; i < max; i+= 1) {
        var img =  path + images[i];
        arrays.push(img);
    }

    return arrays;

}());




/*
 WCS.class -> 각종 생성자 클래스
 */
WCS.namespace("class");

WCS.playerNumber = 0;



// 캐릭터 생성 클래스
WCS.class.player = enchant.Class.create (enchant.Sprite, {

    initialize: function (x, y, name) {

        enchant.Sprite.call(this, 32, 32);






        // 생성자
        var AttackArrow = WCS.namespace("class.attackArrow"),
            Circle = WCS.namespace("class.circle"),
            NameLabel = WCS.namespace("class.nameLabel"),
            StateLabel = WCS.namespace("class.stateLabel"),
            Mark =WCS.namespace("class.mark"),
            CharaterStateLabel = WCS.namespace("class.characterStateLabel"),
            ChatLabel = WCS.namespace("class.chatLabel"),
            Back = WCS.namespace("class.back"),
            Key = WCS.namespace("class.key"),
            Step = WCS.namespace("class.step"),
            Bar = WCS.namespace("class.bar");

        // 기본

        WCS.playerNumber++;
        if(WCS.playerNumber == 1) {
            this.image = WCS.game.assets[WCS.image.basic.imageArray[9]];
            this.frame = 27;
        } else {
            this.image = WCS.game.assets[WCS.image.basic.imageArray[10]];
            this.frame = 27;
            //this.tempFrame = 24;
        }


        this.moveTo(x, y);

        // 커스텀
        // 모든 프로퍼티들은 나중에 중재자를 통해 가려지므로
        // 사용자가 임의로 바꿀수도 없으므로 클로져구현없이
        // this로 도배
        this.walk = 0;                                 // 움직임(움직임에 따라 프레임이 다르다)
        this.moving = false;                           // 움직이는 중인가?
        this.direction = 3;                            // 움직이는 방향 프레임
        this.speed = 0;                                // 속도
        this.name = name;                              // 이름
        this.tempRotation = 0;                         // 일시적인 각도
        this.heading = 90;                               // 바라보는 각도
        this.radian = this.heading * (Math.PI / 180);         // 바라보는 각도의 라디언
        this.vx = Math.cos(this.radian);                    // 향하는 x방향
        this.vy = Math.sin(this.radian);                    // 향하는 y방향
        this.hp = 300;                                  // 체력
        this.enemy = null;
        this.attackAngle = 90;
        this.power = 0;
        this.cool = 0;
        this.moveState;
        this.turnState;
        this.turnGunState;
        this.turnRadarState;
        this.radarAngle = 90;
        this.attackAngleAngle = 0;

        var ddong = WCS.namespace("class.ddong");







        // 다른 클래스 참조
        this.apple= null;              // 사과임
        this.attackArrow = new AttackArrow(this);       // 공격방향
        this.circle = new Circle(this);            // 시야범위
        this.nameLabel = new NameLabel(this);         // 이름라벨
        //this.stateLabel = new StateLabel(this);        // 상태라벨
        this.mark = new Mark(this);              // 느낌표
        this.charaterStateLabel = new CharaterStateLabel(this);
        this.chatLabel = new ChatLabel(this);
        this.back = new Back(this);
        this.bar = new Bar(this);


        WCS.scene.addChild(this);

        //키보드 이미지

        this.keyUp = new Key(this, "up");
        this.keyDown = new Key(this, "down");
        this.keyLeft = new Key(this, "left");
        this.keyRight = new Key(this, "right");
        this.keyA = new Key(this, "a");
        this.keyD = new Key(this, "d");
        this.keySpace = new Key(this, "space");


        // 이동 관련
        this.minSpeed = 0;                 // 최소 스피드
        this.maxSpeed = 4;                 // 최대 스피드
        this.aheadToDistance = 0;              // 이동해야 할  거리
        this.aheadDistance = 0;                // 이동한 거리
        this.aheadState = false;
        this.aheadSpeed = 0;

        this.on(Event.ENTER_FRAME, function calcualte() {


            if(this.hp<=0){
                WCS.game.stop();
                window.open("/final/gameStop/" + this.name + "/" + "210" +"/" + this.enemy.name + "/" + "140", '_blank');
                self.opener=self;
                window.close();
            }

            this.speed = this.aheadSpeed || this.backSpeed;

            this.radian = this.heading * (Math.PI/180);
            this.vx = Math.cos(this.radian);
            this.vy = Math.sin(this.radian);


        });

        this.attackAction = false;
        this.attackActionDuration = 0;

        this.on(Event.ENTER_FRAME, function frame() {

            this.emit("run");

            if(45 < this.heading && this.heading < 135 ) {
                this.direction = 3;
                this.rotation = 0;
                this.rotate(90 - this.heading);
            };
            if(135 <= this.heading && this.heading < 225) {
                this.direction = 1;
                this.rotation = 0;
                this.rotate(180 - this.heading);
            };
            if(225 <= this.heading && this.heading <= 315) {
                this.direction = 0;
                this.rotation = 0;
                this.rotate(-(this.heading - 270));
            }
            if(0<= this.heading && this.heading <= 45 || 315 < this.heading && this.heading <= 360 )  {
                this.direction = 2;
                this.rotation = 0;
                this.rotate(360-this.heading);
            }


            this.walk ++;
            this.walk %= 3;

            if(this.attackAction){
                this.frame = this.direction * 9 + this.walk + 6;
                this.attackActionDuration += 1;
                if(this.attackActionDuration == 6){
                    this.attackActionDuration = 0;
                    this.attackAction = false;
                }

            } else {
                this.frame = this.direction * 9 + this.walk;
            }




            if(this.heading == 360){
                this.heading = 0;
            }
            if(this.heading > 360){
                this.heading -= 360;
            }
            if(this.heading < 0) {
                this.heading += 360;
            }

            if(this.attackAngle == 360){
                this.attackAngle = 0;
            }
            if(this.attackAngle > 360){
                this.attackAngle -= 360;
            }
            if(this.attackAngle < 0) {
                this.attackAngle += 360;
            }

            if(this.radarAngle == 360){
                this.radarAngle= 0;
            }
            if(this.radarAngle > 360){
                this.radarAngle -= 360;
            }
            if(this.radarAngle < 0) {
                this.radarAngle += 360;
            }






        });

        this.on(Event.ENTER_FRAME, function ahead(){



            if (this.aheadToDistance > this.aheadDistance || this.aheadSpeed != this.minSpeed) {
                this.moving = true;
                this.keyUp.duration = 10;
                if(this.age%9 == 0){
                    var step = new Step(this);
                }



                var aheadLeftDistance = this.aheadToDistance - this.aheadDistance;

                if(aheadLeftDistance / this.aheadSpeed < 1) {
                    if(this.aheadSpeed != this.minSpeed){
                        this.aheadSpeed -= 1;
                    } else {
                        this.aheadSpeed = 0;
                    }
                } else {
                    if(this.aheadSpeed < this.maxSpeed) {
                        this.aheadSpeed += 0.5;
                    }
                }

                if(WCS.map.hitTest(this.x + (this.vx * this.aheadSpeed), this.y + (-1 * this.vy * this.aheadSpeed))) {
                    this.hp -= Math.abs(this.aheadSpeed * 0.5 - 1);
                    this.emit("wallBlock", "ahead");
                    this.aheadSpeed = 0;
                }


                this.x += this.vx * this.aheadSpeed;
                this.y += -1 * this.vy * this.aheadSpeed;

                this.aheadDistance += Math.sqrt((Math.pow((this.vx * this.aheadSpeed), 2))
                    +(Math.pow((-1 * this.vy * this.aheadSpeed), 2)));
            } else {


                if(this.moveState == "ahead") {
                    this.moveState = false;
                    this.emit("moveEnd");
                } else  {
                    this.emit("stoping", "ahead");
                }

            }
        });

        this.backToDistance = 0;              // 이동해야 할  거리
        this.backDistance = 0;                // 이동한 거리
        this.backSpeed = 0;
        this.on(Event.ENTER_FRAME, function back(){



            if (this.backToDistance > this.backDistance ||this.backSpeed != this.minSpeed) {
                this.moving = true;
                this.keyDown.duration = 10;
                if(this.age%9 == 0){
                    var step = new Step(this);
                }

                var backLeftDistance = this.backToDistance - this.backDistance;

                if(backLeftDistance / this.backSpeed < 1) {
                    if(this.backSpeed != this.minSpeed){
                        this.backSpeed -= 1;
                    }
                } else {
                    if(this.backSpeed < this.maxSpeed) {
                        this.backSpeed += 0.5;
                    }
                }

                if(WCS.map.hitTest(this.x - (this.vx * this.backSpeed), this.y - (-1 * this.vy * this.backSpeed))) {
                    this.hp -= Math.abs(this.backSpeed * 0.5 - 1);
                    this.emit("wallBlock", "back");
                    this.backSpeed = 0;
                }


                this.x -= this.vx * this.backSpeed;
                this.y -= -1 * this.vy * this.backSpeed;

                this.backDistance += Math.sqrt((Math.pow((this.vx * this.backSpeed), 2))
                    +(Math.pow((-1 * this.vy * this.backSpeed), 2)));
            } else {
                if(this.moveState == "back") {
                    this.moveState = false;
                    this.emit("moveEnd");
                } else {
                    this.emit("stoping", "back");
                }

            }

        });


        this.turnLeftToAngle = 0;
        this.turnLeftAngle = 0;

        this.on(Event.ENTER_FRAME, function turnLeft(){




            if(this.turnLeftToAngle != this.turnLeftAngle) {
                this.keyLeft.duration = 10;

                var turnLeftLeftAngle = this.turnLeftToAngle - this.turnLeftAngle;

                if (turnLeftLeftAngle / (10 - Math.floor(this.speed)) < 1) {

                    this.heading += turnLeftLeftAngle;
                    this.turnLeftAngle += turnLeftLeftAngle;

                } else {

                    this.heading += (10 - Math.floor(this.speed));
                    this.turnLeftAngle += (10 - Math.floor(this.speed));
                }


            }else {
                if(this.turnState == "turnLeft") {
                    this.turnState = false;
                    this.emit("turnEnd");
                } else {
                    this.emit("stoping", "turnLeft");
                }

            }


        });

        this.turnRightToAngle = 0;
        this.turnRightAngle = 0;

        this.on(Event.ENTER_FRAME, function turnRight(){


            if(this.turnRightToAngle != this.turnRightAngle) {
                this.keyRight.duration = 10;


                var turnRightLeftAngle = this.turnRightToAngle - this.turnRightAngle;

                if (turnRightLeftAngle / (10 - Math.floor(this.speed)) < 1) {

                    this.heading -= turnRightLeftAngle;
                    this.turnRightAngle += turnRightLeftAngle;

                } else {

                    this.heading -= (10 - Math.floor(this.speed));
                    this.turnRightAngle += (10 - Math.floor(this.speed));
                }


            }else {
                if(this.turnState == "turnRight") {
                    this.turnState = false;
                    this.emit("turnEnd");
                } else {
                    this.emit("stoping", "turnRight");
                }

            }

        });



        this.turnRadarLeftToAngle = 0;
        this.turnRadarLeftAngle = 0;
        this.on(Event.ENTER_FRAME, function turnRadarLeft() {

            var turnRadarLeftLeftAngle = this.turnRadarLeftToAngle - this.turnRadarLeftAngle;

            if(this.turnRadarLeftToAngle != this.turnRadarLeftAngle) {
                this.keyA.duration = 10;
                if(turnRadarLeftLeftAngle / 20 < 1) {
                    this.radarAngle += turnRadarLeftLeftAngle;

                    this.turnRadarLeftAngle += turnRadarLeftLeftAngle;
                } else {
                    this.radarAngle += 20;

                    this.turnRadarLeftAngle += 20;

                }
            }else {
                if(this.turnRadarState == "turnRadarLeft") {
                    this.turnRadarState = false;
                    this.emit("turnRadarEnd");
                } else {
                    this.emit("stoping", "turnRadarLeft");
                }


            }
        });



        this.turnRadarRightToAngle = 0;
        this.turnRadarRightAngle = 0;
        this.on(Event.ENTER_FRAME, function turnRadarRight() {

            var turnRadarRightLeftAngle = this.turnRadarRightToAngle - this.turnRadarRightAngle;

            if(this.turnRadarRightToAngle != this.turnRadarRightAngle) {
                this.keyD.duration = 10;
                if(turnRadarRightLeftAngle / 20 < 1) {
                    this.radarAngle -= turnRadarRightLeftAngle;

                    this.turnRadarRightAngle += turnRadarRightLeftAngle;
                } else {
                    this.radarAngle -= 20;

                    this.turnRadarRightAngle += 20;

                }
            }else {
                if(this.turnRadarState == "turnRadarRight") {
                    this.turnRadarState = false;
                    this.emit("turnRadarEnd");
                } else {
                    this.emit("stoping", "turnRadarRight");
                }


            }
        });



        this.on(Event.ENTER_FRAME, function attack(){

            this.cool -= 0.1;



            if(this.power != 0 && this.cool <= 0) {
                this.keySpace.duration = 10;

                this.attackActionDuration = 0;
                this.attackAction = true;
                this.cool = this.power / 5 + 1;
                new ddong(this, this.attackAngle, this.enemy, this.power);
                this.hp -= this.power / 3;
                //this.frame = this.direction +6;
            }

        });

        this.on(Event.ENTER_FRAME, function hp(){
            if(this.hp > 300){
                this.hp = 300;
            }
            if(this.hp <= 0){
                //WCS.game.stop();
            }
        });

        /*this.on(Event.ENTER_FRAME, function wall(){
         if(!WCS.map.hitTest(this.x, this.y)) {
         this.emit("wallBlock");
         }
         });*/



    },
    setEnemy: function (enemy) {
        this.enemy = enemy;

        this.on(Event.ENTER_FRAME, function radar() {
            // 적이 100pixel 안에 있고 시야각 안에 있다면
            if ( this.within(this.enemy, 100) && seeIn(this.radarAngle, this, this.enemy) ) {
                this.mark.opacity = 1; // 마크 보이게

                var enemyRadian = Math.atan2((enemy.x - this.x), (enemy.y - this.y));
                this.emit("scan", { heading: enemy.heading,
                    bearing: (enemyRadian * 180 / Math.PI + 270 < 360) ? enemyRadian * 180 / Math.PI + 270 : enemyRadian * 180 / Math.PI + 270 - 360,
                    distance: Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)) ,
                    speed: enemy.speed,
                    heading: enemy.heading});
            } else {
                this.mark.opacity = 0; // 마크 안보이게
            }

        });


        this.on(Event.ENTER_FRAME, function hitOn(){
            var enemyRadian = Math.atan2((enemy.x - this.x), (enemy.y - this.y));
           if(this.within(this.enemy,32)) {
               this.emit("hit",{ heading: enemy.heading,
                   bearing: (enemyRadian * 180 / Math.PI + 180 < 360) ? enemyRadian * 180 / Math.PI + 180 : enemyRadian * 180 / Math.PI + 180 - 360,
                   distance: Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)) ,
                   speed: enemy.speed,
                   heading: enemy.heading,
                   hp:enemy.hp});
           }
        });

    }

});

WCS.class.keyboardPlayer = enchant.Class.create (enchant.Sprite, {

    initialize: function (x, y, name) {

        enchant.Sprite.call(this, 32, 32);






        // 생성자
        var AttackArrow = WCS.namespace("class.attackArrow"),
            NameLabel = WCS.namespace("class.nameLabel"),
            StateLabel = WCS.namespace("class.stateLabel"),
            Mark =WCS.namespace("class.mark"),
            CharaterStateLabel = WCS.namespace("class.characterStateLabel"),
            ChatLabel = WCS.namespace("class.chatLabel"),
            Back = WCS.namespace("class.back"),
            Key = WCS.namespace("class.key"),
            Step = WCS.namespace("class.step"),
            Bar = WCS.namespace("class.bar");

        WCS.playerNumber++;
        if(WCS.playerNumber == 1) {
            this.image = WCS.game.assets[WCS.image.basic.imageArray[9]];
            this.frame = 27;
        } else {
            this.image = WCS.game.assets[WCS.image.basic.imageArray[10]];
            this.frame = 27;
            //this.tempFrame = 24;
        }


        this.moveTo(x, y);

        // 커스텀
        // 모든 프로퍼티들은 나중에 중재자를 통해 가려지므로
        // 사용자가 임의로 바꿀수도 없으므로 클로져구현없이
        // this로 도배
        this.walk = 0;                                 // 움직임(움직임에 따라 프레임이 다르다)
        this.moving = false;                           // 움직이는 중인가?
        this.direction = 3;                            // 움직이는 방향 프레임
        this.speed = 0;                                // 속도
        this.name = "keyBoard";                              // 이름
        this.tempRotation = 0;                         // 일시적인 각도
        this.heading = 90;                               // 바라보는 각도
        this.radian = this.heading * (Math.PI / 180);         // 바라보는 각도의 라디언
        this.vx = Math.cos(this.radian);                    // 향하는 x방향
        this.vy = Math.sin(this.radian);                    // 향하는 y방향
        this.hp = 300;                                  // 체력
        this.enemy = null;
        this.attackAngle = 90;
        this.power = 0;
        this.cool = 0;
        this.moveState;
        this.turnState;
        this.turnGunState;
        this.turnRadarState;
        this.radarAngle = 90;

        var ddong = WCS.namespace("class.ddong");

        // 다른 클래스 참조
        this.apple= null;              // 사과임
        this.attackArrow = new AttackArrow(this);       // 공격방향
        this.nameLabel = new NameLabel(this);         // 이름라벨
        //this.stateLabel = new StateLabel(this);        // 상태라벨
        this.mark = new Mark(this);              // 느낌표
        this.CharaterStateLabel = new CharaterStateLabel(this);
        this.chatLabel = new ChatLabel(this);
        this.back = new Back(this);
        this.bar = new Bar(this);


        WCS.scene.addChild(this);

        //키보드 이미지

        this.keyUp = new Key(this, "up");
        this.keyDown = new Key(this, "down");
        this.keyLeft = new Key(this, "left");
        this.keyRight = new Key(this, "right");
        this.keyA = new Key(this, "a");
        this.keyD = new Key(this, "d");
        this.keySpace = new Key(this, "space");


        // 이동 관련
        this.minSpeed = 0;                 // 최소 스피드
        this.maxSpeed = 4;                 // 최대 스피드
        this.aheadToDistance = 0;              // 이동해야 할  거리
        this.aheadDistance = 0;                // 이동한 거리
        this.aheadState = false;
        this.aheadSpeed = 0;
        this.backSpeed = 0;


        this.on(Event.ENTER_FRAME, function calcualte() {

            if(this.hp<=0){
                WCS.game.stop();
                window.open("/final/gameStop/" + this.name + "/" + "210" +"/" + this.enemy.name + "/" + "140", '_blank');
                self.opener=self;
                window.close();
            }

            this.speed = this.aheadSpeed || this.backSpeed;

            this.radian = this.heading * (Math.PI/180);
            this.vx = Math.cos(this.radian);
            this.vy = Math.sin(this.radian);


        });

        this.attackAction = false;
        this.attackActionDuration = 0;

        this.on(Event.ENTER_FRAME, function frame() {

            if(45 < this.heading && this.heading < 135 ) {
                this.direction = 3;
                this.rotation = 0;
                this.rotate(90 - this.heading);
            };
            if(135 <= this.heading && this.heading < 225) {
                this.direction = 1;
                this.rotation = 0;
                this.rotate(180 - this.heading);
            };
            if(225 <= this.heading && this.heading <= 315) {
                this.direction = 0;
                this.rotation = 0;
                this.rotate(-(this.heading - 270));
            }
            if(0<= this.heading && this.heading <= 45 || 315 < this.heading && this.heading <= 360 )  {
                this.direction = 2;
                this.rotation = 0;
                this.rotate(360-this.heading);
            }


            this.walk ++;
            this.walk %= 3;



            if(this.attackAction){
                this.frame = this.direction * 9 + this.walk + 6;
                this.attackActionDuration += 1;
                if(this.attackActionDuration == 6){
                    this.attackActionDuration = 0;
                    this.attackAction = false;
                }

            } else {
                this.frame = this.direction * 9 + this.walk;
            }







            if(this.heading == 360){
                this.heading = 0;
            }
            if(this.heading > 360){
                this.heading -= 360;
            }
            if(this.heading < 0) {
                this.heading += 360;
            }

            if(this.attackAngle == 360){
                this.attackAngle = 0;
            }
            if(this.attackAngle > 360){
                this.attackAngle -= 360;
            }
            if(this.attackAngle < 0) {
                this.attackAngle += 360;
            }

            if(this.radarAngle == 360){
                this.radarAngle= 0;
            }
            if(this.radarAngle > 360){
                this.radarAngle -= 360;
            }
            if(this.radarAngle < 0) {
                this.radarAngle += 360;
            }




        });



        this.turnLeftToAngle = 0;
        this.turnLeftAngle = 0;

        this.on(Event.ENTER_FRAME, function turnLeft(){




            if(this.turnLeftToAngle != this.turnLeftAngle) {

                var turnLeftLeftAngle = this.turnLeftToAngle - this.turnLeftAngle;

                if (turnLeftLeftAngle / (10 - Math.floor(this.speed)) < 1) {

                    this.heading += turnLeftLeftAngle;
                    this.turnLeftAngle += turnLeftLeftAngle;

                } else {

                    this.heading += (10 - Math.floor(this.speed));
                    this.turnLeftAngle += (10 - Math.floor(this.speed));
                }


            }else {
                if(this.turnState == "turnLeft") {
                    this.turnState = false;
                    this.emit("turnEnd");
                } else {
                    this.emit("stoping", "turnLeft");
                }

            }


        });

        this.turnRightToAngle = 0;
        this.turnRightAngle = 0;

        this.on(Event.ENTER_FRAME, function turnRight(){


            if(this.turnRightToAngle != this.turnRightAngle) {


                var turnRightLeftAngle = this.turnRightToAngle - this.turnRightAngle;

                if (turnRightLeftAngle / (10 - Math.floor(this.speed)) < 1) {

                    this.heading -= turnRightLeftAngle;
                    this.turnRightAngle += turnRightLeftAngle;

                } else {

                    this.heading -= (10 - Math.floor(this.speed));
                    this.turnRightAngle += (10 - Math.floor(this.speed));
                }


            }else {
                if(this.turnState == "turnRight") {
                    this.turnState = false;
                    this.emit("turnEnd");
                } else {
                    this.emit("stoping", "turnRight");
                }

            }

        });


        this.turnGunRightToAngle = 0;
        this.turnGunRightAngle = 0;
        this.on(Event.ENTER_FRAME, function turnGunRight() {

            var turnGunRightLeftAngle = this.turnGunRightToAngle - this.turnGunRightAngle;

            if(this.turnGunRightToAngle != this.turnGunRightAngle) {
                if(turnGunRightLeftAngle / 20 < 1) {
                    this.attackAngle -= turnGunRightLeftAngle;

                    this.turnGunRightAngle += turnGunRightLeftAngle;
                } else {
                    this.attackAngle -= 20;

                    this.turnGunRightAngle += 20;

                }
            }else {
                if(this.turnGunState == "turnGunRight") {
                    this.turnGunState = false;
                    this.emit("turnGunEnd");
                } else {
                    this.emit("stoping", "turnGunRight");
                }

            }
        });


        this.turnGunLeftToAngle = 0;
        this.turnGunLeftAngle = 0;
        this.on(Event.ENTER_FRAME, function turnGunLeft() {

            var turnGunLeftLeftAngle = this.turnGunLeftToAngle - this.turnGunLeftAngle;

            if(this.turnGunLeftToAngle != this.turnGunLeftAngle) {
                if(turnGunLeftLeftAngle / 20 < 1) {
                    this.attackAngle += turnGunLeftLeftAngle;

                    this.turnGunLeftAngle += turnGunLeftLeftAngle;
                } else {
                    this.attackAngle += 20;

                    this.turnGunLeftAngle += 20;

                }
            }else {
                if(this.turnGunState == "turnGunLeft") {
                    this.turnGunState = false;
                    this.emit("turnGunEnd");
                } else {
                    this.emit("stoping", "turnGunLeft");
                }


            }
        });

        this.on(Event.ENTER_FRAME, function attack(){

            this.cool -= 0.1;
            this.power = between(0.1, 3);

        });

        this.on(Event.ENTER_FRAME, function hp(){
            if(this.hp > 300){
                this.hp = 300;
            }
            if(this.hp <= 0){
                //WCS.game.stop();
            }
        });

        this.on(Event.ENTER_FRAME, function keyboard(){
            if (WCS.game .input.a) {
                this.keyA.duration = 10;
                this.turnGunLeftToAngle += 5;
            }

            if (WCS.game.input.d) {
                this.keyD.duration = 10;

                this.turnGunRightToAngle += 5;
            };

            if (WCS.game.input.space) {
                if(this.cool <= 0) {
                    this.keySpace.duration = 10;
                    this.attackActionDuration = 0;
                    this.attackAction = true;
                    this.cool = this.power / 5 + 1;
                    new ddong(this, this.attackAngle, this.enemy, this.power);
                    this.hp -= this.power / 3 ;

                }
            };

            if (WCS.game.input.up) {
                this.keyUp.duration = 10;
                if(this.age%9 == 0){
                    var step = new Step(this);
                }
                if(this.aheadSpeed < this.maxSpeed){
                    this.aheadSpeed += 0.5;
                }
                if(WCS.map.hitTest(this.x + (this.vx * this.aheadSpeed), this.y + (-1 * this.vy * this.aheadSpeed))) {
                    this.hp -= Math.abs(this.aheadSpeed * 0.5 - 1);
                    this.aheadSpeed = 0;
                }

                this.x += this.vx * this.aheadSpeed;
                this.y += -1 * this.vy * this.aheadSpeed;
            } else {
                if(this.aheadSpeed > 0){
                    this.aheadSpeed -= 1;
                }
            };

            if (WCS.game.input.down) {
                this.keyDown.duration = 10;
                if(this.age%9 == 0){
                    var step = new Step(this);
                }
                if(this.backSpeed < this.maxSpeed){
                    this.backSpeed += 0.5;
                }
                if(WCS.map.hitTest(this.x - (this.vx * this.backSpeed), this.y - (-1 * this.vy * this.backSpeed))) {
                    this.hp -= Math.abs(this.backSpeed * 0.5 - 1);
                    this.backSpeed = 0;
                }


                this.x -= this.vx * this.speed;
                this.y -= -1 * this.vy * this.speed;

            } else {
                if(this.backSpeed > 0){
                    this.backSpeed -= 1;
                }
            };

            if (WCS.game.input.right) {
                this.keyRight.duration = 10;
                this.turnRightToAngle += 5;
            };

            if (WCS.game.input.left) {
                this.keyLeft.duration = 10;
                this.turnLeftToAngle += 5;
            };




        });





    },
    setEnemy: function (enemy) {
        this.enemy = enemy;

        this.on(Event.ENTER_FRAME, function radar() {
            // 적이 100pixel 안에 있고 시야각 안에 있다면
            if ( this.within(this.enemy, 100) && seeIn(this.radarAngle, this, this.enemy) ) {
                this.mark.opacity = 1; // 마크 보이게

                var enemyRadian = Math.atan2((enemy.x - this.x), (enemy.y - this.y));
                this.emit("scan", { heading: enemy.heading,
                    bearing: (enemyRadian * 180 / Math.PI + 180 < 360) ? enemyRadian * 180 / Math.PI + 180 : enemyRadian * 180 / Math.PI + 180 - 360,
                    distance: Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)) ,
                    speed: enemy.speed,
                    heading: enemy.heading});
            } else {
                this.mark.opacity = 0; // 마크 안보이게
            }

        });


        this.on(Event.ENTER_FRAME, function hitOn(){
            var enemyRadian = Math.atan2((enemy.x - this.x), (enemy.y - this.y));
            if(this.within(this.enemy,32)) {
                this.emit("hit",{ heading: enemy.heading,
                    bearing: (enemyRadian * 180 / Math.PI + 180 < 360) ? enemyRadian * 180 / Math.PI + 180 : enemyRadian * 180 / Math.PI + 180 - 360,
                    distance: Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)) ,
                    speed: enemy.speed,
                    heading: enemy.heading,
                    hp:enemy.hp});
            }
        });

    }

});

// ddong클래스
// 공격방향으로 공격하는 똥 클래스
WCS.class.ddong = enchant.Class.create(enchant.Sprite, {
    initialize: function (player, angle, enemy, power) {
        enchant.Sprite.call(this, 16, 16);

        var Hitted = WCS.namespace("class.hitted"),
            HitSuccess = WCS.namespace("class.hitSuccess");

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[13]];
        this.frame = between(0,7 );
        this.moveTo(player.x + 8, player.y + 8);

        //커스텀
        this.power = power;                  // 파워

        this.speed = 20 - 5 * power;              // 파워에 따라 날아가는 속도가 다르다
        this.damage;                              // 파워에 다라 데미지가 다르다.
        this.angle = angle;                       // 받은 공격 앵글
        this.radian = this.angle * (Math.PI/180);
        this.vx = Math.cos(this.radian);
        this.vy = Math.sin(this.radian);


        if(this.power > 1) {
            this.damage = (4 * power) + (2 * (power - 1));
        } else {
            this.damage = 4 * power;
        }

        this.on(Event.ENTER_FRAME, function() {
            this.rotate(20);
            this.x += this.vx * this.speed;
            this.y += -1 * this.vy * this.speed;

            if(this.within(enemy, 16)){
                var hitted = new Hitted(enemy);
                var hitSuccess = new HitSuccess(player);
                this.remove();
                var enemyRadian = Math.atan2((enemy.x - player.x), (enemy.y - player.y));
                player.hp += 3 * this.power;

                var playerRadian = Math.atan2((player.x - enemy.x), (player.y - enemy.y));
                enemy.emit("hitted",{ heading: player.heading,
                    bearing: (playerRadian * 180 / Math.PI + 270 < 360) ? playerRadian * 180 / Math.PI + 270 : playerRadian * 180 / Math.PI + 270 - 360,
                    distance: Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2)) ,
                    speed: player.speed} );
                enemy.hp -= this.damage;

            } else if(this.x > 16 * 35 || this. x < 16 * 2 || this.y < 16* 2 || this.y >16 * 19) {
                this.remove();
            }
        });
        WCS.scene.addChild(this);
    },
    remove: function () {
        WCS.scene.removeChild(this);
    }
});

// Hitted Class
// 적에게 다으면 폭발하는 클래스
WCS.class.hitted = enchant.Class.create(enchant.Sprite, {
    initialize: function (player) {
        enchant.Sprite.call(this, 16, 16);
        shake(WCS.scene, 3   , false);


        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[3]];
        this.frame = 0;
        this.scaleX = 1.1;
        this.scaleY = 1.1;
        this.moveTo(player.x+16, player.y+16);

        //커스텀
        this.duration = 20;           //20프레임후 remove

        WCS.scene.addChild(this);

        this.on(Event.ENTER_FRAME, function(){
            this.frame = Math.floor(this.age / this.duration * 5);
            this.moveTo(player.x+8, player.y+8);

            if(this.age == this.duration) {
                this.remove();
            }
        });

    },
    remove : function(){
        WCS.scene.removeChild(this);
    }
});

//HitSucess Class
//적을마추면 HIT 아이콘
WCS.class.hitSuccess = enchant.Class.create(enchant.Sprite, {
    initialize: function (player) {
        enchant.Sprite.call(this, 33, 20);

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[4]];
        this.moveTo(player.x+30, player.y+8);

        //커스텀
        this.duration = 10;

        WCS.scene.addChild(this);

        this.on(Event.ENTER_FRAME, function(){
            this.moveTo(player.x+30, player.y+8);
            if(this.age == this.duration) {
                this.remove();
            }
        });


    },
    remove: function(){
        WCS.scene.removeChild(this);
    }
});

//Circle Class
//시야각을 표현하는 반원
WCS.class.circle = enchant.Class.create(enchant.Sprite, {

    initialize: function (player) {
        enchant.Sprite.call(this, 200, 200);

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[7]];
        this.moveTo(player.x - 100 + 16, player.y - 100 + 16);

        this.on(Event.ENTER_FRAME, function(){
            this.moveTo(player.x - 100 + 16, player.y - 100 + 16);
            this.rotation = 0;
            this.rotate(90 - player.radarAngle);
        });

        WCS.scene.addChild(this);
    }
});

//NameLabel Class
//캐릭터의 이름을 표시하는 클래스
WCS.class.nameLabel = enchant.Class.create(enchant.Label, {

    initialize: function (player) {
        enchant.Label.call(this);

        //기본
        this.text = player.name;
        this.font = "18px JejuGothic";
        this.color = "black";
        this.moveTo(player.x+5, player.y - 10);

        this.on(Event.ENTER_FRAME, function(){
            this.moveTo(player.x-1, player.y - 14);
        });

        WCS.scene.addChild(this);
    }
});

//StateLabel Class
//캐릭터의 상태를 표시하는 클래스

WCS.class.stateLabel = enchant.Class.create(enchant.Label, {
    initialize: function(player){
        enchant.Label.call(this);

        //기본
        this.height = 1;
        this.font = "22px";
        this.color = "red";
        this.moveTo(player.x, player.y + 60);

        this.on(Event.ENTER_FRAME, function(){
            this.moveTo(player.x, player.y + 60);
            this.text = "(x, y): " + player.x +", " + player.y
                + "<br>, 바라보는각도: " +player.heading
                + "<br>, 공격각도: " + player.attackAngle
                + "<br>, 스피드: " + player.speed
                + "<br>, 체력: " + player.hp
                + "<br>, 방향: " + player.direction;
        });

        WCS.scene.addChild(this);
    }
});

WCS.class.mark = enchant.Class.create(enchant.Sprite, {
    initialize: function(player) {
        enchant.Sprite.call(this, 10, 16);

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[6]];
        this.moveTo(player.x + 16, player.y - 30);
        this.opacity = 0;            // 투명도 0 -> 0%, 1 -> 100%


        this.on(Event.ENTER_FRAME, function(){
            this.moveTo(player.x + 16, player.y - 30);
        });

        WCS.scene.addChild(this);
    }
});

WCS.class.attackArrow = enchant.Class.create(enchant.Sprite, {
    initialize: function (player) {
        enchant.Sprite.call(this, 12, 29);

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[1]];
        this.moveTo(player.x + 16 - 6, player.y - 16);


        WCS.scene.addChild(this);

        this.on(Event.ENTER_FRAME, function(){
            this.moveTo(player.x + 16 - 6, player.y - 16);
            this.rotation = 0;
            this.rotate(90 - player.attackAngle);
        })
    }
});

WCS.class.characterStateLabel = enchant.Class.create(enchant.Label, {
    initialize: function(player){
        enchant.Label.call(this);

        //기본
        this.height = 1;
        this.font = "14px JejuGothic";
        this.color = "rgb(255, 255, 17)";
        this.moveTo(player.x, player.y + 60);

        this.on(Event.ENTER_FRAME, function(){

            this.text = "이름 : " + player.name
                + "<br>좌표 : " + Math.round(player.x) +", " + Math.round(player.y)
                + "<br>바라보는각도: " +Math.round(player.heading)
                + "<br>공격각도: " + Math.round(player.attackAngle)
                + "<br>스피드: " + player.speed
                + "<br>체력: " + Math.round(player.hp);
        });


        if(WCS.playerNumber == 1) {
            this.moveTo(16 * 35 + 8, 16 * 1 + 8 );
        } else {
            this.moveTo(16 * 35 + 8, 16 * 11 + 8 );
        }

        WCS.scene.addChild(this);
    }
});

WCS.class.chatLabel = enchant.Class.create(enchant.Label, {
    initialize: function(player){
        enchant.Label.call(this);

        //기본
        this.font = "12px JejuGothic";
        this.color = "black";
        this.num = 0;

        if(WCS.playerNumber == 1) {
            this.moveTo(16 , 16 * 21 );
        } else {
            this.moveTo(16*22 , 16 * 21 );
        }
        this.height = 1;


        this.on(Event.ENTER_FRAME, function(){

        });


        WCS.scene.addChild(this);
    },
    notify: function(text){
        this.num++;
        if(this.num < 5){
            this.text += text + "<br>";
        } else {
            this.num = 1;
            this.text = text + "<br>";
        }
    }
});

WCS.class.back = enchant.Class.create(enchant.Sprite, {
    initialize: function (player) {
        enchant.Sprite.call(this, 75, 75);

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[11]];
        this.moveTo(player.x  -(37.5 - 16),player.y - (37.5 - 16));


        WCS.scene.addChild(this);

        this.on(Event.ENTER_FRAME, function(){
            this.moveTo(player.x -(37.5 - 16) , player.y - (37.5 - 16));
            this.rotation = 0;
            this.rotate(90 - player.heading);
        })
    }
});

WCS.class.key = enchant.Class.create(enchant.Sprite, {
    initialize: function (player, key) {
        enchant.Sprite.call(this, 16, 16);

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[12]];
        if(key == "up") {
            this.frame = 7;
            this.moveTo(player.x-40 , player.y+48);
            this.on(Event.ENTER_FRAME, function(){
                this.moveTo(player.x-40 , player.y +48);
            });
        } else if(key == "down") {
            this.frame = 3;
            this.moveTo(player.x-40 + 16  , player.y+48);
            this.on(Event.ENTER_FRAME, function(){
                this.moveTo(player.x-40 + 16 , player.y +48);
            });
        } else if(key == "left") {
            this.frame = 4;
            this.moveTo(player.x-40 + 32  , player.y+48);
            this.on(Event.ENTER_FRAME, function(){
                this.moveTo(player.x-40 + 32 , player.y +48);
            });
        } else if(key == "right") {
            this.frame = 2;
            this.moveTo(player.x-40 + 48  , player.y+48);
            this.on(Event.ENTER_FRAME, function(){
                this.moveTo(player.x-40 + 48 , player.y +48);
            });
        } else if(key == "a") {
            this.frame = 0;
            this.moveTo(player.x-40 + 64  , player.y+48);
            this.on(Event.ENTER_FRAME, function(){
                this.moveTo(player.x-40 + 64 , player.y +48);
            });
        } else if(key == "d") {
            this.frame = 1;
            this.moveTo(player.x-40 + 80 , player.y+48);
            this.on(Event.ENTER_FRAME, function(){
                this.moveTo(player.x-40 + 80 , player.y +48);
            });
        } else if(key == "space") {
            this.frame = 6;
            this.moveTo(player.x-40 + 96 , player.y+48);
            this.on(Event.ENTER_FRAME, function(){
                this.moveTo(player.x-40 + 96 , player.y +48);
            });
        }

        this.on(Event.ENTER_FRAME, function(){
            this.duration -=1;
            if(this.duration > 0) {
                this.opacity = 0.9;
            } else {
                this.opacity = 0.3;
            };
        });


        this.opacity = 0.3;
        this.duration = 0;


        WCS.scene.addChild(this);
    }
});

WCS.class.step = enchant.Class.create(enchant.Sprite, {
    initialize: function (player) {
        enchant.Sprite.call(this, 16, 16);

        //기본
        this.image = WCS.game.assets[WCS.image.basic.imageArray[8]];
        this.moveTo(player.x + 8, player.y + 8);
        this.frame = 441;



        WCS.scene.addChild(this);
        this.duration = 40;
        this.opacity = 0.4;

        this.on(Event.ENTER_FRAME, function(){
            if(this.age == this.duration) {
                this.remove();
            }


        });


    },
    remove : function(){
        WCS.scene.removeChild(this);
    }
});

WCS.class.bar = enchant.Class.create(enchant.Sprite, {

    initialize: function(player) {
        enchant.Sprite.call(this, 1, 8);
        this.image = WCS.game.assets[WCS.image.basic.imageArray[14]];
        //this.image.context.fillColor = 'RGB(0, 0, 256)';
        //this.image.context.fillRect(0, 0, 1, 16);
        this._direction = 'right';
        this._origin = 0;
        this._maxvalue = 200;
        this._lastvalue = 0;
        this.value = 0;
        this.easing = 5;
        this.player = player;
        this.opacity = 0.8;


        WCS.scene.addChild(this);

        this.addEventListener('enterframe', function() {
            this.value = this.player.hp;
            this.x = player.x-34;
            this.y = player.y+48+16;
            if (this.value < 0) {
                this.value = 0;
            }
            this._lastvalue += (this.value - this._lastvalue) / this.easing;
            if (Math.abs(this._lastvalue - this.value) < 1.3) {
                this._lastvalue = this.value;
            }
            this.width = (this._lastvalue) | 0;
            if (this.width > this._maxvalue) {
                this.width = this._maxvalue;
            }
            if (this._direction === 'left') {
                this._x = this._origin - this.width;
            } else {
                this._x = this._origin;
            }
            this._updateCoordinate();
        });
    },
    direction: {
        get: function() {
            return this._direction;
        },
        set: function(newdirection) {
            if (newdirection !== 'right' && newdirection !== 'left') {
                // ignore
            } else {
                this._direction = newdirection;
            }
        }
    },
    x: {
        get: function() {
            return this._origin;
        },
        set: function(x) {
            this._x = x;
            this._origin = x;
            this._dirty = true;
        }
    },
    maxvalue: {
        get: function() {
            return this._maxvalue;
        },
        set: function(val) {
            this._maxvalue = val;
        }
    }
});





function shake(sprite, magnitude, angular ){


    var shakingSprites = [];

    if(shakingSprites.length > 0){
        for(var i = shakingSprites.length -1; i >= 0; i-- ){
            var shakingSprite = shakingSprites[i];
            if(shakingSprite.updateShake){
                shakingSprite.updateShake();
            }
        }
    }

    var counter = 1;

    var numberOfShakes = 10;

    var startX = sprite.x,
        startY = sprite.y,
        startAngle = sprite.rotation;



    var magnitudeUnit = magnitude / numberOfShakes;

    var randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if(shakingSprites.indexOf(sprite) === -1){
        shakingSprites.push(sprite);



        if(angular){
            sprite.updateShake = angularShake();
        } else {
            sprite.updateSHake = upAndDownShake();
        }


    }

    function upAndDownShake(){
        if(counter < numberOfShakes) {
            sprite.x = startX;
            sprite.y = startY;
            magnitude -= magnitudeUnit;

            sprite.x += randomInt(-magnitude, magnitude);
            sprite.y += randomInt(-magnitude, magnitude);

            counter += 1;
        }

        if(counter >= numberOfShakes) {
            sprite.x = startX;
            sprite.y = startY;
            shakingSprites.splice(shakingSprites.indexOf(sprite), 1);
        }
    }

    var tiltAngle = 1;

    function angularShake() {
        if(counter < numberOfShakes) {
            sprite.rotaion = startAngle;

            magnitude -= magnitudeUnit;

            sprite.rotation = magnitude * tiltAngle;

            counter +=1;

            tiltAngle *= -1;

        }

        if(counter >= numberOfShakes) {
            sprite.rotation = startAngle;
            shakingSprites.splice(shakingSprites.indexOf(sprite), 1);
        }
    }





}















// 시야안에 들어왔는지 체크해주는
function seeIn (angle, player, enemy) {
    var see = 90,                                                            // 시야각 양옆 90
        angle = angle,                                                       // 내가 바라보는 각도
        myX = player.x,                                                      // 나의 x좌표
        myY = player.y,                                                      // 나의 y좌표
        enemyX = enemy.x,                                                    // 적의 x좌표
        enemyY = enemy.y,                                                    // 적의 y좌표
        radian = radianCal(enemy, player),                                   // 나와 적 사이의 라디언
        degree = degreeCal(radian),                                          // 나와 적 사이의 각도
        min,                                                                 // 최소 시야각
        max,                                                                 // 최대 시야각
        type,
        attackPossible = false;                                              // 공격 가능 여부

    if(0 <= angle && angle < 90){
        min = angle + see;
        max = angle -see + 360;
        type = 1;
    }else if(90 <= angle && angle <= 270){
        min = angle - see;
        max = angle + see;
        type = 2;

    }else if(270 < angle && angle <= 360){
        min = angle + see - 360;
        max = angle - see;
        type = 3;

    };

    function type1 (degree) {
        if ((0 <= degree && degree <= min) || (max <= degree && degree <= 360)) {
            attackPossible = true;
        }
    };

    function type2 (degree) {
        if (min <= degree && degree <= max) {
            attackPossible = true;
        }

    };

    function type3 (degree) {
        if ((0 <= degree && degree <= min) || (max <= degree && degree <= 360)) {
            attackPossible = true;
        }

    };

    switch (type) {
        case 1 :
            type1(degree);
            break;
        case 2 :
            type2(degree);
            break;
        case 3 :
            type3(degree);
            break;
    };

    return attackPossible; // true or false
}


// radian을 계산 하는 함수
function radianCal (target, me) {
    var radian,
        target = target,
        me = me || 0;

    radian = ( Math.atan2( (target.x - me.x), (target.y - me.y) ) );

    return radian;
}

function degreeCal (radian) {
    var radian = radian,
        degree;

    degree = (radian * 180 / Math.PI + 270 < 360) ?
    radian * 180 / Math.PI + 270 : radian * 180 / Math.PI + 270 - 360;

    return degree;
};

function between(min, max){

    var betweenValue = (Math.random() * (max+1)) + min;

    if(betweenValue < max){
        return betweenValue.toFixed(2);
    } else{
        return between(min, max);
    }
};


