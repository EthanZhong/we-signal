import { describe, jest, test, expect } from '@jest/globals';
import { Listener, ListenerHandler } from '../src/Listener';
import { Emitter, Signal } from '../src/index';

describe('test Listener', () => {
  test('use Constructor', () => {
    expect(
      () =>
        new Listener(
          Symbol() as any,
          'Type',
          jest.fn<ListenerHandler>(),
          new Emitter()
        )
    ).toThrow('Please use [Listener.create]');
  });
  test('use Listener.create', () => {
    const listener = Listener.create(
      'Type',
      jest.fn<ListenerHandler>(),
      new Emitter(),
      null
    );
    expect(listener.count).toBe(-1);
    expect(listener.active).toBeTruthy();
  });
  test('handle signal', () => {
    const msg = 'Hi Test';
    const emitter = new Emitter();
    const ctx = { name: 'Tom' };
    const handler = jest.fn<ListenerHandler<{ msg: string }>>();
    handler.mockImplementation((signal) => {
      return signal.data.msg;
    });
    const listener = Listener.create('Test', handler, emitter, ctx);
    listener.handle(Signal.create('Test', { msg }, emitter));
    expect(handler.mock.contexts[0]).toBe(ctx);
    expect(handler.mock.results[0].value).toBe(msg);
  });
});
