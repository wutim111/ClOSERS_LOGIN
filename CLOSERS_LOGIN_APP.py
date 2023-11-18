import webbrowser    
import requests
import json




url = "https://api.closers.com.tw/v1/auth-game/signIn"
f = open('info.txt')
lines = f.readlines()

payload = json.dumps({
  "email": lines[0].replace('\n','').replace('Email:''',''),
  "password": lines[1].replace('\n','').replace('Password:''',''),
  "steamid": ""
})
headers = {
  'Content-Type': 'application/json'
}
response = requests.request("POST", url, headers=headers, data=payload)


response_data = json.loads(response.text)
result = response_data.get('data')
access_token=result['userInfo']['access_token']

urL='naddiclaunchertwn:'+access_token
webbrowser.get('windows-default').open_new(urL)