<a name="jBlocks"></a>

## jBlocks : <code>object</code>
Methods to define components
using declaration and create new instances.
Also helps to find and destroy components.

**Kind**: global namespace  

* [jBlocks](#jBlocks) : <code>object</code>
    * [.Component](#jBlocks.Component)
        * [new Component(node, name, props)](#new_jBlocks.Component_new)
        * _instance_
            * [.name](#jBlocks.Component+name) : <code>String</code>
            * [.node](#jBlocks.Component+node) : <code>HTMLElement</code>
            * [.props](#jBlocks.Component+props) : <code>Object</code>
        * _static_
            * [.on(event, callback)](#jBlocks.Component.on) ⇒ [<code>Component</code>](#jBlocks.Component)
            * [.off(event, callback)](#jBlocks.Component.off) ⇒ [<code>Component</code>](#jBlocks.Component)
            * [.emit(event, data)](#jBlocks.Component.emit) ⇒ [<code>Component</code>](#jBlocks.Component)
            * [.once(event, callback)](#jBlocks.Component.once) ⇒ [<code>Component</code>](#jBlocks.Component)
            * [.destroy()](#jBlocks.Component.destroy) ⇒ [<code>Component</code>](#jBlocks.Component)
    * [.destroy(node)](#jBlocks.destroy) ⇒ [<code>jBlocks</code>](#jBlocks)
    * [.forget(name)](#jBlocks.forget) ⇒ [<code>jBlocks</code>](#jBlocks)
    * [.get(node)](#jBlocks.get) ⇒ [<code>Component</code>](#jBlocks.Component)

<a name="jBlocks.Component"></a>

### jBlocks.Component
**Kind**: static class of [<code>jBlocks</code>](#jBlocks)  

* [.Component](#jBlocks.Component)
    * [new Component(node, name, props)](#new_jBlocks.Component_new)
    * _instance_
        * [.name](#jBlocks.Component+name) : <code>String</code>
        * [.node](#jBlocks.Component+node) : <code>HTMLElement</code>
        * [.props](#jBlocks.Component+props) : <code>Object</code>
    * _static_
        * [.on(event, callback)](#jBlocks.Component.on) ⇒ [<code>Component</code>](#jBlocks.Component)
        * [.off(event, callback)](#jBlocks.Component.off) ⇒ [<code>Component</code>](#jBlocks.Component)
        * [.emit(event, data)](#jBlocks.Component.emit) ⇒ [<code>Component</code>](#jBlocks.Component)
        * [.once(event, callback)](#jBlocks.Component.once) ⇒ [<code>Component</code>](#jBlocks.Component)
        * [.destroy()](#jBlocks.Component.destroy) ⇒ [<code>Component</code>](#jBlocks.Component)

<a name="new_jBlocks.Component_new"></a>

#### new Component(node, name, props)

| Param | Type |
| --- | --- |
| node | <code>HTMLElement</code> | 
| name | <code>String</code> | 
| props | <code>Object</code> | 

<a name="jBlocks.Component+name"></a>

#### component.name : <code>String</code>
Name of the components used in decl

**Kind**: instance property of [<code>Component</code>](#jBlocks.Component)  
<a name="jBlocks.Component+node"></a>

#### component.node : <code>HTMLElement</code>
Node which component is binded with

**Kind**: instance property of [<code>Component</code>](#jBlocks.Component)  
<a name="jBlocks.Component+props"></a>

#### component.props : <code>Object</code>
Props of the component gained from data-props

**Kind**: instance property of [<code>Component</code>](#jBlocks.Component)  
<a name="jBlocks.Component.on"></a>

#### Component.on(event, callback) ⇒ [<code>Component</code>](#jBlocks.Component)
Attach an event handler function for the given event

**Kind**: static method of [<code>Component</code>](#jBlocks.Component)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| callback | <code>function</code> | 

<a name="jBlocks.Component.off"></a>

#### Component.off(event, callback) ⇒ [<code>Component</code>](#jBlocks.Component)
Remove an event handler function for the given event

**Kind**: static method of [<code>Component</code>](#jBlocks.Component)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| callback | <code>function</code> | 

<a name="jBlocks.Component.emit"></a>

#### Component.emit(event, data) ⇒ [<code>Component</code>](#jBlocks.Component)
Execute all handlers attached for the given event

**Kind**: static method of [<code>Component</code>](#jBlocks.Component)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| data | <code>\*</code> | 

<a name="jBlocks.Component.once"></a>

#### Component.once(event, callback) ⇒ [<code>Component</code>](#jBlocks.Component)
Attach an event handler function for the given event
which will be called only once

**Kind**: static method of [<code>Component</code>](#jBlocks.Component)  

| Param | Type |
| --- | --- |
| event | <code>String</code> | 
| callback | <code>function</code> | 

<a name="jBlocks.Component.destroy"></a>

#### Component.destroy() ⇒ [<code>Component</code>](#jBlocks.Component)
Destroy the instance

**Kind**: static method of [<code>Component</code>](#jBlocks.Component)  
<a name="jBlocks.destroy"></a>

### jBlocks.destroy(node) ⇒ [<code>jBlocks</code>](#jBlocks)
Destroy instance binded to the node

**Kind**: static method of [<code>jBlocks</code>](#jBlocks)  

| Param | Type |
| --- | --- |
| node | <code>HTMLElement</code> | 

<a name="jBlocks.forget"></a>

### jBlocks.forget(name) ⇒ [<code>jBlocks</code>](#jBlocks)
Remove declaration from cache

**Kind**: static method of [<code>jBlocks</code>](#jBlocks)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of component |

<a name="jBlocks.get"></a>

### jBlocks.get(node) ⇒ [<code>Component</code>](#jBlocks.Component)
Create and return a new instance of component

**Kind**: static method of [<code>jBlocks</code>](#jBlocks)  
**Returns**: [<code>Component</code>](#jBlocks.Component) - a new instance  

| Param | Type |
| --- | --- |
| node | <code>HTMLElement</code> | 

