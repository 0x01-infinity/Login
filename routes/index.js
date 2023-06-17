exports.index = function (req, res) {
  let message;
  res.render('index', { message });
  res.end();
};
