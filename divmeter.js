(function (window, document) {

  'use strict';

  var ELEMENT_QUERY = 'divmeter:not(.divmeter-complete), div.divmeter:not(.divmeter-complete)';
  var DIVMETER_COMPLETE = 'divmeter-complete';
  var _divmeters = {};

  function registerStyle () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.divmeter { display: inline-block; }';
    document.head.appendChild(style);
  }

  function preloadImages (config) {
    for (var i = 0; i < 11; i++) {
      var img = document.createElement('img');
      if (i === 10) {
        continue;
      }
      img.src = config.prefix + i + config.suffix;
    }
  }

  function pad (number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

  function watchElements () {
    window.document.addEventListener('DOMContentLoaded', function () {
      var els = document.querySelectorAll(ELEMENT_QUERY);

      for (var i = 0; i < els.length; i++) {
        var config = {};

        config.element = els[i];
        if (els[i].dataset.prefix) {
          config.prefix = els[i].dataset.prefix;
        }
        if (els[i].dataset.suffix) {
          config.suffix = els[i].dataset.suffix;
        }
        if (els[i].dataset.width) {
          config.width = els[i].dataset.width;
        }
        if (els[i].dataset.height) {
          config.height = els[i].dataset.height;
        }
        if (els[i].dataset.time) {
          config.time = els[i].dataset.time;
        }

        new Divmeter(config);
      }

    }, false);

  }

  var Divmeter = function (config) {

    var _originalTime = null, // Used for tracking local time
        _time = null, // Used for actually tracking _date time
        _clockId = null,
        _clockFn = function () {
          if (_originalTime === 'local') {
            _time = new Date();
          }
          else {
            _time = new Date(_time.getTime() + 1000);
          }
          updateClock();
        };

    function setTime (time) {
      _originalTime = time;
      _time = time === "local" ? new Date() : new Date(Date.parse(time));
      return this;
    }

    function startTime () {
      if (_originalTime === "local") {
        updateClock();
        _clockId = setInterval(_clockFn, 1000);
      }
      else {
        updateClock();
      }
    }

    function updateClock () {
      var pa = _time.getHours() > 12;
      var hr = pad(_time.getHours() % 12, 2);
      var min = pad(_time.getMinutes(), 2);
      var sec = pad(_time.getSeconds(), 2);
      imgs[0].src = config.prefix + (pa ? '1' : '0') + config.suffix;
      imgs[2].src = config.prefix + hr[0] + config.suffix;
      imgs[3].src = config.prefix + hr[1] + config.suffix;
      imgs[4].src = config.prefix + min[0] + config.suffix;
      imgs[5].src = config.prefix + min[1] + config.suffix;
      imgs[6].src = config.prefix + sec[0] + config.suffix;
      imgs[7].src = config.prefix + sec[1] + config.suffix;
    }

    if (typeof config === 'undefined') {
      // Use the default config
      config = Divmeter.defaultConfig;
    } else if (typeof config === 'object') {
      // Override default config
      var newConfig = {};
      for (var prop in Divmeter.defaultConfig) {
        newConfig[prop] = Divmeter.defaultConfig[prop];
      }
      for (var prop in config) {
        newConfig[prop] = config[prop];
      }
      config = newConfig;
    } else {
      // Only accept object for init
      throw new Error('Divmeter: You may only initialize DivMeter with an object.');
    }

    var isElementSingle = null,
        element = null;
    if (typeof config.element === 'string') {
      element = document.querySelectorAll(config.element);
      isElementSingle = element.length === 1;
    } else if (config.element instanceof HTMLElement || config.element instanceof Element ||
      config.element instanceof Node) {
      element = config.element;
      isElementSingle = true;
    } else if (config.element instanceof HTMLCollection || config.element instanceof NodeList) {
      element = config.element;
      isElementSingle = false;
    } else {
      window.console.error("Divmeter: What type of element is this? Report if you see this error!")
    }

    if (!isElementSingle) {
      for (var i = 0; i < element.length; i++) {
        var newConfig = config;
        newConfig.element = element[i];
        new Divmeter(newConfig);
      }
      return;
    } else {
      // Stop if element is already initialized
      if (element.classList.contains(DIVMETER_COMPLETE)) {
        return;
      }

      // Set a unique ID
      element.id = 'divmeter-' + new Date().getTime();

      // Add a class
      element.classList.add('divmeter');

      preloadImages(config);

      // Initialize images (0.000000 state)
      var imgs = [];
      for (var i = 1; i <= 8; i++) {
        var img = document.createElement('img');
        img.src = config.prefix + (i !== 2 ? '0' : '11') + config.suffix;
        if (config.width) {
          img.style.width = config.width;
        }
        if (config.height) {
          img.style.height = config.height;
        }
        element.appendChild(img);
        imgs.push(img);
      }

      // Set time and start clock if local
      setTime(config.time);
      startTime();

      // Duplicate clocks in <body>:
      // <div id="dm">
      // <script>new Divmeter({ element: '#dm' })</script>
      // Creates a new clock, page loads and script finds div.divmeter elements and creates another clock inside new clock
      // This is done in order to avoid duplicates
      element.classList.add(DIVMETER_COMPLETE);

      var ret = {
        time: setTime,
        stop: function () {
          clearInterval(_clockId);
          _clockId = null;
          return this;
        },
        start: function () {
          this.stop();
          startTime();
          return this;
        }
      };

      // Add a reference to the global object
      _divmeters[element.id] = ret;

      return ret;
    }
  };

  Divmeter.getDivmeterById = function (id) {
    return _divmeters[id];
  };

  // Set the defaults
  Divmeter.defaultConfig = window.DivmeterInitConfig || {
    'element': ELEMENT_QUERY,
    'time': 'local',
    'prefix': './img/',
    'suffix': '.jpg',
    'height': '90px'
  };
  if (!Divmeter.defaultConfig.hasOwnProperty('time')) {
    window.console.warn('Divmeter.defaultConfig.time is empty! I will assume \u201Clocal\u201D.');
    Divmeter.defaultConfig.time = 'local';
  }
  if (!Divmeter.defaultConfig.hasOwnProperty('prefix')) {
    window.console.warn('Divmeter.defaultConfig.prefix is empty!');
  }
  if (!Divmeter.defaultConfig.hasOwnProperty('suffix')) {
    window.console.warn('Divmeter.defaultConfig.suffix is empty! I will assume \u201C.jpg\u201D');
    Divmeter.defaultConfig.suffix = '.jpg';
  }
  if (!Divmeter.defaultConfig.hasOwnProperty('height')) {
    window.console.warn('Divmeter.defaultConfig.height is empty!');
  }

  window.Divmeter = Divmeter;
  registerStyle();
  watchElements();
})(window, document);