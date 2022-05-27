### we-signal

---

这是一个普通的事件信号发射器...

##### 安装

```shell
yarn add we-signal
//or
npm install we-signal --save
```

##### 使用

```js
// simple use
import { Emitter } from 'we-signal';
const emitter = new Emitter();
const handler = (signal) => {
  console.log(`Said ${signal.data.msg}`);
  //Said Hi!
};
/** add `SaySomething` listener */
emitter.on('SaySomething', handler);
/** emit signal */
emitter.emit('SaySomething', { msg: 'Hi!' });
/** remove listener */
emitter.off('SaySomething', handler);
```

```js
// handler's context
import { Emitter } from 'we-signal';
const emitter = new Emitter();
const ctx = { id: 5 };
function handler(signal) {
  console.log(`${signal.data} ${this.id}`);
  // ID is 5
}
emitter.on('SignalType', handler, ctx);
emitter.emit('SignalType', 'ID is');
```

```js
// receiving times
import { Emitter } from 'we-signal';
const emitter = new Emitter();
emitter.on('SignalType', (signal) => {
  console.log('Received=>', signal.data);
  // Received=>1
  // Received=>2
  // Received=>3
});
emitter.on(
  'SignalType',
  (signal) => {
    console.log('Received=>', signal.data);
    // Received=>1
    // Received=>2
  },
  null,
  2
);
emitter.once('SignalType', (signal) => {
  console.log('Received=>', signal.data);
  // Received=>1
});
emitter.emit('SignalType', 1);
emitter.emit('SignalType', 2);
emitter.emit('SignalType', 3);
```

```js
// level event
import { Emitter, Signal } from 'we-signal';
const parent = new Emitter();
const current = new Emitter();
const child_1 = new Emitter();
const child_2 = new Emitter();
/** set parent */
current.parent = parent;
/** add children */
current.addChild(child_1, child_2);
/** add listener */
parent.on('SignalType', (signal) => {
  console.log(signal.data);
  // parent_exact
  // parent_downward
});
const handler = (signal) => {
  console.log(signal.data);
  // parent_exact
  // parent_downward
  // current_upward
  // current_whole
  // child_1_upward
};
parent.on('SignalType', handler, null, -1, Signal.Features.upward);
current.on('SignalType', (signal) => {
  console.log(signal.data);
  // current_exact
  // current_downward
  // current_upward
  // current_whole
});
current.on(
  'SignalType',
  (signal) => {
    console.log(signal.data);
    // current_exact
    // current_downward
    // current_upward
    // current_whole
    // child_1_upward
  },
  null,
  -1,
  Signal.Features.upward
);
current.on(
  'SignalType',
  (signal) => {
    console.log(signal.data);
    // parent_downward
    // current_exact
    // current_downward
    // current_upward
    // current_whole
  },
  null,
  -1,
  Signal.Features.downward
);
current.on(
  'SignalType',
  (signal) => {
    console.log(signal.data);
    // parent_downward
    // current_exact
    // current_downward
    // current_upward
    // current_whole
    // child_1_upward
  },
  null,
  -1,
  Signal.Features.whole
);
child_1.on('SignalType', (signal) => {
  console.log(signal.data);
  // child_1_exact
  // child_1_upward
});
child_1.on(
  'SignalType',
  (signal) => {
    console.log(signal.data);
    // parent_downward
    // current_downward
    // current_whole
    // child_1_exact
    // child_1_upward
  },
  null,
  -1,
  Signal.Features.downward
);
child_1.on(
  'SignalType',
  (signal) => {
    console.log(signal.data);
    // parent_downward
    // current_downward
    // current_whole
    // child_1_exact
    // child_1_upward
  },
  null,
  -1,
  Signal.Features.whole
);
parent.emit('SignalType', 'parent_exact');
parent.emit('SignalType', 'parent_downward', Signal.Features.downward);
current.emit('SignalType', 'current_exact');
current.emit('SignalType', 'current_downward', Signal.Features.downward);
current.emit('SignalType', 'current_upward', Signal.Features.upward);
current.emit('SignalType', 'current_whole', Signal.Features.whole);
child_1.emit('SignalType', 'child_1_exact');
child_1.emit('SignalType', 'child_1_upward', Signal.Features.upward);
/** remove current listener */
parent.off('SignalType', handler, null, Signal.Features.upward);
/** remove `SignalType` listener */
current.off('SignalType');
/** remove all listener */
child_1.off();
```
