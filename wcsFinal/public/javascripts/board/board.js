var boardScroll = 0;
var replyScroll = 0;

function readPage(bno){

    if(getCookie('userId') == null){
        event.preventDefault();
        alert("로그인 후 이용하실 수 있습니다.");
        $("#loginPage").trigger("click");
        return false;
    }else {
        //alert("글번호: " + bno);
        $('#readModal-title').html("Read Page");
        $('#read-writer').attr("readonly", true);
        $('#read-title').attr("readonly", true);
        $('#read-content').attr("readonly", true);
        $('#btn-modify').data("bno", bno).show();
        $('#btn-delete').data("bno", bno).show();
        $('#commentSubmit').data("bno", bno);
        $('#readModal-replies').data("bno", bno);
        $('#btn-modifyConfirm').remove();
        $('#readModal').modal('show');

        $.ajax({
            url: "/read",
            type: "POST",
            dataType: "json",
            data: {
                bno: bno
            },
            success: function (data) {

                $('#read-writer').val(data.rows[0].writer);
                $('#read-title').val(data.rows[0].title);
                $('#read-content').val(data.rows[0].content);

            },
            error: function (err) {
                console.log('err');
                alert('Ajax Error: ' + err);
            }
        });
        $.ajax({
            url: "/readReplies",
            type: "POST",
            dataType: "json",
            data: {
                bno: bno
            },
            success: function (data) {
                var str = "<tr>" +
                    "<th width=\"20%\">작성자</th>" +
                    "<th width=\"45%\">내용</th>" +
                    "<th width=\"20%\">작성일</th>" +
                    "<th width=\"15%\"></th></tr>";

                for (var i = 0, max = data.rows.length; i < max; i++) {

                    //console.log(data.rows[i].bno);

                    str += "<tr>" +
                        "<td class='rno' data-rno='" + data.rows[i].rno + "'>" + data.rows[i].replyer + "</td>" +
                        "<td>" + data.rows[i].replytext + "</td>" +
                        "<td>" + data.rows[i].replydate + "</td>" +
                        "<td><button data-rno='" + data.rows[i].rno + "' data-bno='" + bno + "' class='btn-replyModify'>M</button>" +
                        "<button data-rno='" + data.rows[i].rno + "' data-bno='" + bno + "' class='btn-replyDelete'>D</button></td></tr>";

                }

                $('#replies').html(str);
            },
            error: function (err) {
                console.log('err');
                alert('Ajax Error: ' + err);
            }
        });
        $.ajax({
            url: "/viewcntrenewal",
            type: "POST",
            dataType: "json",
            data: {
                bno: bno
            },
            success: function (data) {
                var str = "<tr bgcolor='#ffb6c1'>" +
                    "<th width='10%'>글번호</th>" +
                    "<th width='40%'>제목</th>" +
                    "<th width='30%'>작성자</th>" +
                    "<th width='10%'>조회수</th>" +
                    "<th width='10%'>댓글수</th></tr>";

                for (var i = 0, max = data.rows.length; i < max; i++) {

                    //console.log(data.rows[i].bno);

                    str += "<tr onclick=\"readPage(" + data.rows[i].bno + ")\">" +
                        "<td class='bno'>" + data.rows[i].bno + "</td>" +
                        "<td>" + data.rows[i].title + "</td>" +
                        "<td>" + data.rows[i].writer + "</td>" +
                        "<td>" + data.rows[i].viewcnt + "</td>" +
                        "<td>" + data.rows[i].replycnt + "</td></tr>";

                }

                $('#board').html(str);
                boardScroll = 0;
            },
            error: function (err) {

            }
        });
    }
}

$("#boardSection").on("click", function(){
    $.ajax({
        url: "/loadlist",
        type: "POST",
        dataType: "json",
        data: {
            bno: boardScroll
        },
        success: function(data){

            var str;

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr onclick=\"readPage("+data.rows[i].bno+")\">"+
                    "<td class='bno'>"+data.rows[i].bno+"</td>"+
                    "<td>"+data.rows[i].title+"</td>"+
                    "<td>"+data.rows[i].writer+"</td>"+
                    "<td>"+data.rows[i].viewcnt+"</td>"+
                    "<td>"+data.rows[i].replycnt+"</td></tr>";

            }

            $('#board').append(str);
            boardScroll += 20;

        },
        error: function(err){
            console.log('err');
            alert('Ajax Error: ' + err);
        }
    });
});

$('#btn-write').click(function(){

    if(getCookie('userId') == null){
        event.preventDefault();
        alert("로그인 후 이용하실 수 있습니다.");
        $("#loginPage").trigger("click");
        return false;
    }

    $('#write-writer').val(getCookie('userId'));

});

