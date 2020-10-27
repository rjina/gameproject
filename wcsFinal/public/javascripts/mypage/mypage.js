$("#myPage").on("click", function(event){

    if(getCookie('userId') == null){
        event.preventDefault();
        alert("로그인 해주시기 바랍니다.");
        $("#loginPage").trigger("click");
        return false;

    } else {

        $.ajax({
            url: "/myPage",
            type: "POST",
            data: {cookie: getCookie("userId")},
            success: function(data){

                if(data.rows[0].userphoto == null) {
                    var image = document.getElementById("myPhoto");
                    if(data.rows[0].userscore >= 902){
                        image.src="./images/"+data.rows[0].userid +".PNG";
                    }else {
                        image.src = "./images/hongil.png";
                    }
                    $('#myName').html(data.rows[0].username);
                    $('#myId').html(data.rows[0].userid);

                    var str = "<tr>";
                    str += "<th style='width:165px'>win</th>";
                    str += "<th style='width:165px'>lose</th>";
                    str += "<th style='width:170px'>rates</th>";
                    str += "</tr>";
                    str += "<tr>";
                    str += "<td>" + data.rows[0].win + "</td>";
                    str += "<td>" + data.rows[0].lose + "</td>";
                    str += "<td><div class='progress-bar progress-bar-aqua' style='width:"+ Math.ceil(data.rows[0].win/(data.rows[0].win + data.rows[0].lose) * 100)+"%'>" + Math.ceil(data.rows[0].win/(data.rows[0].win + data.rows[0].lose) * 100)+ "%</div>" +  "</td></tr>";
                    $("#myRank").html(str);
                } else {

                    $('#myName').html(data.rows[0].username);
                    $('#myId').html(data.rows[0].userid);

                    var str = "<tr>";
                    str += "<th style='width:165px'>win</th>";
                    str += "<th style='width:165px'>lose</th>";
                    str += "<th style='width:170px'>rates</th>";
                    str += "</tr>";
                    str += "<tr>";
                    str += "<td>" + data.rows[0].win + "</td>";
                    str += "<td>" + data.rows[0].lose + "</td>";
                    str += "<td><div class='progress-bar progress-bar-aqua' style='width:"+ Math.ceil(data.rows[0].win/(data.rows[0].win + data.rows[0].lose) * 100)+"%'>" + Math.ceil(data.rows[0].win/(data.rows[0].win + data.rows[0].lose) * 100)+ "%</div>" +  "</td></tr>";
                    $("#myRank").html(str);

                    var uint8Array = new Uint8Array(data.rows[0].userphoto.data);
                    var arrayBuffer = uint8Array.buffer;
                    var blob = new Blob([arrayBuffer]);

                    var reader = new FileReader;

                    reader.onload = function(){
                        var image = document.getElementById("myPhoto");
                        image.setAttribute("src", reader.result);
                    };

                    var image = document.getElementById("myPhoto");

                    reader.readAsDataURL(blob);

                }
            }
        });


    }
});

//비번수정 버튼 눌렀을 시 비번 변경 창 띄움
$('#modifyPw').on("click", function(event){

    $('.updatePwDIV').animate({
        height: "toggle",
        'padding-top': 'toggle',
        'padding-bottom': 'toggle',
        opacity: "toggle"
    }, "slow");

});

//-----------------비번변경 닫기 버튼누르면 숨김으로 변경(09.01.17:37, 호준)-------------
$('#changePwBtn').on("click", function(event) {
    $( "#pwModal" ).fadeOut();
})

//현재 비번 입력했을 시 데이터 보내는 동작
$("#updatePw").on("click", function(event){
    $.ajax({
        type : 'post',
        url : '/updatePw',
        data: {
            cookie: getCookie("userId"),
            currentPw:$('#currentPw').val(),
            newPw:$('#newPw').val()
        }, //data 보냄
        success : function(data){
            if(data == 'success'){
                alert("변경 완료");
                $('#currentPw').val("");
                $('#newPw').val("");
                $( "#pwModal" ).fadeOut();
            }else{
                if($('#newPw').val()==""){
                    alert("변경할 비밀번호를 입력하세요");
                }else{
                    alert("비밀번호가 일치하지 않습니다.")
                }

            }
        }
    });
});

