Template.person.events({
 "click .delete": function () {
  Meteor.users.remove(this._id);
 }
});