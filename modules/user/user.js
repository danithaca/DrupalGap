/**
 *
 */
function user_listing() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_listing()');
      console.log(JSON.stringify(arguments));
    }
    // Place an empty item list that will hold a list of users.
    var content = {
      'user_listing':{
        'theme':'jqm_item_list',
        'title':'Users',
        'items':[],
        'attributes':{'id':'user_listing_list'},
      }
    };
    return content;
  }
  catch (error) {
    alert('user_listing - ' + error);
  }
}

/**
 * Loads a user object.
 */
function user_load(uid) {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_load(' + uid + ')');
    }
    var user = null;
    drupalgap.services.user.retrieve.call({
      'uid':uid,
      'async':false,
      'success':function(data){ user = data; },
    });
    return user;
  }
  catch (error) {
    alert('user_load - ' + error);
  }
}

/**
 * Logs the app user out of the website and app.
 */
function user_logout() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_logout()');
      console.log(JSON.stringify(arguments));
    }
    drupalgap.services.user.logout.call({
      'success':function(data){
        drupalgap.services.system.connect.call({
          'success':function(result){
            drupalgap_goto(drupalgap.settings.front);
          },
        });
      }
    });
  }
  catch (error) {
    alert('user_logout - ' + error);
  }
}

/**
 * The pageshow callback handler for the user listing page.
 */
function user_listing_pageshow() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_listing_pageshow()');
    }
    // Grab some users and display them.
		drupalgap.views_datasource.call({
      'path':'drupalgap/views_datasource/drupalgap_users',
      'success':function(data) {
        // Extract the users into items, then drop them in the list.
        var items = [];
        $.each(data.users, function(index, object){
            items.push(l(object.user.name, 'user/' + object.user.uid));
        });
        drupalgap_item_list_populate("#user_listing_list", items);
      },
    });
  }
  catch (error) {
    alert('user_listing_pageshow - ' + error);
  }
}

function user_login() {
  var form = {
    'id':'user_login',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
      },
      'pass':{
        'type':'password',
        'title':'Password',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Login',
      },
    },
  };
  return form;
}

function user_login_submit(form, form_state) {
  try {
    // WARNING: only print this out for debugging, you don't want your password
    // floating around in a JS console!
    /*if (drupalgap.settings.debug) {
      console.log('user_login_submit()');
      console.log(JSON.stringify(arguments));
    }*/
    //alert('user_login_submit');
    drupalgap.services.drupalgap_user.login.call({
      'name':form_state.values.name,
      'pass':form_state.values.pass,
      'success':function(result){
        drupalgap_goto(drupalgap.settings.front);
      },
    });
  }
  catch (error) {
    alert('user_login_submit - ' + error);
  } 
}

/**
 * Implements hook_menu().
 */
function user_menu() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_menu()');
      console.log(JSON.stringify(arguments));
    }
    var items = {
      'user':{
        'page_callback':'user_page',
      },
      'user/login':{
        'page_callback':'drupalgap_get_form',
        'page_arguments':['user_login'],
      },
      'user/logout':{
        'page_callback':'user_logout',
      },
      'user/register':{
        'page_callback':'drupalgap_get_form',
        'page_arguments':['user_register'],
      },
      'user/%':{
        /*'title':'My account',
        'title_callback':'user_page_title',*/
        'page_callback':'user_view',
        'page_arguments':[1],
      },
      'user-listing':{
        'page_callback':'user_listing',
        'access_arguments':['access user profiles'],
        'pageshow':'user_listing_pageshow',
      },
    };
    return items;
  }
  catch (error) {
    alert('user_menu - ' + error);
  }
}

/**
 * Page callback for the user page.
 */
function user_page() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_page()');
    }
    if (drupalgap.user.uid != 0) {
      var path = 'user/' + drupalgap.user.uid;
      //menu_set_active_item(path);
      //return menu_execute_active_handler(null, false);
      return menu_execute_active_handler(path, false);
    }
    else {
      return drupalgap_get_form('user_login');
    }
  }
  catch (error) {
    alert('user_page - ' + error);
  }
}

function user_register() {
  var form = {
    'id':'user_register',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
        'description':'Spaces are allowed; punctuation is not allowed except for periods, hyphens, apostrophes, and underscores.',
      },
      'mail':{
        'type':'email',
        'title':'E-mail address',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Create new account',
      },
    },
  };
  return form;
}

