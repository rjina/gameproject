function crazy (){
    this.name = "crazy";
    this.x = 130;
    this.y = 170;

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

    var a = 700;

    this.run = function() {

        this.ahead(100);
        this.turnRight(a);
        this.turnRadarRight(a);
        this.wait("move");
        this.ahead(10);
        this.wait("move");
        this.ahead(10);
        this.wait("move");
        this.ahead(10);
        this.wait("move");
        this.ahead(10);

        a -= 30;

        if(a < 0) {
            a = 700;
        }

    };

    this.scan = function(enemy) {

        this.setGunHeading(enemy.bearing);
        this.turnRight(this.heading() - enemy.bea)

    }

    this.hit = function (data) {

        this.turnRight(180);
        this.ahead(100);
    };

    this.hitted = function (data) {
        this.attack(0.1);
        this.setGunHeading(data.bearing);
        this.ahead(100);
        this.turnLeft(a);
        this.turnRadarLeft(a)

    };

    this.wallBlock = function (direction) {

        if(direction == "ahead"){

            this.back(100);
        }
        if(direction == "back") {

            this.turnRight(45);
            this.ahead(100);
        }
    };

}