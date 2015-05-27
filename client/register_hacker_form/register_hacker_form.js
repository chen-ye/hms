function registerUser(event, preCallback, postCallback) {
 var $form = $(event.target),
  user = {};

 $.each($form.serializeArray(), function () {
  var nameArray = this.name.split(".");
  var currentObject = user;
  for (i = 0; i < nameArray.length - 1; i++) {
   if (!currentObject[nameArray[i]]) {
    currentObject[nameArray[i]] = {};
   }
   currentObject = currentObject[nameArray[i]];
  }
  currentObject[nameArray[nameArray.length - 1]] = this.value;
 });

 preCallback(event, user);

 var userId = Accounts.createUser(user, function (error) {
  if (!error) {
   $form[0].reset();
   postCallback();
  } else {
   console.error(error);
   postCallback(error);
  }
 });
 console.log("meep", userId);
 
 return userId;
}

Template.register_hacker_form.helpers({
 form: function () {
  return Template.instance().find("form.register");
 }
});

Template.register_hacker_form.onRendered(function () {
 //Initialize Semantic UI form validation
 // this.$(".ui.form.register").form({
 //  name: {
 //   identifier: 'name',
 //   rules: [
 //    {
 //     type: 'empty',
 //     prompt: 'Please enter your name'
 //    }
 //   ]
 //  },
 //  email: {
 //   identifier: 'email',
 //   rules: [
 //    {
 //     type: 'email',
 //     prompt: 'Please enter a valid email'
 //    }
 //   ]
 //  },
 //  phone: {
 //   identifier: 'phone',
 //   rules: [
 //    {
 //     type: 'empty',
 //     prompt: 'Please enter a valid phone number'
 //    }
 //   ]
 //  },
 //  school: {
 //   identifier: 'school',
 //   rules: [
 //    {
 //     type: 'empty',
 //     prompt: 'Please enter a valid school'
 //    }
 //   ]
 //  },
 //  year: {
 //   identifier: 'year',
 //   rules: [
 //    {
 //     type: 'empty',
 //     prompt: 'Please select a school year'
 //    }
 //   ]
 //  },
 //  major: {
 //   identifier: 'major',
 //   rules: [
 //    {
 //     type: 'empty',
 //     prompt: 'Please select or enter your intended majors'
 //    }
 //   ]
 //  },
 //  shirt_size: {
 //   identifier: 'shirt_size',
 //   rules: [
 //    {
 //     type: 'empty',
 //     prompt: 'Please select a T-Shirt size'
 //    }
 //   ]
 //  },
 //  shirt_gender: {
 //   identifier: 'shirt_gender',
 //   rules: [
 //    {
 //     type: 'empty',
 //     prompt: 'Please select a T-Shirt gender'
 //    }
 //   ]
 //  }
 // });
 this.$("input[type=tel]").mask("(999) 999-9999");
 this.$("input#major").selectize({
  delimiter: ',',
  persist: false,
  create: true
 });
});

Template.register_hacker_form.events({
 "submit form.register": function (event) {
  // This function is called when the new hacker form is submitted
  event.preventDefault();
  var userId = registerUser(event, function (event, user) {
   //    user.profile.roles = {};
   //    user.profile.roles.hacker = true;

   user.profile.school.major = $(event.target).find("input#major")[0].selectize.items;

   var secret = Random.secret();
   user.hackerAuth = {};
   user.hackerAuth.secret = secret;
   user.password = secret;

   console.log(event);
   console.log(user);
  }, function (error) {
   if (!error) {

    console.log("user created");

   } else {
    console.error(error);
   }
  });

  console.log(userId);
  if(userId) {
   Meteor.call("assignRole", [userId, ["hacker"]], function (error, result) {
    if (!error) {

     console.log("user role assigned");

    } else {
     console.error(error);
     return false;
    }
   });
  } else {
   console.error("no user id");
  }
  
 }
});