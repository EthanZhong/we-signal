### we-signal

---

这是一个普通的事件信号发射器...

##### 安装

```shell
yarn install we-signal
//or
npm install we-signal --save
```

##### 普通使用

```ts
import { Emitter } from 'we-signal';
const emitter = new Emitter();
emitter.on<{ msg: string }>('SaySomething', (signal) => {
  console.log(`Said ${signal.data.msg}`);
  // Said Hi!
});
emitter.emit('SaySomething', { msg: 'Hi!' });
```