$('#btn-writeConfirm').click(function(){
    console.log("확인호출");
    console.log($('#write-writer').val());
    console.log($('#write-title').val());
    console.log($('#write-content').val());
    if(onWriteSubmit()==true) {
        $.ajax({
            url: "/write",
            type: "POST",
            dataType: "json",
            data: {
                writer: $('#write-writer').val(),
                title: $('#write-title').val(),
                content: $('#write-content').val()
            },
            success: function (data) {
                var str = "<tr bgcolor='#ffb6c1'>" +
                    "<th width='10%'>글번호</th>" +
                    "<th width='40%'>제목</th>" +
                    "<th width='30%'>작성자</th>" +
                    "<th width='10%'>조회수</th>" +
                    "<th width='10%'>댓글수</th></tr>";

                for (var i = 0, max = data.rows.length; i < max; i++) {

                    //console.log(data.rows[i].bno);

                    str += "<tr onclick=\"readPage(" + data.rows[i].bno + ")\">" +
                        "<td class='bno'>" + data.rows[i].bno + "</td>" +
                        "<td>" + data.rows[i].title + "</td>" +
                        "<td>" + data.rows[i].writer + "</td>" +
                        "<td>" + data.rows[i].viewcnt + "</td>" +
                        "<td>" + data.rows[i].replycnt + "</td></tr>";

                }

                $('#board').html(str);
                $('#write-writer').val("");
                $('#write-title').val("");
                $('#write-content').val("");
                boardScroll = 0;
            },
            error: function (err) {
                console.log('err');
                alert('Ajax Error: ' + err);
            }
        });
    }
});

$('#btn-modify').click(function(){

    var bno = $(this).data("bno");

    $('#readModal-title').html("Modify Page");
    $('#read-writer').attr("readonly", false);
    $('#read-title').attr("readonly", false);
    $('#read-content').attr("readonly", false);

    var str = "<button type='button' id='btn-modifyConfirm' class='btn btn-primary' data-dismiss='modal'>Confirm</button>"

    $('#btn-modify').hide();
    $('#btn-delete').hide();
    $('#readModal-footer').append(str);
    $('#btn-modifyConfirm').data("bno", bno);

});

$(document).on("click", "#btn-modifyConfirm", function(){

    var bno = $(this).data("bno");

    $.ajax({
        url: "/update",
        type: "POST",
        dataType: "json",
        data: {
            bno: bno,
            writer: $('#read-writer').val(),
            title: $('#read-title').val(),
            content: $('#read-content').val()
        },
        success: function(data){

            var str = "<tr>"+
                "<th width=\"10%\">글번호</th>"+"" +
                "<th width=\"40%\">제목</th>"+
                "<th width=\"30%\">작성자</th>"+
                "<th width=\"10%\">조회수</th>"+
                "<th width=\"10%\">댓글수</th></tr>";

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr onclick=\"readPage("+data.rows[i].bno+")\">"+
                    "<td class='bno'>"+data.rows[i].bno+"</td>"+
                    "<td>"+data.rows[i].title+"</td>"+
                    "<td>"+data.rows[i].writer+"</td>"+
                    "<td>"+data.rows[i].viewcnt+"</td>"+
                    "<td>"+data.rows[i].replycnt+"</td></tr>";

            }

            $('#board').html(str);

        },
        error: function(err){
            console.log('err');
            alert('Ajax Error: ' + err);
        }
    });

});

$('#btn-delete').click(function(){

    var bno = $(this).data("bno");

    $.ajax({
        url: "/delete",
        type: "POST",
        dataType: "json",
        data: {
            bno: bno
        },
        success: function(data){

            var str = "<tr>"+
                "<th width=\"10%\">글번호</th>"+"" +
                "<th width=\"40%\">제목</th>"+
                "<th width=\"30%\">작성자</th>"+
                "<th width=\"10%\">조회수</th>"+
                "<th width=\"10%\">댓글수</th></tr>";

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr onclick=\"readPage("+data.rows[i].bno+")\">"+
                    "<td class='bno'>"+data.rows[i].bno+"</td>"+
                    "<td>"+data.rows[i].title+"</td>"+
                    "<td>"+data.rows[i].writer+"</td>"+
                    "<td>"+data.rows[i].viewcnt+"</td>"+
                    "<td>"+data.rows[i].replycnt+"</td></tr>";

            }

            $('#board').html(str);

        },
        error: function(err){
            console.log('err');
            alert('Ajax Error: ' + err);
        }
    });

});

