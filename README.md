# JBlocks

[![NPM version](https://badge.fury.io/js/jblocks.png)](http://badge.fury.io/js/jblocks)
[![Build Status](https://travis-ci.org/vitkarpov/jblocks.png?branch=master)](https://travis-ci.org/vitkarpov/jblocks)

Небольшой jQuery-плагин (~ 100 строк) для организации компонентов (виджетов) на странице

Строится на трех основных принципах:

- опиши поведение своих компонент в декларации
- разметь в html компоненты с помощью специальных атрибутов
- общайся с компонентами через АПИ

## Связывание компонента с его html-разметкой

Корневую ноду компонента размечаем с помощью специальных data-атрибутов:

- `data-b` — айдишник блока (имя)
- `data-p` — параметры блока

```html
<!--
    Пусть у нас есть счетчик: кнопки +/- при нажатии на которые
    меняется значение счетчика — чиселка рядом с кнопками
-->
<div class="foo" data-b="сounter" data-p='{ "step": 2 }'>
    <button class="js-inc">+</button>
    <button class="js-dec">-</button>
    <span class="js-info">0</span>
</div>
```

## Декларация поведения компонента

В javascript нужно описать поведение (декларация компонента):

```js
$.jblocks({

    name: 'counter',

    events: {
        'b-inited': 'oninit',
        'click .js-inc': 'onClickPlus',
        'click .js-dec': 'onClickMinus'
    },

    methods: {
        oninit: function() {
            this.$info = this.$node.find('.js-info');
            this.count = 0;
        },

        /**
         * Обработчик клика на плюс
         */
        onClickPlus: function() {
            this.inc();
            this.update();
        },

        /**
         * Обработчик клика на минус
         */
        onClickMinus: function() {
            this.dec();
            this.update();
        },

        /**
         * Увеличить счетчик
         */
        inc: function() {
            this.count += this.params.step;
        },

        /**
         * Уменьшить счетчик
         */
        dec: function() {
            this.count -= this.params.step;
        },

        /**
         * Нарисует новое значение
         */
        update: function() {
            this.$info.text(this.count);
        }
    }
});

// Инициализируем все блоки в документе
$(document).jblocks('init');
```

## name

`counter` — имя компонента

## events

`click .foo` — какое событие слушаем и необязательно уточняющий селектор (события навешиваются через делегирование на корневую ноду)

Значением может быть строчка — имя функции из секции `methods` в декларации или анонимная функция. Функция будет выполнена в контексте конкретного экземпляра компонента.

Стандартные события компонентов:

- `b-inited` выполнятся после инициализации
- `b-destroyed` выполнятся после уничтожения

## methods

Здесь указываются методы блока, по сути, его прототип. Выполняются в контексте конкретного экземпляра компонента.

## Работа с компонентами через АПИ

Есть возможность получать экземпляры компонентов и вызывать их методы:

```js
var blocks = $('.bar').jblocks('get');

blocks.each(function() {
    // this - экземпляр блока, увеличит счетчик
    this.inc();
})
```

Так же можно создавать и удалять компоненты, которые находятся внутри определенной части страницы, например, во всем документе при инициализации приложения:

```js
// Инициализируем все блоки в документе
$(document).jblocks('init');
```

Аналогично для уничтожения:

```js
$(document).jblocks('destroy');
```
