var rankNum = 1;

var y = 0;
var id = new Array();

socket.emit("idReNew");
socket.on("idReNewSuccess", function(data){
    id = data;
    memberReNew(id);
});

socket.on("members", function(data){
    console.log("누군가 접속");
    id = data;
    memberReNew(id);

} );

socket.on("logout", function(data){
    var la = $("#" + data);
    la.attr("checked", false);
});

function memberReNew(data) {

    console.log("data   ===", data);

    for(var i= 0, max = id.length; i<max; i++){

        var la = $("#" + id[i]);
        la.attr("checked", true);
    }

}


$("#game").on("click", function(event){

    $.ajax({
        type : 'get',
        url : '/rank',
        headers : {
            "Content-Type" : "application/json",
            "X-HTTP-Method-Override" : "POST"
        },
        success : function(result) {

            if(document.getElementById("rankList").hasChildNodes()){
                    var th = "<tr>";
                        th += " <th style='width: 10px'>No</th>";
                         th += " <th style='width: 10px'>In/Out</th>";
                        th += " <th style='width: 20px'>Photo</th>";
                        th += " <th style='width: 60px'>Name</th>";
                        th += "<th style='width: 10px'>Score</th>";
                        th += "<th style='width: 10px'>Win</th>";
                         th += "<th style='width: 10px'>Lose</th>";
                        th += "<th>Winning Rate</th> </tr>";

                    document.getElementById("rankList").removeChild(document.getElementById("rankList").firstChild);
                if(y!=0) {
                    $("#rankList").append(th);

                }
                y++;
            }
            console.log("length",result.rows.length);
            var eight = 0;
            for(var i = 0, max = result.rows.length; i<max; i++){

                var tr = "<tr data-id='"+ result.rows[i].userid +"' data-uno='"+result.rows[i].uno +"'>";
                tr += "<td class='uno'>" + rankNum +  "</td>";
                tr += "<td> <label  class='switch'>";
                tr += "<input type='checkbox' class='switch-input' onclick =' return false;' id='"+ result.rows[i].userid +"'>";
                tr += "<span   class='switch-label' data-on='In' data-off='Out'></span>";
                tr += "<span  class='switch-handle'></span>";
                tr += "</label></td>";
                eight++;
                if(eight<=8){
                    tr += "<td> <img id ='rankingPhoto"+result.rows[i].uno +"' class='direct-chat-img' src='./images/"+result.rows[i].userid+".PNG' alt='message user image'></td>";
                }else{
                    tr += "<td> <img id ='rankingPhoto"+result.rows[i].uno +"' class='direct-chat-img' src='./images/hongil.png' alt='message user image'></td>";

                }
                tr += "<td>"+result.rows[i].userid +  "</td>";
                tr += "<td>"+result.rows[i].userscore +  "</td>";
                tr += "<td>"+result.rows[i].win +  "</td>";
                tr += "<td>"+result.rows[i].lose +  "</td>";
                tr += "<td><div class='progress-bar progress-bar-aqua' style='width:"+ Math.ceil(result.rows[i].win/(result.rows[i].win + result.rows[i].lose) * 100)+"%'>" + Math.ceil(result.rows[i].win/(result.rows[i].win + result.rows[i].lose) * 100)+ "%</div>" +  "</td></tr>";
                $("#rankList").append(tr);
                memberReNew(id);
                if(result.rows[i].userphoto != null) {
                    var uint8Array = new Uint8Array(result.rows[i].userphoto.data);
                    var arrayBuffer = uint8Array.buffer;
                    var blob = new Blob([arrayBuffer]);

                    var reader = new FileReader;
                    var a = result.rows[i].uno;

                    reader.onload = function(){
                        var image = document.getElementById("rankingPhoto"+a);
                        image.setAttribute("src", reader.result);
                    };

                    reader.readAsDataURL(blob);
                }
                rankNum++;
            };

        }
    });

});

$("#yoonja").on("click", function(e){
    e.preventDefault();
});

