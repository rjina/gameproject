/**
 * Created by HongIl on 2015-08-29.
 */
var profileData = new FormData();
var socket = io();

var checkId = false;
$("#login").on("click", function(event){
    event.preventDefault();

    if($("#logId").val() == "" ||$("#logPw").val() == "") {
        alert("아이디/비밀번호가 입력되지 않았습니다.");
        $("#logId").val("");
        $("#logPw").val("");

    } else{
        $.ajax({
            type : 'post',
            url : '/login',
            data: {id:$("#logId").val(),
                pw:$("#logPw").val()},
            success : function(data) {
                if(data == "success"){
                    alert("로그인 성공");
                    socket.emit("setID",$("#logId").val());
                    $("#loginBanner").fadeOut();
                    $("#logout").show();
                    $("#logId").val("");
                    $("#logPw").val("");


                }else if(data =="fail"){
                    alert("해당 아이디가 존재하지 않습니다. \n회원 가입을 해주세요");
                }else {
                    $("#logId").val("");
                    $("#logPw").val("");
                    alert("비밀번호를 확인해주세요");
                }
            }
        });
    }

});


//------------------------------------------------------------------------
//  로그인 배너 or 로그아웃 배너 하이드
// ------------------------------------------------------------------------
if(getCookie("userId") != null){
    $("#loginBanner").hide();
}else {
    $("#logout").hide();
}

function getCookie(cookieName){
    var cookieValue=null;
    if(document.cookie){
        var array=document.cookie.split((escape(cookieName)+'='));
        if(array.length >= 2){
            var arraySub=array[1].split(';');
            cookieValue=unescape(arraySub[0]);
        }
    }
    return cookieValue;
}



//------------------------------------------------------------------------
//  로그아웃
// ------------------------------------------------------------------------
$("#logout").on("click", function(){
    socket.emit("out", getCookie("userId"));
    $.ajax({
        type : 'post',
        url : '/logout',
        success : function(data) {
            alert(data);
            $("#loginBanner").fadeIn();
            $("#logout").hide();

        }

    });

});

//------------------------------------------------------------------------
//회원가입-유효성 체크
//------------------------------------------------------------------------
//id 중복체크
$("#registerId").on("blur", function(event){

    event.preventDefault();



    $.ajax({
        type : 'post',
        url : '/checkId',
        data: {id:$("#registerId").val()}, //data 보냄
        success : function(data){
            if($("#registerId").val()!=""){
                if(data=='success'){
                    $("#idCheckMsg").html("<h6 style='color: dodgerblue; text-align: left'>사용 가능한 id입니다</h6>");
                    checkId = true;
                }else{
                    $("#idCheckMsg").html("<h6 style='color: red; text-align: left'>id가 중복됩니다</h6>");
                    checkId = false;
                }
            }
        }
    });
});

//------------------------------------------------------------------------
//  비밀번호 confirm
// ------------------------------------------------------------------------
$("#registerConfirmPw").on("keyup", function(event){

    event.preventDefault();

    if($("#registerPw").val() != $("#registerConfirmPw").val()) {

        $("#confirmPwMsg").html("<h6 style='color: red; text-align: left'>비밀번호가 틀립니다.</h6>");
    } else {
        $("#confirmPwMsg").html("<h6 style='color: dodgerblue; text-align: left'>비밀번호가 맞습니다.</h6>");
    }

});

//------------------------------------------------------------------------
//  register(회원가입) & 공백체크
// ------------------------------------------------------------------------
$("#btnJoin").on("click", function(event){
    event.preventDefault();


    if ($("#registerId").val() == "" && checkId== false) {
        alert("id를 확인하세요");
    } else if ($("#registerPw").val() == "" || $("#registerPw").val() != $("#registerConfirmPw").val()) {
        alert("비밀번호를 확인하세요");
    } else if ($("#registerName").val() == "") {
        alert("이름을 확인하세요");
    } else{

        profileData.append("id", $("#registerId").val());
        profileData.append("pw", $("#registerPw").val());
        profileData.append("name", $("#registerName").val());


        $.ajax({
            type: 'post',
            url: '/register',
            processData : false,
            contentType : false,
            data: profileData,
            success: function (data) {
                if (data == 'success') {
                    alert('회원가입이 완료되었습니다.');

                    $("#registerId").val("");
                    $("#registerPw").val("");
                    $("#registerConfirmPw").val("");
                    $("#registerName").val("");
                    $("#idCheckMsg").html("");
                    $("#confirmPwMsg").html("");
                    $( "#loginRegisterToggle" ).trigger( "click" );
                    profileData = new FormData();
                    $("#profileFiles").attr("src", null);

                }
            }
        });

    }


});

$("#profileModal").on("click", function(){
    event.preventDefault()
});

$("#dropZone").on("dragEnter dragover", function() {
    event.preventDefault(); // 기존 이벤트 무시
});

$("#dropZone").on("drop", function(event) { // 파일을 드랍하면

    event.preventDefault(); // 기존 이벤트 무시

    var file = event.originalEvent.dataTransfer.files;// 파일 데익터 저장


    console.log(file);

    if(file[0].size < 300000  && file[0].type.indexOf('image')  == 0) {
        var reader = new FileReader();                       // 파

        reader.readAsDataURL(file[0]);


        reader.onload = function(){
            $("#profileFiles").attr("src", reader.result);
            $("#profileFilesColseBtn").trigger("click");
            profileData.append("file", file[0]);
        }


    }
    else if(file[0].size > 300000) {
        alert("파일 사이즈가 너무 큽니다. 30kb로 줄여주세요.");
    } else if(file[0].type.indexOf('image')  != 0) {
        alert("이미지 파일만 등록 가능합니다.");
    }








});

$("#profileModal").on("click", function(){
    event.preventDefault()
});