function user_register_submit(form, form_state) {
  try {
    drupalgap.services.user.register.call({
      'name':drupalgap.form_state.values.name,
      'mail':drupalgap.form_state.values.mail,
      'success':function(data){
        $.mobile.changePage(drupalgap.settings.front);
      },
    });
  }
  catch (error) {
    alert('user_register_submit - ' + error);
  }
}

function user_profile_form() {
  var form = {
    'id':'user_profile_form',
    'entity_type':'user',
    'elements':{
      'name':{
        'type':'textfield',
        'title':'Username',
        'required':true,
      },
      'mail':{
        'type':'email',
        'title':'E-mail address',
        'required':true,
      },
      'picture':{
        'type':'image',
        'widget_type':'imagefield_widget',
        'title':'Picture',
        'required':false,
        'value':'Add Picture',
      },
      'submit':{
        'type':'submit',
        'value':'Create new account',
      },
    },
    'buttons':{
      'cancel':{
        'title':'Cancel',
      },
    },
  };
  return form;
}

function user_profile_form_loaded() {
  try {
    // Are we editing a user?
    if (drupalgap.account_edit.uid) {
      // Retrieve the user and fill in the form values.
      drupalgap.services.user.retrieve.call({
        'uid':drupalgap.account_edit.uid,
        'success':function(account){
          // Set the drupalgap account edit.
          drupalgap.account_edit = account;
          // Load the entity into the form.
          drupalgap_entity_load_into_form('user', null, drupalgap.account_edit, drupalgap.form);
          /*$('#name').val(account.name);
          if (account.mail) {
            $('#mail').val(account.mail);
          }
          else {
            $('#mail').hide();
            $('#current_pass').hide();
          }
          */
          /*if (account.picture) {
            $('#edit_picture').attr('src', drupalgap_image_path(account.picture.uri)).show();
          }*/
        }
      });
    }
  }
  catch (error) {
    alert('node_edit_loaded - ' + error);
  }
}

/**
 *
 */
function user_profile_form_submit(form, form_state) {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_profile_form_submit()');
      console.log(JSON.stringify(arguments));
    }
    var user = drupalgap_entity_build_from_form_state();
    drupalgap_entity_form_submit(user);
  }
  catch (error) {
    alert('user_profile_form_submit - ' + error);
  }
}

/**
 * Implements hook_theme().
 */
function user_theme() {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_theme()');
    }
    return {
      'user_picture':{
        'template':'user-picture',
      },
      'user_profile':{
        'template':'user-profile',
      },
    };
  }
  catch (error) {
    alert('user_theme - ' + error);
  }
}

/**
 * Generate an array for rendering the given user.
 */
function user_view(account) {
  try {
    if (drupalgap.settings.debug) {
      console.log('user_view()');
      console.log(JSON.stringify(arguments));
    }
    // Determine the incoming arguments, and set defaults if necessary.
    var view_mode = 'full';
    var langcode = null;
    if (arguments[1]) { view_mode = arguments[1]; }
    if (arguments[2]) { langcode = arguments[2]; }
    if (!langcode) { langcode = drupalgap.settings.language; }
    if (account) {
      var build = {
        'theme':'user_profile',
        'account':account,
        'view_mode':view_mode,
        'language':langcode,
        'name':{'markup':account.name},
        'created':{'markup':(new Date(parseInt(account.created)*1000)).toDateString()},
      };
      // Any picture?
      if (account.picture && account.picture.fid) {
        build.picture = {
          'theme':'image',
          'path':account.picture.uri,
        };
      }
      return build;
    }
    else {
      alert('user_view - account was empty!');
    }
  }
  catch (error) {
    alert('user_view - ' + error);
  }
}

/**
 * Given a user role (string), this determines if the current user has the role.
 * Returns true if the user has the role, false otherwise. You may pass in a
 * user account object to check against a certain account, instead of the current user.
 */
function drupalgap_user_has_role(role) {
  try {
    if (drupalgap.settings.debug) {
      console.log('drupalgap_user_has_role(' + role + ')');
    }
    var has_role = false;
    var account = null;
    if (arguments[1]) { account = arguments[1]; }
    else { account = drupalgap.user; }
    $.each(account.roles, function(rid, value){
        if (role == value) {
          has_role = true;
          return false;
        }
    });
    return has_role;
  }
  catch (error) {
    alert('drupalgap_user_has_role - ' + error);
  }
}

