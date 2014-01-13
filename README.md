# Divergence Meter
Create [divergence meters](http://steins-gate.wikia.com/wiki/Divergence_Meter) in your web page just like in Steins;Gate!

## How to install
Clone this repo or do `bower install divergence-meter`

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
<script>
  var meter = new DivMeter({
    'height': '100px',
    'element': document.getElementById()
  });

  meter.time()
</script>
```

## Configuration
You can initiate *Divmeter* with an object with these properties:

### Properties
#### *(required)* `element`

**Accepted values:**

* A CSS selector string (`querySelectorAll` is used)
* A `NodeList` or `HTMLCollection`
* An `HTMLElement` or `Element` or `Node`

---
#### *(optional)* `time`

**Default value:** `local`

**Accepted values:** `local` or anything that is parsable by `Date.parse` function

---
#### *(optional)* `height`
This property sets height of each image.

**Default value:** `90px`

**Accepted values:** height CSS

---
#### *(optional)* `width`
This property sets width of each image.

**Accepted values:** width CSS

---
#### *(optional)* `prefix`
Prefix for image URLs.

**Accepted values:** A string

---
#### *(optional)* `suffix`
Suffix for image URLs.

**Accepted values:** A string

### Change default values
Use `window.DivmeterInitConfig` to set the initial values for `window.Divmeter.defaultConfig`. `DivmeterInitConfig` is
only processed once so if you want to change default values after script initialization,
use `window.Divmeter.defaultConfig` instead.

Put **DivmeterInitConfig** definition before the script itself:

```html
<script>DivmeterInitConfig = {height: '180px', 'prefix': './img/', 'suffix': '.jpg', time: 'local'};</script>
<script src="divmeter.js"></script>
```

### Start/stop clock on an existing meter
When you create a new divergence meter, it will assign a new ID to its parent element (`div` or `divmeter`):

The initialized meters look like this:
```html
<div id="divmeter-1389544582397" class="divmeter divmeter-complete" data-time="local">...</div>
```

You can access a divergence meter's methods using `Divmeter.getDivmeterById` method:
```js
var el = document.getElementById('divmeter-1389544582397');
var divmeter = Divmeter.getDivmeterById(el);
```

## To do:

* Moment.js support
* Write tests