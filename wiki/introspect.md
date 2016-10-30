#RFC7662
# INTERNAL
   For example, the following shows a protected resource calling the
   token introspection endpoint to query about an OAuth 2.0 bearer
   token.  The protected resource is using a separate OAuth 2.0 bearer
   token to authorize this call.
The following is a non-normative example request:

     POST /introspect HTTP/1.1
     Host: server.example.com
     Accept: application/json
     Content-Type: application/x-www-form-urlencoded
     Authorization: Bearer 23410913-abewfq.123483

     token=2YotnFZFEjr1zCsicMWpAA


# EXTERNAL
   In this example, the protected resource uses a client identifier and
   client secret to authenticate itself to the introspection endpoint.
   The protected resource also sends a token type hint indicating that
   it is inquiring about an access token.
The following is a non-normative example request:

     POST /introspect HTTP/1.1
     Host: server.example.com
     Accept: application/json
     Content-Type: application/x-www-form-urlencoded
     Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

     token=mF_9.B5f-4.1JqM&token_type_hint=access_token