# Roles

+ Resource Owner: the person or the application that holds the data to be shared
+ Resource Server: the application that holds the protected resources
+ Authorization Server: the application that verifies the identity of the users
+ Client: the application that makes requests to the RS on behalf of the RO


#Authorization Code Grant

## Authorization Request

+ response_type (required) value = 'code'
+ client_id (required) value = ad3h137datdbqjeb19870yxxqweqw
+ redirect_uri (optional) 
+ scope (optional)
+ state (recommended)

e.g. GET /authorize?response_type=code&client_id=s613687123&state=xyz&redirect_uri=https.redirect_url.com


## Authorization Response

+ code (required) value = TTL 10 minutes
+ state (recommended)

e.g. HTTP/1.1 302 Found
Location: https://client.example.com/cb?code=1313213adad&state=xyz

## Error Response
+ error
+ error_description
+ error_uri
+ state

e.eg HTTP/1.1 302 Found
Location: https://client.example.com/cb?error=access_denied&state=xyz

e.g. Error
- invalid_request
- unauthorized_client
- access_denied
- unsupported_response_type
- invalid_scope
- server_error
- temporarily_unavailable


## Access Token Request
+ grant_type (Required) value : 'authorization_code'
+ code (required)
+ redirect_uri
+ client_id

POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic asdjgacbyxbcaigdbqd1312
Content-Type: application/x-www-form-urlencoded
grant_type=authorization_code&code=asd8zqe13njad&redirect_uri=https:localhost:3000

## Access Token Response

HTTP/1.1 200 OK
Content-Type: application/json

{
    accessToken: 'yxce131asda',
    token_type: 'example',
    expires_in: 3600,
    refresh_token: 'asdasdqe12',
    example_parameter: 'example_value'
}