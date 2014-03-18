/**
 * Created by Lu Xiaolin on 14-3-18.
 */

Meteor.navigateTo = function (path) {
  Router.go (path);
};

function emailVerified (user) {
  return _.some (user.emails, function (email) {
    return email.verified;
  });
}
////////////////////////////////////////////////////////////////////
// App.signout
//
// The application
App = {};

App.signout = function () {
  console.log('logging out...');
  Meteor.logout(function () {
    console.log('...done');
    Meteor.navigateTo('/');
  });
};



var filters = {

  /**
   * ensure user is logged in and
   * email verified
   */
  authenticate: function () {
    var user;

    if (Meteor.loggingIn ()) {

      console.log ('filter: loading');
      this.render ('loading');
      this.layout = 'layout_no_header';
      this.stop ();

    } else {

      user = Meteor.user ();

      if (!user) {

        console.log ('filter: signin');
        this.render ('signin');
        this.layout = 'layout_no_header';
        this.stop ();
        return
      }

      if (!emailVerified (user)) {

        console.log ('filter: awaiting-verification');
        this.render ('awaiting-verification');
        this.layout = 'layout';
        this.stop ();

      } else {

        console.log ('filter: done');
        this.layout = 'layout';

      }
    }
  },  // end authenticate

  /**
   * nop used to illustrate multiple filters
   * use-case
   */
  testFilter: function () {
    console.log ('test filter')
  }

};  // end filters

//AuthenticateController = RouteController.extend({
//  before: authenticate
//});


Router.configure ({
  layout: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'not_found'

});


Router.map (function () {
  this.route ('one', {path: '/'});
  this.route ('two');
  /**
   * The route's name is "home"
   * The route's template is also "home"
   * The default action will render the home template
   */
  this.route ('home', {
    path: '/',
    template: 'home'
  });

  this.route ('admin', {
    path: '/admin',
    template: 'accountsAdmin',
    before: function () {
      if (!Roles.userIsInRole (Meteor.user (), ['admin'])) {
        Log ('Redirecting');
        this.redirect ('/');
      }
    }
  });
  /**
   * The route's name is "posts"
   * The route's path is "/posts"
   * The route's template is inferred to be "posts"
   */
  this.route ('posts', {
    path: '/posts',
    template: 'posts'
  });

  this.route ('post', {
    path: '/posts/:_id',

    load: function () {
      // called on first load
    },

    // before hooks are run before your action
    before: [
      function () {
        this.subscribe ('post', this.params._id).wait ();
        this.subscribe ('posts'); // don't wait
      },

      function () {
        // we're done waiting on all subs
        if (this.ready ()) {
          NProgress.done ();
        } else {
          NProgress.start ();
          this.stop (); // stop downstream funcs from running
        }
      }
    ],

    action: function () {
      var params = this.params; // including query params
      var hash = this.hash;
      var isFirstRun = this.isFirstRun;

      this.render (); // render all
      this.render ('specificTemplate', {to: 'namedYield'});
    },

    unload: function () {
      // before a new route is run
    }
  });

  this.route ('start', {
    path: '/',
    before: [filters.authenticate, filters.testFilter]
  });
  this.route ('start', {
    before: [filters.authenticate, filters.testFilter]
  });

  this.route ('signin');

  this.route ('secrets', {
    //controller: 'AuthenticateController'
    before: filters.authenticate
  });

  this.route ('manage', {
    before: filters.authenticate
  });

  this.route ('signout', App.signout);

  // why is this necessary when notFoundTemplate is
  // set in Router.configure?
  this.route ('*', {
    template: 'not_found'
  });
});