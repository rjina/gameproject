$(function(){

    $('.tab-pane:first').addClass("active");

    $('ul.nav.nav-tabs li a').click(function(event){
        event.preventDefault();
        $(this).tab('show');
        $('.tab-pane').removeClass("active");
        $($(this).attr("rel")).addClass("active");
        return false;
    });

    $('#accordion a').click(function(event){
        event.preventDefault();
        $($(this).attr('rel')).collapse('toggle');
        return false;
    });

});

$('#codeSection').click(function(){
    if(getCookie('userId') != null){
        $.ajax({
            url: "/loadcode",
            type: "POST",
            dataType: "json",
            data: {
                userid: getCookie('userId')
            },
            success: function(data){

                $('ul#codeTab li').not('#li-buttons').remove();
                $('div#tab-content div').remove();

                if(data.rows == "") {
                    $('ul#codeTab li:last-child').before('<li id="li' + 1 + '" style="width: 18%; margin: 0;"><a href="#tab' + 1 + '" data-toggle="tab"><input type="text" id="title' + 1 + '" style="width: 70%;"/><button type="button" onclick="removeTab(' + 1 + ');"><i class="fa fa-close"></i></button></a>');
                    $('div#tab-content').append('<div class="tab-pane fade" id="tab' + 1 + '"><textarea id="tab' + 1 + '_code" cols="90%" rows="20px" style="border: 0px; resize: none;">this.run = function() {\n\n};\n this.scan = function (enemy) {\n\n};\n this.hit = function (enemy) {\n\n};\n this.hitted = function (enemy) {\n\n};\n this.wallBlock = function (direction) {\n\n};</textarea></div>');
                }else {
                    for (var i = 0, max = data.rows.length; i < max; i++) {
                        data.rows[i].codecontent = data.rows[i].codecontent.substring((data.rows[i].codename.length * 2) + 29, data.rows[i].codecontent.length -1);
                        $('ul#codeTab li:last-child').before('<li id="li' + ( i + 1 ) + '" style="width: 18%; margin: 0;"><a href="#tab' + ( i + 1 ) + '" data-toggle="tab"><input type="text" id="title' + ( i + 1 ) + '" value="' + data.rows[i].codename + '" style="width: 70%;"/><button type="button" onclick="removeTab(' + ( i + 1 ) + ');"><i class="fa fa-close"></i></button></a>');
                        $('div#tab-content').append('<div class="tab-pane fade" id="tab' + ( i + 1 ) + '"><textarea id="tab' + ( i + 1 ) + '_code" cols="90%" rows="20px" style="border: 0px; resize: none;">' + data.rows[i].codecontent + '</textarea></div>');
                    }
                }

            },
            error: function(err){

            }
        });
    }else {
        $('ul#codeTab li').not('#li-buttons').remove();
        $('div#tab-content div').remove();
        $('div#tab-content').append('<div><img src="./images/tit_login.png" style="padding-top: 110px;"></div>');
    }
});

$('#add').click(function(){

    if(getCookie('userId') == null){
        event.preventDefault();
        alert("로그인 후 이용하실 수 있습니다.");
        $("#loginPage").trigger("click");
        return false;
    }else {
        var nbrLiElem = ($('ul#codeTab li').length) - 1;
        console.log("nbrLiElem: " + nbrLiElem);

        if (nbrLiElem >= 5) {
            alert('5개 이상은 만들지마라');
        } else {
            $('ul#codeTab li:last-child').before('<li id="li' + (nbrLiElem + 1) + '" style="width: 18%; margin: 0;"><a href="#tab' + (nbrLiElem + 1) + '" data-toggle="tab"><input type="text" id="title' + (nbrLiElem + 1) + '" style="width: 70%;"/><button type="button" onclick="removeTab(' + (nbrLiElem + 1) + ');"><i class="fa fa-close"></i></button></a>');
            $('div#tab-content').append('<div class="tab-pane fade" id="tab' + (nbrLiElem + 1) + '"><textarea id="tab' + (nbrLiElem + 1) + '_code" cols="90%" rows="20px" style="border: 0px; resize: none;">this.run = function() {\n\n};\n this.scan = function (enemy) {\n\n};\n this.hit = function (enemy) {\n\n};\n this.hitted = function (enemy) {\n\n};\n this.wallBlock = function (direction) {\n\n};</textarea></div>');
        }
    }
});

$('#save').click(function(event){

    if(getCookie('userId') == null){
        event.preventDefault();
        alert("로그인 후 이용하실 수 있습니다.");
        $("#loginPage").trigger("click");
        return false;
    }else {
        var userid = getCookie('userId');
        var codenames = new Array();
        var codecontents = new Array();

        $('ul#codeTab > li').not('#li-buttons').each(function(i){
            var getAttr = $(this).attr('id').split('li');
            var tabTitle = $('#' + $('#title' + getAttr[1]).attr('id')).val();
            var tabcontent = "function " + tabTitle + " (){ this.name = '" + tabTitle + "'; ";
            tabcontent += $('#' + $('#tab' + getAttr[1]).attr('id') + '_code').val();
            tabcontent += "}";
            codenames.push(tabTitle);
            codecontents.push(tabcontent);
        });

        if(codenameDuplicationCheck(codenames)==false){
            alert("중복된 코드이름이 있습니다.");
            return false;
        }

        $.ajaxSettings.traditional = true;
        $.ajax({
            url: "/savecode",
            type: "POST",
            dataType: "text",
            data: {
                userid: userid,
                codenames: codenames,
                codecontents: codecontents
            },
            success: function (data) {

                alert(data);

            },
            error: function (err) {

            }
        });
    }
});

$('.btn-close').click(function(){

    alert(getCookie('userId'));

});

/* 탭 삭제 */
function removeTab(liElem) {
    console.log("liElem: " + liElem);
    if (confirm("Are you sure?")) {
        $('ul#codeTab > li#li' + liElem).remove();
        $('div.tab-content div#tab' + liElem).remove();

        $('ul#codeTab > li').not('#li-buttons').not('#li' + liElem).each(function(i){
            var getAttr = $(this).attr('id').split('li');
            var tabTitle = $('#' + $('#title' + getAttr[1]).attr('id')).val();
            var tabContent = $('#' + $('#tab' + getAttr[1]).attr('id') + '_code').val();

            $('ul#codeTab li#li' + getAttr[1]).attr('id', 'li' + (i + 1));

            var tab = '<input type="text" id="title' + (i + 1) + '" value="' + tabTitle + '" style="width: 70%;"/><button type="button" onclick="removeTab(' + (i + 1) + ');"><i class="fa fa-close"></i></button>';
            $('#codeTab a[href="#tab' + getAttr[1] + '"]').html(tab).attr('href', '#tab' + (i + 1));
            $('#tab' + getAttr[1] + '_code').html(tabContent).attr('id', 'tab' + (i + 1) + '_code');
            $('div#tab-content div#tab' + getAttr[1]).attr('id', 'tab' + (i + 1));
        });
    }
    return false;
}

/* 코드이름 중복 체크 */
function codenameDuplicationCheck(codenames){
    //console.log("Duplication Check Function: " + codenames);

    for(var i=0; i<codenames.length-1; i++){
        for(var j=i+1; j<codenames.length; j++){
            if(codenames[i]==codenames[j]){
                console.log("중복중복복");
                return false;
            }
        }
    }
    return true;
}