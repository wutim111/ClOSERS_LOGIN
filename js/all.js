const commit = document.querySelector('#commit');
const email_input= document.querySelector('#exampleInputEmail1');
const password_input= document.querySelector('#exampleInputPassword1');
const textarea=document.querySelector('#textarea');
const game_start=document.querySelector('#game_start');

commit.addEventListener('click',function(e){
    e.preventDefault();
    let email=email_input.value;
    let password=password_input.value;
    //progream_status 0送出查詢 1開啟遊戲
    POST_TO_API(email,password,0)
})
game_start.addEventListener('click',function(e){
    e.preventDefault();
    let email=email_input.value;
    let password=password_input.value;
    //progream_status 0送出查詢 1開啟遊戲
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
        console.log(response);
        if (response.message=='Success'){
            if (progream_status==0){ 
                textarea.value='naddiclaunchertwn:'+response.data.userGameInfo.token;
            }
            else if(progream_status==1){
                textarea.value='naddiclaunchertwn:'+response.data.userGameInfo.token;
                window.open('naddiclaunchertwn:'+response.data.userGameInfo.token);
            }
        }
        else{
            alert('帳號密碼輸入有誤,無法取得token')
        }
    });
}