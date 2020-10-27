/**
 * Created by Yoonji on 2015-08-31.
 */

var socket = io();




$("#chat").submit(function(){
    var userID = getCookie("userId");

    socket.emit('chat message', $("#msg").val());
    $("#msg").val("");
    return false;
});

socket.on("server msg", function(data){
    console.log(data);
    var msg = data.split(':');
    var yoon = "";

    if(msg[0] ==  getCookie("userId")){
        yoon = "<div class='direct-chat-msg right'>";
        yoon += "<div class='direct-chat-info clearfix'>";
        yoon +=  "<span class='direct-chat-name pull-right'>";
        yoon +=  msg[0];
        yoon += "</span>";
        yoon +=   "<span class='direct-chat-timestamp pull-left'>23 Jan 2:05 pm</span>";
        yoon += "</div>";
        yoon += "<img class='direct-chat-img' src='./images/cookie_00.PNG' alt='message user image'>";
        yoon += "<div class='direct-chat-text'>";
        yoon += msg[1];
        yoon += "</div>";
        yoon += "</div>";
        $(".direct-chat-messages").append(yoon);
    } else {
        yoon = " <div class='direct-chat-msg'>";
        yoon += "<div class='direct-chat-info clearfix'>";
        yoon +=  "<span class='direct-chat-name pull-left'>";
        yoon +=  msg[0];
        yoon += "</span>";
        yoon += "<span class='direct-chat-timestamp pull-right'>23 Jan 2:05 pm</span>";
        yoon += "</div>";
        yoon += "<img class='direct-chat-img' src='./images/wcs03.PNG' alt='message user image'>";
        yoon += "<div class='direct-chat-text'>";
        yoon += msg[1];
        yoon += "</div>";
        yoon += "</div>";
        $(".direct-chat-messages").append(yoon);

    }

    console.log($("#chatScroll")[0].scrollHeight);
    $("#chatScroll").scrollTop($("#chatScroll")[0].scrollHeight);

})


