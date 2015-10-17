module.exports = function(url, callback) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      callback(request);
    }
  };

  request.open('GET', url, true);

  request.send();
};
