# Refreshing an Access Token

+ grant_type (REQUIRED): 'refresh_token'
+ refresh_token (REQUIRED)
+ scope (OPTIONAL)

## Request
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic asd123453wtwadasd
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=13123213

> Note: The Authorization header contains the base64 encoded [client_id:client_secret]



## Response
### Success

HTTP/ 1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
    "access_token": "asda1e1addadfa",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "asd0q73181"
}

### Error
+ invalid_request: The request is malformed and could not be processed
+ invalid_client: Client authentication failed
+ invalid_grant: The provided grant was invalid
+ unauthorized_client: The client application isn't authorized to make such a request
+ unsupported_grant_type: The authorization grant type is not supported
+ invalid_scope: The scope passed in is invalid


HTTP/ 1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
    "error": "invalid_client",
    "error_description": "Client authentication failed",
    "error_uri": "http://localhost:4000/errors"
}