$(document).ready(function(){

    $('#div-scroll').scroll(function() {
        if ($('#div-scroll').scrollTop() >= $('#board').height() - $('#div-scroll').height()) {

            var bno = $(".bno:last").html();

            console.log(bno);

            $.ajax({
                url: "/loadlist",
                type: "POST",
                dataType: "json",
                data: {
                    bno: boardScroll
                },
                success: function(data){

                    var str;

                    for(var i= 0, max=data.rows.length; i<max; i++){

                        //console.log(data.rows[i].bno);

                        str += "<tr onclick=\"readPage("+data.rows[i].bno+")\">"+
                            "<td class='bno'>"+data.rows[i].bno+"</td>"+
                            "<td>"+data.rows[i].title+"</td>"+
                            "<td>"+data.rows[i].writer+"</td>"+
                            "<td>"+data.rows[i].viewcnt+"</td>"+
                            "<td>"+data.rows[i].replycnt+"</td></tr>";

                    }

                    $('#board').append(str);
                    boardScroll += 20;

                },
                error: function(err){
                    console.log('err');
                    alert('Ajax Error: ' + err);
                }
            });
        }
    });

    $('#readModal-replies').scroll(function(){

        if ($('#readModal-replies').scrollTop() >= $('#replies').height() - $('#readModal-replies').height()) {

            var rno = $(".rno:last").html();
            var bno = $(this).data("bno");

            $.ajax({
                url: "/loadreply",
                type: "POST",
                dataType: "json",
                data: {
                    rno: replyScroll,
                    bno: bno
                },
                success: function (data) {

                    var str;

                    for(var i= 0, max=data.rows.length; i<max; i++){

                        //console.log(data.rows[i].bno);

                        str += "<tr>" +
                            "<td class='rno' data-rno='"  +data.rows[i].rno +  "'>"+data.rows[i].replyer+"</td>"+
                            "<td>"+data.rows[i].replytext+"</td>"+
                            "<td>"+data.rows[i].replydate+"</td>" +
                            "<td><button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyModify'>M</button>" +
                            "<button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyDelete'>D</button></td></tr>";

                    }

                    $('#replies').append(str);
                    replyScroll += 5;

                },
                error: function (err) {

                }

            });

        }
    });

});

$('#commentSubmit').click(function(){

    var bno = $(this).data("bno");

    $.ajax({
        url: "/writereply",
        type: "POST",
        dataType: "json",
        data: {
            bno: bno,
            replyer: getCookie('userId'),
            replytext: $('#commentText').val()
        },
        success: function(data){
            var str = "<tr>"+
                "<th width=\"20%\">작성자</th>" +
                "<th width=\"45%\">내용</th>"+
                "<th width=\"20%\">작성일</th>"+
                "<th width=\"15%\"></th></tr>";

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr>"+
                    "<td class='rno' data-rno='"  +data.rows[i].rno +  "'>"+data.rows[i].replyer+"</td>"+
                    "<td>"+data.rows[i].replytext+"</td>"+
                    "<td>"+data.rows[i].replydate+"</td>" +
                    "<td><button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyModify'>M</button>" +
                    "<button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyDelete'>D</button></td></tr>";

            }

            $('#replies').html(str);
            $('#commentText').val("");
        },
        error: function(err){

        }
    });
    $.ajax({
        url: "/replycntinc",
        type: "POST",
        dataType: "json",
        data: {
            bno: bno
        },
        success: function(data){
            var str = "<tr bgcolor='#ffb6c1'>"+
                "<th width='10%'>글번호</th>"+
                "<th width='40%'>제목</th>"+
                "<th width='30%'>작성자</th>"+
                "<th width='10%'>조회수</th>"+
                "<th width='10%'>댓글수</th></tr>";

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr onclick=\"readPage("+data.rows[i].bno+")\">"+
                    "<td class='bno'>"+data.rows[i].bno+"</td>"+
                    "<td>"+data.rows[i].title+"</td>"+
                    "<td>"+data.rows[i].writer+"</td>"+
                    "<td>"+data.rows[i].viewcnt+"</td>"+
                    "<td>"+data.rows[i].replycnt+"</td></tr>";

            }

            $('#board').html(str);
            boardScroll=0;
        },
        error: function(err){

        }
    });
});

$(document).on("click", ".btn-replyModify", function(){

    var rno = $(this).attr("data-rno");
    var bno = $(this).attr("data-bno");

    $.ajax({
        url: "/replymodal",
        type: "POST",
        dataType: "json",
        data: {
            rno: rno
        },
        success: function(data){

            var replyer = data.rows[0].replyer;
            var replytext = data.rows[0].replytext;

            console.log(replyer);
            console.log(replytext);

            $('#reply-modify').data("rno", rno);
            $('#reply-modify').data("bno", bno);
            //$('#reply-modify').data("replyer", replyer);
            //$('#reply-modify').data("replytext", replytext);
            $('#reply-writer').val(replyer);
            $('#reply-text').val(replytext);
            $('#modifyReply').modal('show');

        },
        error: function(err){

        }
    });

});

