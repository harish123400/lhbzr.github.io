var int = require('./lib/int');
var replace = require('./lib/replace');

module.exports = (function() {
  // Menu.
  var link = document.querySelectorAll('.menu-link'),
      linkOverInterval,
      linkOutInterval;


  for (var i = 0; i < link.length; i++) {
    var linkCurrent = link[i],
        linkCurrentParent = linkCurrent.parentNode;


    // Drag.
    Draggable.create(linkCurrentParent, {
      bounds: document.body,
      dragClickables: true,
      edgeResistance: 1,
      type: 'x, y',
      onDrag: function(e) {
        TweenLite.to(this.target, .1, {
          x: this.x,
          y: this.y
        });
      }
    });


    // Hover.
    linkCurrent.addEventListener('mouseover', function() {
      var link = this;

      linkOverInterval = setInterval(function() {
        var linkValue = link.innerHTML.trim();

        link.innerHTML = replace(
          linkValue,
          int(0, linkValue.length - 1),
          String.fromCharCode(int(65, 122))
        );
      }, 1);

      TweenLite.to(link, .4, {
        background: 'rgba(255, 255, 255, 1)',
        color: 'rgb(0, 0, 0)'
      });
    });

    linkCurrent.addEventListener('mouseout', function() {
      var link = this,
          linkText = link.getAttribute('data-text');

      clearInterval(linkOverInterval);

      var i = 0;

      var linkOutInterval = setInterval(function() {
        if (i < linkText.length) {
          var linKValue = link.innerHTML.trim();

          link.innerHTML = replace(
            linKValue,
            i,
            linkText[i]
          );
        } else {
          clearInterval(linkOutInterval);
        }

        i++;
      }, 1);

      TweenLite.to(link, .4, {
        background: 'rgba(255, 255, 255, 0)',
        color: 'rgb(255, 255, 255)'
      });
    });


    // Position.
    linkCurrentParent.style.left = int(0, window.innerWidth - linkCurrent.offsetWidth) + 'px';
    linkCurrentParent.style.top = int(0, window.innerHeight - linkCurrent.offsetHeight) + 'px';
  }
})();
