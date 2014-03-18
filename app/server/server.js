/**
 * Created by Lu Xiaolin on 14-3-18.
 */
if (Meteor.isServer) {
  Meteor.startup(function () {
    // bootstrap the admin user if they exist -- You'll be replacing the id later
    if (Meteor.users.findOne("pnEhsziimkkWfTFC7"))
      Roles.addUsersToRoles("pnEhsziimkkWfTFC7", ['admin']);

    // create a couple of roles if they don't already exist (THESE ARE NOT NEEDED -- just for the demo)
    if(!Meteor.roles.findOne({name: "secret"}))
      Roles.createRole("secret");

    if(!Meteor.roles.findOne({name: "double-secret"}))
      Roles.createRole("double-secret");
  });
}