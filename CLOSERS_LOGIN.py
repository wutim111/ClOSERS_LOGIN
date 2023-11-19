import webbrowser    
import requests
import json
import base64
import time
import datetime

#Vars
textformat_list=['{','}','Email:','Password:' ,'\n' ]
Login=''
access_token=''
#Exp_time=''
headers = {
  'Content-Type': 'application/json'
}

def init_var():
  Login=''
  access_token=''
  #Exp_time=''

def read_Login():
  lines=[]
  try:
    f = open('Login.txt')
    lines = f.readlines()
  finally:
    f.close()
  return lines

def textformat(text):
  new_text=text
  for i in range(0,len(textformat_list)) :
    new_text=new_text.replace(textformat_list[i],'')
  return new_text

def POST_to_API(Login):
  url = "https://api.closers.com.tw/v1/auth-game/signIn"
  
  email=textformat(Login[0])
  password=textformat(Login[1])
  
  payload = json.dumps({
  "email": email,
  "password": password,
  "steamid": ""
  })
  response = requests.request("POST", url, headers=headers, data=payload)

  response_text=response.text
  response_json=json.loads(response_text)
  response_data=response_json.get('data')
  access_token= response_data['userGameInfo']['token']
  return access_token

def start_game(access_token):
  urL='naddiclaunchertwn:'+access_token
  webbrowser.get('windows-default').open_new(urL)

def chk_access_token(JWT):
  JWT_BODY=JWT.split('.')[1]
  while(len(JWT_BODY)<64):
    JWT_BODY+='='
  body= json.loads(base64.b64decode(JWT_BODY).decode('ascii'))
  token_exp=int(body['exp'])

  #當前時間
  
  dtime = datetime.datetime.now()
  now=int(time.mktime(dtime.timetuple()))

  #Exp_time=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(token_exp))

  if(now>=token_exp):
    return True
  else :
    return False

def is_token_txt_null():
  text=''
  try :
    f = open('token.txt','r+')
    text=f.read()
  finally :
    f.close()
  if text=='' : 
    return True
  else : 
    return False

def read_token_txt():
  token=''
  try :
    f = open('token.txt','r')
    token= f.read()
  finally:
    f.close()
  return token

def write_token_txt(text):
  try:
    f = open('token.txt','w')
    f.write(text)
  finally:
    f.close()

def write_share_txt():
  try:
    f = open('share.txt','w')
    f.write('naddiclaunchertwn:'+access_token)
  finally:
    f.close()

init_var()

Login=read_Login()
if is_token_txt_null() :
  access_token=POST_to_API(Login)
  write_token_txt(access_token)
else :
  access_token=read_token_txt()
  if (chk_access_token(access_token)) :
    access_token=POST_to_API(Login)
    write_token_txt(access_token)
  else :
    try:
      access_token=read_token_txt()
    except:
      access_token=POST_to_API(Login)
      write_token_txt(access_token)
      
write_share_txt()
start_game(access_token)