$(document).on("click", "#reply-modify", function(){

    var rno = $(this).data("rno");
    var bno = $(this).data("bno");
    //var replyer = $(this).data("replyer");
    //var replytext = $(this).data("replytext");

    $.ajax({
        url: "/updatereply",
        type: "POST",
        dataType: "json",
        data: {
            bno: bno,
            rno: rno,
            replyer: getCookie('userId'),
            replytext: $('#reply-text').val()
        },
        success: function(data){
            var str = "<tr>"+
                "<th width=\"20%\">작성자</th>" +
                "<th width=\"45%\">내용</th>"+
                "<th width=\"20%\">작성일</th>"+
                "<th width=\"15%\"></th></tr>";

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr>" +
                    "<td class='rno' data-rno='"  +data.rows[i].rno +  "'>"+data.rows[i].replyer+"</td>"+
                    "<td>"+data.rows[i].replytext+"</td>"+
                    "<td>"+data.rows[i].replydate+"</td>" +
                    "<td><button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyModify'>M</button>" +
                    "<button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyDelete'>D</button></td></tr>";

            }

            $('#replies').html(str);
            $('#reply-writer').val("");
            $('#reply-text').val("");
        },
        error: function(err){

        }
    });

});

$(document).on("click", ".btn-replyDelete", function(){

    var rno = $(this).attr("data-rno");
    var bno = $(this).attr("data-bno");

    $.ajax({
        url: "/deletereply",
        type: "POST",
        dataType: "json",
        data: {
            rno: rno,
            bno: bno
        },
        success: function(data){
            var str = "<tr>"+
                "<th width=\"20%\">작성자</th>" +
                "<th width=\"45%\">내용</th>"+
                "<th width=\"20%\">작성일</th>"+
                "<th width=\"15%\"></th></tr>";

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr>" +
                    "<td class='rno' data-rno='"  +data.rows[i].rno +  "'>"+data.rows[i].replyer+"</td>"+
                    "<td><input class='replytext' type='text' value='"+data.rows[i].replytext+"' style='border: 0px;' readonly></td>"+
                    "<td>"+data.rows[i].replydate+"</td>" +
                    "<td><button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyModify'>M</button>" +
                    "<button data-rno='"+data.rows[i].rno+"' data-bno='"+bno+"' class='btn-replyDelete'>D</button></td></tr>";

            }

            $('#replies').html(str);
        },
        error: function(err){

        }
    });
    $.ajax({
        url: "/replycntdec",
        type: "POST",
        dataType: "json",
        data: {
            bno: bno
        },
        success: function(data){
            var str = "<tr bgcolor='#ffb6c1'>"+
                "<th width='10%'>글번호</th>"+
                "<th width='40%'>제목</th>"+
                "<th width='30%'>작성자</th>"+
                "<th width='10%'>조회수</th>"+
                "<th width='10%'>댓글수</th></tr>";

            for(var i= 0, max=data.rows.length; i<max; i++){

                //console.log(data.rows[i].bno);

                str += "<tr onclick=\"readPage("+data.rows[i].bno+")\">"+
                    "<td class='bno'>"+data.rows[i].bno+"</td>"+
                    "<td>"+data.rows[i].title+"</td>"+
                    "<td>"+data.rows[i].writer+"</td>"+
                    "<td>"+data.rows[i].viewcnt+"</td>"+
                    "<td>"+data.rows[i].replycnt+"</td></tr>";

            }

            $('#board').html(str);
            boardScroll=0;
        },
        error: function(err){

        }
    });

});

/* 내용 입력 체크 */
function onWriteSubmit(){
    if ( $("#write-writer").val().trim() == "" )
    {
        var message = "아이디를 입력해 주세요";
        $("#write-writer").val("");
        $("#write-writer").focus();
        alert(message);
        return false;
    }

    if ( $("#write-title").val().trim() == "" )
    {
        var message = "제목을 입력해 주세요";
        $("#write-title").val("");
        $("#write-title").focus();
        alert(message);
        return false;
    }

    if ( $("#write-content").val().trim() == "" )
    {
        var message = "본문 내용을 입력해 주세요";
        $("#write-content").val("");
        $("#write-content").focus();
        alert(message);
        return false;
    }

    return true;
}