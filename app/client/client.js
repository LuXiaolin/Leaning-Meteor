/**
 * Created by Lu Xiaolin on 14-3-18.
 */


if (Meteor.isClient) {
  Template.adminTemplate.helpers({
    // check if user is an admin
    isAdminUser: function() {
      return Roles.userIsInRole(Meteor.user(), ['admin']);
    }
  })
}