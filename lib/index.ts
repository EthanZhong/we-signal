import Listener from './Listener';
import Signal from './Signal';
import Emitter from './Emitter';

const signal = new Signal('loaded', [1, 2, 3, false], '');
const emitter = new Emitter();

export { Listener, signal, emitter };
