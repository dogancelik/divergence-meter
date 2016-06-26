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

  function createConfig (defaultConfig, userConfig, datasetConfig) {
    var newConfig = {};
    for (var key in defaultConfig) newConfig[key] = defaultConfig[key];
    for (var key in userConfig) newConfig[key] = userConfig[key];
    if (datasetConfig != null) for (var key in datasetConfig) newConfig[key] = datasetConfig[key];
    return newConfig;
  }

  function preloadImages (config) {
    for (var i = 0; i < 11; i++) {
      var img = document.createElement('img');
      if (i === 10) continue;
      img.src = config.prefix + i + config.suffix;
      img.onload = function () { img.remove(); };
    }
  }

  function appendImages (element, config) {
    var imgs = [];
    for (var i = 1; i <= 8; i++) {
      var img = document.createElement('img');
      img.src = config.prefix + (i !== 2 ? '0' : '11') + config.suffix;
      if (config.width) img.style.width = config.width;
      if (config.height) img.style.height = config.height;
      if (config.width === 'fluid' || config.height === 'fluid') {
        img.style.width = '12.5%';
        img.style.height = 'auto';
      }
      element.appendChild(img);
      imgs.push(img);
    }
    return imgs;
  }

  function pad (number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

  function createOnLoad () {
    window.document.addEventListener('DOMContentLoaded', function () {
      var els = document.querySelectorAll(ELEMENT_QUERY);
      for (var i = 0; i < els.length; i++) {
        var config = createConfig(Divmeter.defaultConfig, { element: els[i] }, els[i].dataset);
        new Divmeter(config);
      }
    }, false);
  }

  var Divmeter = function (config) {

    var _originalTime = null; // Used for tracking local time
    var _time = null; // Used for actually tracking _date time

    // Clock
    var _clockId = null;
    var _clockInner = function () {
      _time = _originalTime === 'local' ? new Date() : _clockOuter(_time, _originalTime);
      updateClock();
    };
    var _clockOuter = config.clock != null ? config.clock : function (time, origTime) { return new Date(time.getTime() + 1000); };
    var _clockInterval = config.interval != null ? config.interval : 1000;

    function setTime (time) {
      _originalTime = time;
      _time = time === 'local' ? new Date() : new Date(Date.parse(time));
      return this;
    }

    function startTime () {
      if (config.type === 'live') {
        _clockId = setInterval(_clockInner, _clockInterval);
      }
      updateClock();
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

    // Combine defaultConfig + config
    if (typeof config === 'undefined') {
      config = Divmeter.defaultConfig;
    } else if (typeof config === 'object') {
      var newConfig = {};
      for (var prop in Divmeter.defaultConfig) newConfig[prop] = Divmeter.defaultConfig[prop];
      for (var prop in config) newConfig[prop] = config[prop];
      config = newConfig;
    } else {
      throw new Error('Divmeter: You may only initialize Divmeter with an object.');
    }

    // We check if variable contains more than one element
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
      if (element.classList.contains(DIVMETER_COMPLETE)) return; // Stop if element is already initialized

      element.id = 'divmeter-' + Date.now(); // Unique ID is required for finding Divmeters later
      element.classList.add('divmeter');
      preloadImages(config);
      var imgs = appendImages(element, config); // Initialize images (0.000000 state)
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

      _divmeters[element.id] = ret; // Add a reference for getDivmeterById
      return ret;
    }
  };

  Divmeter.getDivmeterById = function (id) { return _divmeters[id]; };
  Divmeter.getById = Divmeter.getDivmeterById;


  Divmeter.createOnLoad = typeof window.DivmeterAutoInit !== 'undefined' ? window.DivmeterAutoInit : true;
  Divmeter.defaultConfig = window.DivmeterInitConfig || {
    element: ELEMENT_QUERY,
    time: 'local',
    prefix: './img/',
    suffix: '.jpg',
    height: '90px',
    clock: null,
    interval: 1000,
    type: 'live'
  };

  if (!Divmeter.defaultConfig.hasOwnProperty('type')) {
    window.console.warn('Divmeter.defaultConfig.type is empty! I will assume \u201Clive\u201D');
    Divmeter.defaultConfig.type = 'live';
  }
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
  if (!Divmeter.defaultConfig.hasOwnProperty('interval')) {
    window.console.warn('Divmeter.defaultConfig.interval is empty! I will assume \u201C1000 ms\u201D');
    Divmeter.defaultConfig.interval = 1000;
  }

  window.Divmeter = Divmeter;
  if (Divmeter.createOnLoad) createOnLoad();
  registerStyle();
})(window, document);
