function conditionalValidator(entry, condition) {
 if (condition && !entry.isSet && (!entry.operator || (entry.value === null || entry.value === ""))) {
  return "required";
 }
}

var Schemas = {};

Schemas.UserProfile = new SimpleSchema({
 name: {
  type: String,
  label: "Name",
  max: 64
 },
 phone: {
  type: String,
  label: "Phone Number",
  max: 16,
  regEx: /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
  optional: true
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

Schemas.User = new SimpleSchema({
 username: {
  type: String,
  regEx: /^[a-z0-9A-Z_]{3,15}$/,
  optional: true
 },
 emails: {
  type: [Object],
  // this must be optional if you also use other login services like facebook,
  // but if you use only accounts-password, then it can be required
  optional: true
 },
 "emails.$.address": {
  type: String,
  regEx: SimpleSchema.RegEx.Email
 },
 "emails.$.verified": {
  type: Boolean
 },
 createdAt: {
  type: Date
 },
 profile: {
  type: Schemas.UserProfile,
  optional: true
 },
 services: {
  type: Object,
  optional: true,
  blackbox: true
 },
 // Add `roles` to your schema if you use the meteor-roles package.
 // Option 1: Object type
 // If you specify that type as Object, you must also specify the
 // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
 // Example:
 // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
 // You can't mix and match adding with and without a group since
 // you will fail validation in some cases.
 roles: {
  type: Object,
  optional: true,
  blackbox: true
 },
 hackerAuth: {
  type: Schemas.HackerAuth,
  optional: true
 }
});

//Meteor.users.attachSchema(Schemas.User);

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
  type: Schemas.User,
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

Schemas.HackerAuth = new SimpleSchema({
 secret: {
  type: String,
  label: "Secret",
  max: 43
 }
});
