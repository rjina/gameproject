
function Player(custom) {

    var custom = new custom();
    custom.ahead = ahead;
    custom.back = back;
    custom.turnRight = turnRight;
    custom.turnLeft = turnLeft;
    custom.wait = wait;
    custom.attack = attack;
    /*custom.turnGunLeft = turnGunLeft;
    custom.turnGunRight = turnGunRight;*/
    custom.turnRadarLeft = turnRadarLeft;
    custom.turnRadarRight = turnRadarRight;
    custom.heading = getHeading;
    custom.gunHeading = getGunHeading;
    custom.radarHeading = getRadarHeading;
    custom.getBattleFiledWidth = getBattleFiledWidth;
    custom.getBattleHeight = getBattleHeight;
    custom.getPlayerWidth = getPlayerWidth;
    custom.getPlayerHeight = getPlayerHeight;
    custom.getHp = getHp;
    custom.getX = getX;
    custom.getY = getY;
    custom.setGunHeading = setAttackAngle;



    var moveState;
    var turnState;
    var turnGunState;
    var turnRadarState;



    var wallEvent = false;

    var x = Math.abs(Math.random() * (16 * 25) + 16*4);
    var y = Math.abs(Math.random() * (16 * 12) + 16*4);



    var player = new WCS.class.player(x, y, custom.name);


    var state = {
        runState : false,
        scanState : false,
        hitState : false,
        hittedState: false,
        wallBlockState: false
    };

    var moveAction = [];
    var turnAction = [];
    var turnGunAction = [];
    var turnRadarAction = [];

    var excuting = {
        ahead: false,
        back: false,
        turnRight: false,
        turnLeft: false,
        turnGunRight: false,
        turnGunLeft: false,
        turnRadarRight: false,
        turnRadarLeft: false
    };

    function falseSearch () {
        if( excuting.ahead == false &&
            excuting.back == false &&
            excuting.turnRight == false &&
            excuting.turnLeft == false &&
            excuting.turnGunRight == false &&
            excuting.turnGunLeft == false &&
            excuting.turnRadarRight == false &&
            excuting.turnRadarLeft == false) {




            state[currentState] = false;
            wallEvent = false;

        }
    };

    player.hong("stoping", function(data) {
        excuting[data] = false;
        falseSearch();
    });







    var currentState;
    var state = {
        runState : false,
        scanState : false,
        hitState : false,
        hittedState: false,
        wallBlockState: false
    };

    function addAction (data){
        var actionKind = data.split(":")[1];
        switch(actionKind){
            case "move":
                moveAction.push(data);
                break;
            case "turn":
                turnAction.push(data);
                break;
            case "turnGun":
                turnGunAction.push(data);
                break;
            case "turnRadar":
                turnRadarAction.push(data);

        }

    }

    function move(){
        while (true) {
            if(moveAction.length == 0) {
                break;
            }



            var action = moveAction.shift();
            var name = action.split(":")[0];
            var data = action.split(":")[2];

            switch(name) {
                case "ahead" :


                    moveState = "ahead";
                    excuting.ahead = true;
                    player.aheadDistance = 0;
                    player.aheadToDistance = 0;
                    player.aheadToDistance += data;
                    break;
                case "back" :

                    moveState = "back";
                    excuting.back = true;
                    player.backDistance = 0;
                    player.backToDistance = 0;
                    player.backToDistance += data;
                    break;
            }

            if(name == "wait") {
                player.moveState = moveState;
                break;
            }

        }
    }

    player.hong("moveEnd", function(){
        move();

    });



    function turn(){
        while (true) {
            if(turnAction.length == 0) {
                break;
            }

            var action = turnAction.shift();
            var name = action.split(":")[0];
            var data = action.split(":")[2];

            switch(name) {
                case "turnLeft" :
                    turnState = "turnLeft";
                    excuting.turnLeft = true;
                    player.turnLeftToAngle = 0;
                    player.turnLeftAngle = 0;
                    player.turnLeftToAngle += data;
                    break;
                case "turnRight" :
                    turnState = "turnRight";
                    excuting.turnRight = true;
                    player.turnRightToAngle = 0;
                    player.turnRightAngle = 0;
                    player.turnRightToAngle += data;
                    break;
            }

            if(name == "wait") {
                player.turnState = turnState;
                break;
            }

        }
    }

    player.hong("turnEnd", function(){
        turn();
    });



    function turnGun(){
        while (true) {
            if(turnGunAction.length == 0) {
                break;
            }

            var action = turnGunAction.shift();
            var name = action.split(":")[0];
            var data = action.split(":")[2];

            switch(name) {
                case "turnGunLeft" :
                    turnGunState = "turnGunLeft";
                    excuting.turnGunLeft = true;
                    player.turnGunLeftToAngle = 0;
                    player.turnGunLeftAngle = 0;
                    player.turnGunLeftToAngle += data;
                    break;
                case "turnGunRight" :
                    turnGunState = "turnGunRight";
                    excuting.turnGunRight = true;
                    player.turnGunRightToAngle = 0;
                    player.turnGunRightAngle = 0;
                    player.turnGunRightToAngle += data;
                    break;
            }

            if(name == "wait") {
                player.turnGunState = turnGunState;
                break;
            }

        }
    }


    player.hong("turnGunEnd", function(){
        turnGun();
    });

    function turnRadar(){
        while (true) {
            if(turnRadarAction.length == 0) {
                break;
            }

            var action = turnRadarAction.shift();
            var name = action.split(":")[0];
            var data = action.split(":")[2];

            switch(name) {
                case "turnRadarLeft" :
                    turnRadarState = "turnRadarLeft";
                    excuting.turnRadarLeft = true;
                    player.turnRadarLeftToAngle = 0;
                    player.turnRadarLeftAngle = 0;
                    player.turnRadarLeftToAngle += data;
                    break;
                case "turnRadarRight" :
                    turnRadarState = "turnRadarRight";
                    excuting.turnRadarRight = true;
                    player.turnRadarRightToAngle = 0;
                    player.turnRadarRightAngle = 0;
                    player.turnRadarRightToAngle += data;
                    break;
            }

            if(name == "wait") {
                player.turnRadarState = turnRadarState;
                break;
            }

        }
    }


    player.hong("turnRadarEnd", function(){
        turnRadar();
    });



    function excute(){
        move();

        turn();

        turnGun();

        turnRadar();
    }





    function ahead (distance) {
        addAction("ahead:"+"move:"+distance);
    };

    function back(distance) {
        addAction("back:"+"move:"+distance);
    };

    function turnRight(inputAngle){
        addAction("turnRight:"+"turn:"+inputAngle);
    };

    function turnLeft(inputAngle){
        addAction("turnLeft:"+"turn:"+inputAngle);
    };

    function turnGunRight(inputAngle){
        addAction("turnGunRight:"+"turnGun:"+inputAngle);
    }

    function turnGunLeft(inputAngle){
        addAction("turnGunLeft:"+"turnGun:"+inputAngle);
    }

    function turnRadarRight(inputAngle){
        addAction("turnRadarRight:"+"turnRadar:"+inputAngle);
    }

    function turnRadarLeft(inputAngle){
        addAction("turnRadarLeft:"+"turnRadar:"+inputAngle);
    }

    function setAttackAngle(angle){
        player.attackAngle = angle;
    }

    function wait(condition){
        switch(condition){
            case "move" :
                addAction("wait:move");
                break;
            case "turn" :
                addAction("wait:turn");
                break;
            case "turnGun" :
                addAction("wait:turnGun");
                break;
            case "turnRadar" :
                addAction("wait:turnRadar");

            default :

                addAction("wait:move");
                addAction("wait:turn");
                addAction("wait:turnGun");
                addAction("wait:turnRadar");
                break;
        }
    }

    function attack(power) {

        if(power == false) {
            player.power = 0;
        } else if(3 <  power || power < 0.1){
            player.power = 1;
        } else {
            player.power = power;
        }
    }

    function getHeading() {
        return player.heading;
    }

    function getGunHeading() {
        return player.attackAngle;
    }

    function getRadarHeading() {
        return player.radarAngle;
    }

    function getBattleFiledWidth() {
        return 416;
    }

    function getBattleHeight() {
        return 208;
    }

    function getPlayerWidth() {
        return 32;
    }

    function getPlayerHeight() {
        return 32;
    }

    function getHp() {
        return player.hp;
    }

    function getX() {
        return player.x;
    }

    function getY() {
        return player.y;
    }







    player.hong("run", function (){ // 우선순위 5

        if( state.runState == false &&
            state.scanState == false &&
            state.hitState == false &&
            state.hittedState == false &&
            state.wallBlockState == false ) {


            /*moveAction = [];
             turnAction = [];
             turnGunAction = [];
             turnRadarState = [];*/

            initialize();

            state.runState = true;

            currentState = "runState";
            custom.run();
            excute();

        }


    });

    player.hong("scan", function (data) {  // 우선순위 4
        ;
        if(typeof custom.scan != "undefined" &&
            state.scanState == false &&
            state.hitState == false &&
            state.hittedState == false &&
            state.wallBlockState == false ) {



            state.scanState = true;
            state.runState = false;

            initialize();

            custom.scan(data);
            excute();


            currentState = "scanState";

        }

    });

    player.hong("hit", function(data) {  //  우선순위 3
        if(typeof custom.hit != "undefined" &&
            state.hitState == false &&
            state.hittedState == false &&
            state.wallBlockState == false){


            state.hitState = true;
            state.runState = false;
            state.scanState = false;

            initialize();

            custom.hit(data);
            excute();

            currentState = "hitState";
        }

    });


    player.hong("hitted", function(data){
        if(typeof custom.hitted != "undefined" &&
            state.hittedState == false &&
            state.wallBlockState == false){

            state.hittedState = true;
            state.runState = false;
            state.scanState = false;
            state.hitState = false;

            initialize();

            custom.hitted(data);
            excute();

            currentState = "hittedState";
        }
    });


    player.hong("wallBlock", function(data){ // 우선순위 1등


        if(typeof custom.wallBlock != "undefined" && state.wallBlockState == false) {

            state.runState = false;
            state.scanState = false;
            state.hitState = false;
            state.hittedState = false;
            state.wallBlockState = true;

            initialize();

            custom.wallBlock(data);

            excute();

            currentState = "wallBlockState";

            wallEvent = true;



        } else if(state.wallBlockState == true && wallEvent == true){

            state.runState = false;
            state.scanState = false;
            state.hitState = false;
            state.hittedState = false;
            state.wallBlockState = true;

            initialize();
            player.situation = true;

            custom.wallBlock(data);

            excute();

            currentState = "wallBlockState";

            wallEvent = true;

        }

    });

    function initialize () {
        moveAction = [];
        turnAction = [];
        turnGunAction = [];
        turnRadarState = [];

        player.moveState = false;
        player.turnState = false;
        player.turnGunState = false;
        player.turnRadarState = false;

        moveState = false;
        turnState = false;
        turnGunState = false;

        excuting.runState = false;
        excuting.scanState = false;
        excuting.hitState = false;
        excuting.hittedState = false;
        excuting.wallBlockState = false;

        player.backDistance = 0;
        player.backToDistance = 0;
        player.aheadDistance = 0;
        player.aheadToDistance = 0;
        player.turnLeftToAngle = 0;
        player.turnLeftAngle = 0;
        player.turnRightToAngle = 0;
        player.turnRightAngle = 0;
        player.turnGunLeftToAngle = 0;
        player.turnGunLeftAngle = 0;
        player.turnGunRightToAngle = 0;
        player.turnGunRightAngle = 0;
        player.turnRadarLeftToAngle = 0;
        player.turnRadarLeftAngle = 0;
        player.turnRadarRightAngle = 0;
        player.turnRadarRightToAngle = 0;
        player.power = 0;
    };





    return {
        setEnemy: function(data){
            player.setEnemy(data);
        },
        player: player
    }














}