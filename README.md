# JBlocks

[![NPM version](https://badge.fury.io/js/jblocks.png)](http://badge.fury.io/js/jblocks)
[![Build Status](https://travis-ci.org/vitkarpov/jblocks.png?branch=master)](https://travis-ci.org/vitkarpov/jblocks)

JBlocks is a nanoframework which helps to create inteface components in functional programming style flavor.

It's build on the following simple rules:

- declare your components
- set data-component and data-params for corresponding nodes in html
- interact between components using its API and events

Let we have a simple component: counter with 2 buttons to increase and decrease its value. It could be a lot of independent counters on a page with different initials values.

Using JBlocks we have to declare a component in javascript and mark some nodes in html using special data-attributes.

## How to declare a component

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

## How to mark components in html

To make some node as a root node for the component we should set special `data` attributes:

- `data-component` — name of the given component (`counter` in this case)
- `data-props` — initial properties (`{ "initialValue": 10 }` in this case)

```html
<div class="js-counter" data-component="сounter" data-props='{ "initialValue": 2 }'>
    <button class="js-inc">+</button>
    <button class="js-dec">-</button>
</div>
```

## How to create an instance and interact with it

After describing all the components in declarative way it's time to create instances and interact with them using API:

```js
// somewhere in my program...

var counter = jBlocks.get(document.querySelector('.js-counter'));

counter.on('changed', function() {
    console.log('hello, world!');
});

// ... user clicks on inc button
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

## Events section

```js
events: {
    'click .js-inc': 'inc',
    'click .js-dec': 'dec'
}
```

If user clicks on nodes with `js-inc` or `js-dec` classes **only within root node of the component** `inc` or `dec` methods of corresponding instance will be called accordingly.
