Meteor.methods({
  assignRole: function (id, roles) {
    this.unblock();
    check(id, String);
    check(roles, [String]);

    //TODO: disallow adding as admin, other protected roles
    Roles.addUsersToRoles(user._id, roles, Roles.GLOBAL_GROUP);
  }
});