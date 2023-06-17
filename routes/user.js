function printObject (obj) {
  for (const [k, v] of Object.entries(obj)) {
    console.log(k, v);
  }
}

// ---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
  message = '';
  if (req.method == 'POST') {
    console.log(req.body);
    const post = req.body;
    const name = post.user_name;
    const pass = post.password;
    const fname = post.first_name;
    const lname = post.last_name;
    const mob = post.mob_no;

    const sql =
      "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" +
      fname +
      "','" +
      lname +
      "','" +
      mob +
      "','" +
      name +
      "','" +
      pass +
      "')";

    console.log(sql);
    db.query(sql, function (err, result) {
      // message = "Successfully! Your account has been created.";
      res.render('index.ejs');
    });
  } else {
    res.render('signup.ejs');
  }
};

// -----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
  let message = '';

  if (req.method == 'POST') {
    const post = req.body;
    const name = post.user_name;
    const pass = post.password;

    const sql =
      "SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='" +
      name +
      "' and password = '" +
      pass +
      "';";
    db.query(sql, function (err, results) {
      if (results.length) {
        console.log('results');
        printObject(results);
        req.session.userId = results[0].id;
        req.session.user = results[0];
        console.log(results[0].id);
        res.redirect('/home/dashboard');
      } else {
        console.log('Wrong credentials');
        message = 'Wrong Credentials.';
        res.render('index.ejs', { message });
      }
    });
  } else {
    res.render('index.ejs', { message });
  }
};
// -----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {
  const user = req.session.user;
  const userId = req.session.userId;
  console.log('dashboard session');
  printObject(req.session);
  console.log('ddd=' + userId);
  if (userId == null) {
    res.redirect('/login');
    return;
  }

  const sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

  db.query(sql, function (err, results) {
    res.render('dashboard.ejs', { user });
  });
};
// ------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res, next) {
  req.session.user = null;
  req.session.userId = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect('/login');
    });
  });
};
// --------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {
  const userId = req.session.userId;
  if (userId == null) {
    res.redirect('/login');
    return;
  }

  const sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, result) {
    res.render('profile.ejs', { data: result });
  });
};
// ---------------------------------edit users details after login----------------------------------
exports.editprofile = function (req, res) {
  const userId = req.session.userId;
  if (userId == null) {
    res.redirect('/login');
    return;
  }

  const sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, results) {
    res.render('edit_profile.ejs', { data: results });
  });
};

// exports.signup = function (req, res) {
//   message = "";
//   if (req.method === "POST") {
//     var post = req.body;
//     var name = post.user_name;
//     var pass = post.password;
//     var fname = post.first_name;
//     var lname = post.last_name;
//     var mob = post.mob_no;

//     var sql =
//       "INSERT INTO `users` (`first_name`, `last_name`, `password`, `user_name`, `mob_no`) VALUES (" +
//       fname +
//       "," +
//       lname +
//       "," +
//       pass +
//       "," +
//       name +
//       "," +
//       mob +
//       ");";

//     var query = db.query(sql, function (err, result) {
//       message = "Your account has been created successfully.";
//       res.render("signup.ejs", { message });
//     });
//   } else {
//     res.render("signup");
//   }
// };

// // login page call

// exports.login = function (req, res) {
//   var message = "";
//   var sess = req.session;

//   if (req.method === "POST") {
//     var post = req.body;
//     var name = post.user_name;
//     var pass = post.password;

//     var sql =
//       'SELECT id, first_name, last_name, user_name FROM users WHERE user_name="' +
//       name +
//       '" AND password="' +
//       pass +
//       '";';
//     db.query(sql, function (err, results) {
//       if (results.length) {
//         req.session.userId = results[0].id;
//         req.session.user = results[0];
//         console.log(results[0].id);
//         res.redirect("/home/dashboard");
//       } else {
//         message = "Wrong credentials";
//         res.render("index.ejs", { message });
//       }
//     });
//   } else {
//     res.render("index.ejs", { message });
//   }
// };

// // dashboard

// exports.dashboard = function (req, res, next) {
//   var user = req.session.user;
//   var userId = req.session.userId;
//   console.log("ddd=" + userId);

//   if (userId == null) {
//     res.redirect("/login");
//     return;
//   }

//   var sql = 'SELECT * FROM users WHERE id="' + userId + '";';

//   db.query(sql, function (err, results) {
//     res.render("dashboard.ejs", { user });
//   });
// };

// //logout

// exports.logout = function (req, res) {
//   req.session.destroy(function (err) {
//     res.redirect("/login");
//   });
// };

// // User details after login

// exports.profile = function (req, res) {
//   var userId = req.session.userId;
//   if (userId == null) {
//     res.render("/login");
//     return;
//   }

//   var sql = 'SELECT * FROM users WHERE id="' + userId + '";';
//   db.query(sql, function (err, results) {
//     res.render("/profile.ejs", { data: results });
//   });
// };

// exports.editprofile = function (req, res) {
//   var userId = req.session.userId;
//   if (userId == null) {
//     res.redirect("/login");
//     return;
//   }

//   var sql = 'SELECT * FROM users WHERE id="' + userId + '";';
//   db.query(sql, function (err, results) {
//     res.render("edit_profile.ejs", { data: results });
//   });
// };
