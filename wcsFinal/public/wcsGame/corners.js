/**
 * Created by HongIl on 2015-08-20.
 */

function corners (){
    this.name = "corners";
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
    // enemy.heading        -> 적이 바라보는 각도 반환 0 ~ 360
    // enemy.distance       -> 적과 나의 거리
    // enemy.bearing        -> 내 기준에서의  적의 각도 0 ~ 360
    // enemy.speed          -> 적의 현재 스피드





    var i = 0;
    this.run = function() {

        if(i == 0){

            this.ahead(1000);
            i++;
        }


        this.attack(1);

    };

    this.scan = function (enemy) {
        this.attack(2);
        this.setGunHeading(enemy.bearing);

    };

    this.hit = function (data) {

    };

    this.hitted = function (data) {


    };

    this.wallBlock = function (direction) {
        if(i==1){
        this.turnRight(90);
        this.turnRadarRight(90);
        this.wait("turn");
        this.back(1000);
            i++;}
    };


}