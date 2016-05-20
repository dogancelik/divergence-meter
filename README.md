![divmeter](https://cloud.githubusercontent.com/assets/486818/12384921/d56cbfda-bdbf-11e5-9bb7-debf9f0f5526.png)

# Divergence Meter
Create [divergence meters](http://steins-gate.wikia.com/wiki/Divergence_Meter) in your web page just like in Steins;Gate!

**Update (2016-01):** New version adds new properties: `type`, `clock`, `interval`.
Divmeter now defaults to *type* `live`, so if you are using a "static" Divmeter, you need to set `type: 'static'` in your Divmeter settings (or `data-type="static"` in HTML).

## How to install

* [Download the latest ZIP file](archive/master.zip)
* `bower install divergence-meter`
* Clone the repo

## How to use

Add `divmeter.js` to your page.

```html
<script src="divmeter.js"></script>
```

### 1. Use a &lt;divmeter&gt; element or a &lt;div&gt; element

**Using `<divmeter>`:**

```html
<divmeter data-time="2014-01-11T01:12:59.371Z">
```

**Using `<div>`**:

```html
<div class="divmeter" data-time="local">
```

If you change `data-time` to `local`, your divergence meter will automatically update itself to the local time.

**Use the properties below to customize your divergence meter!**

### 2. Add with JavaScript

```js
var meter = new DivMeter({
  height: '100px',
  element: document.getElementById()
});

meter.time('2014-01-11T01:12:59.371Z');
```

## Configuration

You can initiate *Divmeter* with an object with these properties:

### Properties

#### *(required)* `element`

**Accepted values:**

* A CSS selector string (`querySelectorAll` is used)
* A `NodeList` or `HTMLCollection`
* An `HTMLElement` or `Element` or `Node`

<hr>

#### *(optional)* `type`

**Default value:** `live`  
**Accepted values:**

* `live`
* *null*, `static`

<hr>

#### *(optional)* `time`

**Default value:** `local`  
**Accepted values:** `local` or anything that is parsable by `Date.parse` function

<hr>

#### *(optional)* `height`

This property sets height of each image.

**Default value:** `90px`  
**Accepted values:** CSS height, `fluid`

<hr>

#### *(optional)* `width`

This property sets width of each image.

**Accepted values:** CSS width, `fluid`

<hr>

#### *(optional)* `prefix`

Prefix for image URLs.

**Accepted values:** A string

<hr>

#### *(optional)* `suffix`

Suffix for image URLs.

**Accepted values:** A string

<hr>

#### *(optional)* `clock`

This function is called every time clock ticks,
the return value of this function will set clock date to the returned Date.

**Default value:** A function that adds 1 second to the defined date.

<hr>

#### *(optional)* `interval`

Clock tick interval in milliseconds

**Default value:** `1000`  
**Accepted values:** Any integer

### Change default values

Use `window.DivmeterInitConfig` to set the initial values for `window.Divmeter.defaultConfig`. `DivmeterInitConfig` is
only processed once so if you want to change default values after script initialization,
use `window.Divmeter.defaultConfig` instead.

Put **DivmeterInitConfig** definition before the script itself:

```html
<script type="text/javascript">
  var DivmeterInitConfig = {
    height: '180px',
    prefix: './img/',
    suffix: '.jpg',
    time: 'local'
  };
</script>
<script type="text/javascript" src="divmeter.js"></script>
```

#### Disable auto-init on page load

By default, the library will automatically create Divmeters for you but if you don't want that,
you can disable it with:

```js
window.DivmeterAutoInit = false;
```

### Start/stop clock on an existing meter
When you create a new divergence meter, it will assign a new ID to its parent element (`div` or `divmeter`):

The initialized meters look like this:

```html
<div id="divmeter-1389544582397" class="divmeter divmeter-complete" data-time="local">...</div>
```

You can access a divergence meter's methods using `Divmeter.getById` method:

```js
var el = document.getElementById('divmeter-1389544582397');
var divmeter = Divmeter.getById(el);

divmeter.time('local');
divmeter.start(); // Start the clock if it's "local"
divmeter.stop();
```

## To do:

* Moment.js support
* Write tests
* Responsive container
