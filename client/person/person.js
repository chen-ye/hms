Template.person.events({
 "click .delete": function () {
  People.remove(this._id);
 }
});