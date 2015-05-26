function submitForm(event, collection, callback) {
 var $form = $(event.target),
  entry = {};

 $.each($form.serializeArray(), function () {
  var nameArray = this.name.split(".");
  var currentObject = entry;
  for (i = 0; i < nameArray.length - 1; i++) {
   if (!currentObject[nameArray[i]]) {
    currentObject[nameArray[i]] = {};
   }
   currentObject = currentObject[nameArray[i]];
  }
  currentObject[nameArray[nameArray.length - 1]] = this.value;
 });

 callback(event, entry);

 collection.insert(entry, function (err, result) {
  if (!err) {
   $form[0].reset();
   return true;
  } else {
   console.log(err);
   return false;
  }
 });
}

if (Meteor.isClient) {
 // This code only runs on the client
 Meteor.startup(function () {
  AutoForm.setDefaultTemplate("semanticUI");
 });

 Template.body.helpers({
  people: function () {
   return Meteor.users.find({}, {
    sort: {
     createdAt: -1
    }
   });
  }
 });
}

if (Meteor.isServer) {
 Meteor.startup(function () {
  // code to run on server at startup
 });
}