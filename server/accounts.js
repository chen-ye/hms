Accounts.onCreateUser(function(options, user) {
 if (options.profile) {
  user.profile = options.profile;
 }
 if (options.hackerAuth) {
  user.hackerAuth = options.hackerAuth;
 }
 console.log(user);
});