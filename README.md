# jBlocks

[![NPM version](https://badge.fury.io/js/jblocks.png)](http://badge.fury.io/js/jblocks)
[![Build Status](https://travis-ci.org/vitkarpov/jblocks.png?branch=master)](https://travis-ci.org/vitkarpov/jblocks)

**[Full API Doc created from source](http://vitkarpov.com/jblocks)**

jBlocks helps to create interface components in a functional programming flavour.

It's build on the following simple rules:

- declare your components
- set special data-attributes in HTML to bind an instance of the component (will be created in the future) to the node
- interact with components using API, events and other components

## Give me an example

Let we have a simple component.

Counter with 2 buttons to increase and decrease its value. It could be a lot of independent counters on a page with different initials values.

At first we need to declare a component in JavaScript and then mark some nodes in HTML using special data-attributes.

## Declare a component in JavaScript

Declare a component:

```js
jBlocks.define('counter', {
    events: {
        'click .js-inc': 'inc',
        'click .js-dec': 'dec'
    },

    methods: {
        oninit: function() {
            this._currentValue = Number(this.params.initialValue);
        },
        ondestroy: function() {
            this._currentValue = null;
        },
        /**
         * Increases the counter, emits changed event
         */
        inc: function() {
            this._currentValue++;
            this.emit('changed', this._currentValue);
        },
        /**
         * Decreases the counter, emits changed event
         */
        dec: function() {
            this._currentValue--;
            this.emit('changed', this._currentValue);
        },
        /**
         * Returns the current value
         * @return {Number}
         */
        getCurrentValue: function() {
            return this._currentValue;
        }
    }
})
```

## Declare a component in HTML

To make some node as a root node of the component we should set special `data` attributes:

- `data-component` — name of the given component (`counter` in this case)
- `data-props` — initial properties (`{ "initialValue": 10 }` in this case)

```html
<div class="js-counter" data-component="сounter" data-props='{ "initialValue": 2 }'>
    <button class="js-inc">+</button>
    <button class="js-dec">-</button>
</div>
```

## Create instances and interact with them

After describing all components in declarative way it's time to create an instance and interact with it using API:

```js
// somewhere in my program...

var counter = jBlocks.get(document.querySelector('.js-counter'));

// use event to react on what happens during lifecycle
counter.on('changed', function() {
    console.log('hello, world!');
});

// ... when user clicks on inc button
// log => 'hello, world!'

// log => 3, cause the counter has been increased
counter.getCurrentValue();

// ... then I decided to decrease it using API
counter.dec();

// log => 2
counter.getCurrentValue();

// If I remove nodes from DOM instance should be destroyed
counter.destroy();
```

## How do I start?


Include the library:

```html
<script type="text/javascript" src="https://cdn.rawgit.com/vitkarpov/jblocks/master/src/jblocks.js"></script>
```

`jBlocks` namespace is now in global scope. If you need commonjs support, let me know.

You can use the **[full API Doc generated from source](http://vitkarpov.com/jblocks)**.

Also, feel free to drop me a line — [viktor.s.karpov@gmail.com](mailto:viktor.s.karpov@gmail.com)
