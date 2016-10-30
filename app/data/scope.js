

const Scope = {

	email: ['email', 'email_verified'],
	phone: ["phone_number", "phone_number_verified"],
	profile: ["name", "family_name", "given_name", "middle_name", "nickname", "preferred_username", "profile", "picture", "website", "gender", "birthdate", "zoneinfo", "locale", "updated_at"],
	address: ['address']
}

// Claims format
// {
//    "sub"                     : "alice",
//    "email"                   : "alice@wonderland.net",
//    "email_verified"          : true,
//    "name"                    : "Alice Adams",
//    "given_name"              : "Alice",
//    "family_name"             : "Adams",
//    "phone_number"            : "+359 (99) 100200305",
//    "profile"                 : "https://c2id.com/users/alice",
//    "https://c2id.com/groups" : [ "audit", "admin" ]
//  }