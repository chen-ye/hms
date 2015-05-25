function conditionalValidator(entry, condition) {
 if (condition && !entry.isSet && (!entry.operator || (entry.value === null || entry.value === ""))) {
  return "required";
 }
}

var Schemas = {};

Schemas.Teammate = new SimpleSchema({
 email: {
  type: String,
  label: "Email",
  max: 64,
  regEx: SimpleSchema.RegEx.Email
 },
 name: {
  type: String,
  label: "Name",
  max: 64,
  optional: true
 },
 person: {
  type: Schemas.Person,
  optional: true
 }
});

Schemas.Link = new SimpleSchema({
 url: {
  type: String,
  label: "URL",
  regEx: SimpleSchema.RegEx.Url
 },
 type: {
  type: String,
  label: "Type",
  max: 32
 }
});

Schemas.Person = new SimpleSchema({
 name: {
  type: String,
  label: "Name",
  max: 64
 },
 email: {
  type: String,
  label: "Email",
  max: 64,
  regEx: SimpleSchema.RegEx.Email,
  index: true,
  unique: true
 },
 phone: {
  type: String,
  label: "Phone Number",
  max: 16,
  regEx: /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
  optional: true
 },
 createdAt: {
  type: Date,
  label: "Created At",
  autoValue: function () {
   if (this.isInsert) {
    return new Date;
   } else if (this.isUpsert) {
    return {
     $setOnInsert: new Date
    };
   } else {
    this.unset();
   }
  }
 },
 updatedAt: {
  type: Date,
  autoValue: function () {
   if (this.isUpdate) {
    return new Date();
   }
  },
  denyInsert: true,
  optional: true
 },
 roles: {
  type: Object
 },
 "roles.hacker": {
  type: Boolean,
  defaultValue: false
 },
 "roles.volunteer": {
  type: Boolean,
  defaultValue: false
 },
 "roles.mentor": {
  type: Boolean,
  defaultValue: false
 },
 "roles.organizer": {
  type: Boolean,
  defaultValue: false
 },
 "roles.visitor": {
  type: Boolean,
  defaultValue: false
 },
 "roles.judge": {
  type: Boolean,
  defaultValue: false
 },
 shirt: {
  type: Object,
  optional: true,
  custom: function () {
   //custom function to conditionally make this a required field if person is a volunteer, organizer, or hacker
   var customCondition = this.field('roles.hacker').value == true || this.field('roles.volunteer').value == true || this.field('roles.organizer').value == true; //somebody kill me now
   return conditionalValidator(this, customCondition);
  }
 },
 "shirt.size": {
  type: String,
  label: "T-Shirt Size",
  allowedValues: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
 },
 "shirt.gender": {
  type: String,
  label: "T-Shirt Gender",
  allowedValues: ["Mens", "Womens"],
 },
 school: {
  type: Object,
  optional: true,
  custom: function () {
   var customCondition = this.field('roles.hacker').value == true;
   return conditionalValidator(this, customCondition);
  }
 },
 "school.name": {
  type: String,
  label: "School",
  max: 32,
 },
 "school.year": {
  type: String,
  label: "Year",
  allowedValues: ["First Year", "Second Year", "Third Year", "Fourth Year", "High School"]
 },
 "school.major": {
  type: [String],
  label: "Major"
 },
 interests: {
  type: [String],
  label: "Interests",
  optional: true
 },
 links: {
  type: [Schemas.Link],
  label: "Links",
  optional: true
 },
 teammates: {
  type: [Schemas.Teammate],
  label: "Teammates",
  optional: true
 },
 dietary_restrictions: {
  type: [String],
  label: "Dietary Restrictions",
  optional: true
 }
});


var People = new Mongo.Collection("people");
People.attachSchema(Schemas.Person);


function submitForm(event, collection, callback) {
 var $form = $(event.target),
  entry = {};

 $.each($form.serializeArray(), function () {
  entry[this.name] = this.value;
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

 //   Hackers = new FilterCollections(People, {
 //    template: 'peopleList',
 //    filters: {
 //     "roles.hacker": {
 //      title: "Hacker",
 //      operator: ['$eq'],
 //      sort: 'desc',
 //      searchable: 'optional'
 //     }
 //    }
 //   });

 Template.body.helpers({
  people: function () {
   return People.find({}, {
    sort: {
     createdAt: -1
    }
   });
  }
 });

 Template.register_hacker_form.helpers({
  form: function () {
   return Template.instance().find("form.register");
  }
 });

 Template.register_hacker_form.onRendered(function () {
  //Initialize Semantic UI form validation
  this.$(".ui.form.register").form({
   name: {
    identifier: 'name',
    rules: [
     {
      type: 'empty',
      prompt: 'Please enter your name'
          }
        ]
   },
   email: {
    identifier: 'email',
    rules: [
     {
      type: 'email',
      prompt: 'Please enter a valid email'
          }
        ]
   },
   phone: {
    identifier: 'phone',
    rules: [
     {
      type: 'empty',
      prompt: 'Please enter a valid phone number'
          }
        ]
   },
   school: {
    identifier: 'school',
    rules: [
     {
      type: 'empty',
      prompt: 'Please enter a valid school'
          }
        ]
   },
   year: {
    identifier: 'year',
    rules: [
     {
      type: 'empty',
      prompt: 'Please select a school year'
          }
        ]
   },
   major: {
    identifier: 'major',
    rules: [
     {
      type: 'empty',
      prompt: 'Please select or enter your intended majors'
          }
        ]
   },
   shirt_size: {
    identifier: 'shirt_size',
    rules: [
     {
      type: 'empty',
      prompt: 'Please select a T-Shirt size'
          }
        ]
   },
   shirt_gender: {
    identifier: 'shirt_gender',
    rules: [
     {
      type: 'empty',
      prompt: 'Please select a T-Shirt gender'
          }
        ]
   }
  });
  this.$("input[type=tel]").mask("(999) 999-9999");
  this.$("input#major").selectize({
   delimiter: ',',
   persist: false,
   create: true
  });
 });

 Template.register_hacker_form.events({
  "submit form.register": function (event) {
   // This function is called when the new task form is submitted
   event.preventDefault();
   return submitForm(event, People, function (event, entry) {
    entry.roles = {};
    entry.roles.hacker = true;
    entry.shirt = {};
    entry.shirt.size = entry["shirt.size"];
    delete entry["shirt.size"];
    entry.shirt.gender = entry["shirt.gender"];
    delete entry["shirt.gender"];
    entry.school = {};
    entry.school.name = entry["school.name"];
    delete entry["school.name"];
    entry.school.year = entry["school.year"];
    delete entry["school.year"];
    entry.school.major = $(event.target).find("input#major")[0].selectize.items;
    console.log(event);
    console.log(entry);
   });
  }
 });
 
 Template.person.events({
  "click .delete": function () {
   People.remove(this._id);
  }
 });
}

if (Meteor.isServer) {
 Meteor.startup(function () {
  // code to run on server at startup
 });

 //   FilterCollections.publish(People, {
 //    name: 'hackers',
 //    callbacks: { /*...*/ }
 //   });

}