function lastPostFunc(){
    var uno = $(".uno:last").html();
    console.log("UNOOOOOOOO", uno);
    $.ajax({
        type : 'get',
        url : '/rankScroll',
        data: {
            lastUno: uno
        },
        success : function(result) {
            console.log("length",result.rows.length);

            for(var i = 0, max = result.rows.length; i<max; i++){

                var tr = "<tr data-id='"+ result.rows[i].userid +"' data-uno='"+result.rows[i].uno +"'>";
                tr += "<td class='uno'>"+ rankNum +  "</td>";
                tr += "<td> <label class='switch'>";
                tr += "<input type='checkbox' class='switch-input' onclick =' return false;' id='"+ result.rows[i].userid +"'>";
                tr += "<span   class='switch-label' data-on='In' data-off='Out'></span>";
                tr += "<span class='switch-handle'></span>";
                tr += "</label></td>";
                tr += "<td> <img id ='rankingPhoto"+result.rows[i].uno +"' class='direct-chat-img' src='./images/hongil.png' alt='message user image'></td>";
                tr += "<td>"+result.rows[i].userid +  "</td>";
                tr += "<td>"+result.rows[i].userscore +  "</td>";
                tr += "<td>"+result.rows[i].win +  "</td>";
                tr += "<td>"+result.rows[i].lose +  "</td>";
                tr += "<td><div class='progress-bar progress-bar-aqua' style='width:"+ Math.ceil(result.rows[i].win/(result.rows[i].win + result.rows[i].lose) * 100)+"%'>" + Math.ceil(result.rows[i].win/(result.rows[i].win + result.rows[i].lose) * 100)+ "%</div>" +  "</td></tr>";
                $("#rankList").append(tr);
                memberReNew(id);

                if(result.rows[i].userphoto != null) {
                    var uint8Array = new Uint8Array(result.rows[i].userphoto.data);
                    var arrayBuffer = uint8Array.buffer;
                    var blob = new Blob([arrayBuffer]);

                    var reader = new FileReader;
                    var a = result.rows[i].uno;

                    reader.onload = function(){
                        var image = document.getElementById("rankingPhoto"+a);
                        image.setAttribute("src", reader.result);
                    };


                    reader.readAsDataURL(blob);
                }
                rankNum++;
            };
        }
    });
}

$('#rankList').on('click', 'tr' ,function(){

    for(var i= 0, max = id.length; i<max; i++){
        var $that = $(this);
        var user = $that.attr("data-id");
        var uno = $that.attr("data-uno");
        var player = getCookie('userId');
        console.log("gamePlay!!!!!!!!!!!!!!",player);
        if(user == id[i] && user != player){
            $.ajax({
                type : 'post',
                url : '/gamePlay',
                data: {
                    user : player
                },
                success : function(data){

                    var str = " <tr><td>"+data.rows[0].userid+"</td></tr>";
                        str += "<tr> <td>게임 시작</td>";
                        str += "<td><button class='btn btn-app' data-me='"+player+"' id='keyBoard' data-id='"+user+"'> <i class='fa fa-users'></i> KeyBoard</button></td>";
                    for(var i= 0, max = data.rows.length; i<max; i++){
                        str += "<td><button class='btn btn-app' data-me='" + player +"' id='key' data-id = '"+user +"' data-code='"+ data.rows[i].codename +"' > <i class='fa fa-play'></i>"
                            + data.rows[i].codename + "</button></td>";
                    }

                    $('#buttonAdd').html(str);

                }
            });
            $('#gamePlay').modal('show');
        }

    }

});

$("#buttonAdd").on("click", "#key", function(){
    var $that = $(this);
    var player = $that.attr("data-me");
    var enemy = $that.attr("data-id");
    var code = $that.attr("data-code");

    socket.emit("battle",{player:player, enemy:enemy, codename:code});
    console.log(player);

});

$("#buttonAdd").on("click", "#keyBoard", function(){
    var $that = $(this);
    var player = $that.attr("data-me");
    var enemy = $that.attr("data-id");


    socket.emit("battle",{player:player, enemy:enemy, codename:"keyBoard"});
    console.log(player);

});



var refu = false;


