#Resource Owner Password Credentials Grant

## Access Token Request

Content-Type: application/x-www-form-urlencoded;charset=utf-8
+ grant_type (REQUIRED): 'password'
+ username (REQUIRED)
+ password (REQUIRED)
+ scope (OPTIONAL)


POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic cjkashd1782317132123
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=johndoe&password=123456

## Access Token Response

HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache
{
    "access_token": "asdau13871263ada",
    "token_type": "example",
    "expires_in": 3600,
    "refresh_token": "adqw123131",
    "example_parameter": "example_value"
}
