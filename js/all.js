const commit = document.querySelector('#commit');
const email_input= document.querySelector('#exampleInputEmail1');
const password_input= document.querySelector('#exampleInputPassword1');
const textarea=document.querySelector('#textarea');
const game_start=document.querySelector('#game_start');
const save=document.querySelector('#save');
const copy=document.querySelector('#copy');
const share=document.querySelector('#share');
const toastLiveExample = document.getElementById('liveToast')
const new_btn=document.querySelector('#new');
const acc=document.querySelector('#acc');

commit.addEventListener('click',function(e){
    e.preventDefault();
    let email=email_input.value;
    let password=password_input.value;
    //progream_status 0送出查詢 1開啟遊戲 2新建
    POST_TO_API(email,password,0)
})
game_start.addEventListener('click',function(e){
    e.preventDefault();
    let email=email_input.value;
    let password=password_input.value;
    //progream_status 0送出查詢 1開啟遊戲 2新建
    POST_TO_API(email,password,1)
})
const txt= document.querySelector('#iputGroupFile01');

txt.onchange = function() {
    let file = this.files[0];
    let reader = new FileReader();
    let filter_list=['Email:','Password:','{','}','\n',' ']
    reader.onload = function(progressEvent) {
        var fileContentArray = this.result.split(/\r\n|\n/);
        for (let line = 0; line < fileContentArray.length; line++) {
            let res= fileContentArray[line];
            for (i=0;i<filter_list.length;i++)
                res=res.replace(filter_list[i],'');
            if(line==0)
                email_input.value=res;
            else if (line==1)
                password_input.value=res;   
        }
    };
    reader.readAsText(file);
};

function POST_TO_API(email,password,progream_status){
    if(Date.parse(getCookieByName('exp')).valueOf() > Date.parse(new Date().toDateString()))
    {
        if(progream_status==0)
            return;
        else if (progream_status==1){
            window.open('naddiclaunchertwn:'+getCookieByName('token'));
        }
    }
    var settings = {
        "url": "https://api.closers.com.tw/v1/auth-game/signIn",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "email": email,
            "password": password,
            "steamid": ""
        }),
    };
    $.ajax(settings).done(function (response) {
        if (response.message=='Success'){
            if (progream_status==0){ 
                textarea.value='naddiclaunchertwn:'+response.data.userGameInfo.token;
            }
            else if(progream_status==1){
                textarea.value='naddiclaunchertwn:'+response.data.userGameInfo.token;
                window.open('naddiclaunchertwn:'+response.data.userGameInfo.token);
            }
            let exp=document.querySelector('#exp');
            const payload = JSON.parse(atob(response.data.userGameInfo.token.split('.')[1]));
            const expDate = new Date(new Date(0).setUTCSeconds(payload.exp));
            exp.textContent='有效期限:　'+expDate;

            acc.textContent=response.data.userGameInfo.display_name;
            document.cookie='token='+encodeURIComponent(response.data.userGameInfo.token);
            document.cookie='exp='+encodeURIComponent(expDate);
            document.cookie='acc='+encodeURIComponent(acc.textContent);
        }
        else{
            alert('帳號密碼輸入有誤,無法取得token')
        }
    });
}

save.addEventListener('click',function(e){
    e.preventDefault();
    saveFile();
});

copy.addEventListener('click',function(e){
    e.preventDefault();
    if (textarea.value==''){
        alert('空的還是別複製吧');
        return;
    }
    navigator.clipboard.writeText(textarea.value);
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
})

const shareData = {
    text:textarea.value
}

share.addEventListener('click',async()=>{
    try {
        await navigator.share(shareData)
    } catch(err) {
        console.log( 'Error: ' + err );
    }
})
$(document).ready(function () {
    if (getCookieByName('token') != undefined){
        textarea.value='naddiclaunchertwn:'+getCookieByName('token');
    }
    if (getCookieByName('exp') != undefined){
        exp.textContent='有效期限:　'+getCookieByName('exp');
    }
    if (getCookieByName('acc')!= undefined){
        acc.textContent=getCookieByName('acc');
    }
    if (Date.parse(getCookieByName('exp')).valueOf() < Date.parse(new Date().toDateString())){
        exp.textContent=exp.textContent+'\n已過期'
    }
});
new_btn.addEventListener('click',(e)=>{
    e.preventDefault();
    let email=email_input.value;
    let password=password_input.value;
    //progream_status 0送出查詢 1開啟遊戲 2新建
    POST_TO_API(email,password,2);
})


function saveFile () {
    if ((email_input.value=='') || (password_input.value=='')){
        alert('欄位有空,還是別下載吧');
        return;
    }
    var data = 'Email:'+email_input.value+'\n'+'Password:'+password_input.value;
    var name = 'Login.txt';//文件名
    this.exportRaw(data, name);
}


function exportRaw (data, name) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    save_link.click();
}

function parseCookie() {
    var cookieObj = {};
    var cookieAry = document.cookie.split(';');
    var cookie;
    
    for (var i=0, l=cookieAry.length; i<l; ++i) {
        cookie = jQuery.trim(cookieAry[i]);
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }
    
    return cookieObj;
}


function getCookieByName(name) {
    var value = parseCookie()[name];
    if (value) {
        value = decodeURIComponent(value);
    }

    return value;
}