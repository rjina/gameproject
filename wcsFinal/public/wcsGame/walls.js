/**
 * Created by HongIl on 2015-08-20.
 */

function walls (){
    this.name = "walls";


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

    var peek = false;


    this.run = function() {


            if(i == 0){

            this.ahead(416);
            i++;
            }

            this.ahead(416);
        peek = true;

    };

    this.scan = function (enemy) {
        if(peek) {
            this.setGunHeading(enemy.bearing);
            this.attack(2);
        }

    };

    this.hit = function (enemy) {
            if(enemy.bearing > -90 && enemy.bearing < 90) {
                this.back(100);
            } else {
                this.ahead(100);
            }
    };

    this.hitted = function (data) {


    };

    this.wallBlock = function (direction) {
            peek = false;
            this.turnRadarRight(90);
            this.turnRight(90);

            if(this.heading() == 90){
                //this.turnGunRight(this.gunHeading() + 90);
            } else if(this.heading() == 0){
                //this.turnGunRight(90);
            } else if(this.heading() == 270) {
                //this.turnGunRight(90);
            } else if(this.heading() == 180){
                //this.turnGunRight(90);

            }



    };


}