socket.on("enemyInfo", function(data){

    console.log("배틀신청이 들어와따");
    player = data.enemy;
    enemy = data.player;
    codename = data.codename;

    var str1 = "<h3>" + enemy +"님이 배틀신청을 하셨습니다.</h3><br>";
        str1 += enemy + "님의 전적";
     var  str2 = "<tr>";
          str2 += "<th style='width: 20px'>Photo</th>";
          str2 += "<th style='width: 10px'>Score</th>";
          str2 += "<th style='width: 10px'>Win</th>";
          str2 += "<th style='width: 10px'>Lose</th>";
          str2 += "<th>Winning Rate</th></tr>";
    $.ajax({
        type: 'post',
        url: '/enemyInfo',
        data: {
            user: enemy
        },
        success: function (data) {
            console.log("적데이터",data.rows[0]);
            str2 += "<tr>";
            str2 += "<td> <img id ='rankingPhoto' class='direct-chat-img' src='./images/hongil.png' alt='message user image'></td>";
            str2 += "<td>"+ data.rows[0].userscore +  "</td>";
            str2 += "<td>"+ data.rows[0].win +  "</td>";
            str2 += "<td>"+ data.rows[0].lose +  "</td>";
            str2 += "<td><div class='progress-bar progress-bar-aqua' style='width:"+ Math.ceil(data.rows[0].win/(data.rows[0].win + data.rows[0].lose) * 100)+"%'>" + Math.ceil(data.rows[0].win/(data.rows[0].win + data.rows[0].lose) * 100)+ "%</div>" +  "</td></tr>";



                setTime = setTimeout(function(){ $("#enemyInfo").modal('hide');
                    socket.emit("refusal",enemy);
                    console.log("셋타임");

                },1000*10);

            $('#enemyTable1').html(str2);

        }
    });
    var str3 = "";

    $.ajax({
        type : 'post',
        url : '/gamePlay',
        data: {
            user : player
        },
        success : function(data){

            str3 = " <tr><td><h3>나의 게임 코드</h3></td></tr>";
            str3 += "<tr> <td>게임 시작</td>";
            for(var i= 0, max = data.rows.length; i<max; i++){
                str3 += "<td><button class='btn btn-app' id='accept' data-code='"+ data.rows[i].codename +"'> <i class='fa fa-play'></i>"
                    + data.rows[i].codename + "</button></td>";
            }

            $('#enemyTable2').html(str3);
            $('#aa').html(str1);
            $("#enemyInfo").modal('show');

        }
    });


});


socket.on("acceptSuccess", function(data){
    //alert("상대방이 수락하셨습니다.");

    //sconsole.log("상대방이 수락햇잖아!!!!!!!!!!!!!", data.enemy, data.codename);
    $("#gamePlay").modal('hide');
    window.open("/game/codeInsert/" + data.enemy + "/" + data.codename +"/" + data.player + "/" + data.code2, '_blank');

});

$("#refusal").on('click',function(){
    socket.emit("refusal",enemy);
    clearTimeout(setTime);
});


$("#enemyTable2").on('click','#accept',function(){


    console.log("수락할거야!!!!!!!");
    var $that = $(this);
    code2 = $that.attr("data-code");
    $("#enemyInfo").modal('hide');
    clearTimeout(setTime);
    window.open("/game/codeInsert/" + enemy + "/" + codename + "/" + player + "/" + code2, '_blank');

    socket.emit("accept",{enemy:enemy, codename:codename, player:player, code2:code2} );

});





socket.on("refusal", function(){
   alert("거절당하셨습니다.");
});

socket.on("battleAccept",function(data){
    var isAccept = confirm(data.msg);
    var player = data.enemy;
    var enemy = data.player;
    if(isAccept){
        $.ajax({
            type : 'post',
            url : '/gamePlay',
            data: {
                user : data.enemy
            },
            success : function(data){

                var str = " <tr><td>"+player+"</td></tr>";
                str += "<tr> <td>게임 시작</td>";
                str += "<td><button class='btn btn-app' data-me='"+player+"' id='key' data-id='"+enemy+"'> <i class='fa fa-users'></i> KeyBoard</button></td>";
                for(var i= 0, max = data.rows.length; i<max; i++){
                    str += "<td><button class='btn btn-app' > <i class='fa fa-play'></i>"
                        + data.rows[i].codename + "</button></td>";
                }

                $('#buttonAdd').html(str);

            }
        });
        $('#gamePlay').modal('show');
    }
});


$('.Switch').click(function() {
    $(this).toggleClass('On').toggleClass('Off');
});

$(document).ready(function() {
    $("#rankScroll").scroll(function () {
        console.log("스크롤감지!!!!!!!!!!!!!!!!!!!!!");
        console.log("list", $("#rankList").height());
        console.log("section", $("#rankScroll").height());
        console.log("scrollTop", $("#rankScroll").scrollTop());
        var uno = $(".uno:last").html();
        console.log(uno);

        if ($("#rankScroll").scrollTop() >= $("#rankList").height() - $("#rankScroll").height()) {
            console.log("마지막 스크롤 감지");
            lastPostFunc();
        }
    });
});


