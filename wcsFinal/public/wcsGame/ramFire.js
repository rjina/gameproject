/**
 * Created by HongIl on 2015-08-24.
 */
/**
 * Created by HongIl on 2015-08-20.
 */

function ramFire (){
    this.name = "ramFire";
    this.x = 150;
    this.y = 150;

    // this.ahead(거리)      -> 바라보는 방향으로 거리만큼 이동
    // this.back(거리)       -> 바라보는 반대방향으로 거리만큼 이동
    // this.turnRight(각도)  -> 각도만큼 오른쪽 회전
    // this.turnLeft(각도)   -> 각도만큼 왼쪽 회전
    // this.wait()          -> 이전명령 실행완료 때 까지 그다음 명령 실행x
    // this.attack(파워)     -> 0.1 ~ 3 파워로 공격각도로 공격
    // this.heading()       -> 자신이 바라보는 각도 반환 0 ~ 360
    // this.gunHeading()    -> 자신의 공격 각도 반환 0 ~ 360
    // this.getBattleHeight() -> 맵의 높이 반환
    // this.getBattleWidth() -> 맵의 넓이 반환
    // enemy.heading        -> 적이 바라보는 각도 반환 0 ~ 360
    // enemy.distance       -> 적과 나의 거리
    // enemy.bearing        -> 내 기준에서의  적의 각도 0 ~ 360
    // enemy.speed          -> 적의 현재 스피드



    var turnDirection = 1;


    this.run = function() {
        console.log("run상태");

        this.attack(0);
        this.turnRight(5*turnDirection);
        this.turnRadarRight(90);
        this.ahead(1);

    };



    this.scan = function(enemy) {
        console.log("scan상태");
        if(enemy.bearing >= 0){
            turnDirection = 1;
        } else {
            turnDirection = -1;
        }
        console.log(enemy.distance);
        this.turnRight(this.heading() - enemy.bearing);
        if(this.gun)
        this.setGunHeading(enemy.bearing);
        //전체 wait이 필요함..
        //this.wait("move");
        this.wait("turn");
        this.wait("turnGun");
        this.turnRadarRight(enemy.bearing);
        this.ahead(enemy.distance + 5);
        this.attack(1);



    };


    this.hit = function (enemy) {
        console.log("hit상태");
        if(enemy.bearing >= 0){
            turnDirection = 1;
        }else {
            turnDirection = -1;
        }
        this.turnRight(enemy.bearing);

        console.log("적hp", enemy.hp);
        if(enemy.hp > 16) {
            this.attack(3);
        }else if(enemy.hp > 10) {
            this.attack(2);
        }else if(enemy.hp > 4) {
            this.attack(1);
        } else if(enemy.hp > 2) {
            this.attack(0.5);
        } else if(enemy.hp > 0.4) {
            this.attack(0.1);
        }

        this.ahead(40);
    };

    this.hitted = function (enemy) {
        console.log("hitted상태");
        console.log(enemy.bearing);

        this.attack(1);

        this.turnRight(90);

        this.setGunHeading(enemy.bearing);


        this.turnRadarRight(180);
        this.ahead(enemy.distance + 5);



    };

    this.wallBlock = function (direction) {
        console.log("block상태");

        this.attack(0);
        this.turnRight(5*turnDirection);
        this.wait("turn");
        this.ahead(30);
        this.turnRadarRight(90);

    };




}