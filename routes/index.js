
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {'function': 'welcome', title: 'Express' });
};