import L from 'leaflet'

const FullScreen = {
  options: {
    forceSeparateButton: false,
    forcePseudoFullscreen: false,
    fullscreenElement: false
  },

  toggleFullScreen: function (element) {
    if (typeof element !== 'undefined') {
      element._exitFired = false;
      if (element._isFullscreen) {
        if (fullScreenApi.supportsFullScreen && !this.options.forcePseudoFullscreen) {
          fullScreenApi.cancelFullScreen();
        } else {
          L.DomUtil.removeClass(this.options.fullscreenElement ? this.options.fullscreenElement : element, 'leaflet-pseudo-fullscreen');
        }
        element._exitFired = true;
        element._isFullscreen = false;
      }
      else {
        if (fullScreenApi.supportsFullScreen && !this.options.forcePseudoFullscreen) {
          fullScreenApi.requestFullScreen(this.options.fullscreenElement ? this.options.fullscreenElement : element);
        } else {
          L.DomUtil.addClass(this.options.fullscreenElement ? this.options.fullscreenElement : element, 'leaflet-pseudo-fullscreen');
        }
        element._isFullscreen = true;
      }
    }
  },
};

var fullScreenApi = {
    supportsFullScreen: false,
    isFullScreen: function () { return false; },
    requestFullScreen: function () {},
    cancelFullScreen: function () {},
    fullScreenEventName: '',
    prefix: ''
  },
  browserPrefixes = 'webkit moz o ms khtml'.split(' ');

// check for native support
if (typeof document.exitFullscreen !== 'undefined') {
  fullScreenApi.supportsFullScreen = true;
} else {
  // check for fullscreen support by vendor prefix
  for (var i = 0, il = browserPrefixes.length; i < il; i++) {
    fullScreenApi.prefix = browserPrefixes[i];
    if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] !== 'undefined') {
      fullScreenApi.supportsFullScreen = true;
      break;
    }
  }
  if (typeof document['msExitFullscreen'] !== 'undefined') {
    fullScreenApi.prefix = 'ms';
    fullScreenApi.supportsFullScreen = true;
  }
}

// update methods to do something useful
if (fullScreenApi.supportsFullScreen) {
  if (fullScreenApi.prefix === 'ms') {
    fullScreenApi.fullScreenEventName = 'MSFullscreenChange';
  } else {
    fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
  }
  fullScreenApi.isFullScreen = function () {
    switch (this.prefix) {
      case '':
        return document.fullscreen;
      case 'webkit':
        return document.webkitIsFullScreen;
      case 'ms':
        return document.msFullscreenElement;
      default:
        return document[this.prefix + 'FullScreen'];
    }
  };
  fullScreenApi.requestFullScreen = function (el) {
    switch (this.prefix) {
      case '':
        return el.requestFullscreen();
      case 'ms':
        return el.msRequestFullscreen();
      default:
        return el[this.prefix + 'RequestFullScreen']();
    }
  };
  fullScreenApi.cancelFullScreen = function () {
    switch (this.prefix) {
      case '':
        return document.exitFullscreen();
      case 'ms':
        return document.msExitFullscreen();
      default:
        return document[this.prefix + 'CancelFullScreen']();
    }
  };
}

// jQuery plugin
if (typeof jQuery !== 'undefined') {
  jQuery.fn.requestFullScreen = function () {
    return this.each(function () {
      var el = jQuery(this);
      if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.requestFullScreen(el);
      }
    });
  };
}


export default {
  FullScreen
}
