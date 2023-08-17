import { test, expect, jest } from '@jest/globals';
import { Emitter, Signal } from '../src/index';

test('eg1', () => {
  expect.assertions(2);
  const emitter = new Emitter();
  const handler = (signal: Signal<{ msg: string }>) => {
    expect(signal.data.msg).toBe('Hi!');
    console.log(`Said ${signal.data.msg}`);
    // Said Hi!
  };
  emitter.on('SaySomething', handler);
  emitter.emit('SaySomething', { msg: 'Hi!' });
  emitter.off('SaySomething', handler);
  emitter.emit('SaySomething', { msg: 'Hi!' });
  expect(emitter.totalListener).toBe(0);
});
test('eg2', () => {
  const emitter = new Emitter();
  const ctx = { id: 5 };
  const handler = jest.fn((signal: Signal<string>) => signal.data);
  emitter.on('SignalType', handler, ctx);
  emitter.emit('SignalType', 'ID is');
  expect(handler.mock.contexts[0]).toBe(ctx);
  expect(
    handler.mock.results[0].value + ' ' + (handler.mock.contexts[0] as any).id
  ).toBe('ID is 5');
});
test('eg3', () => {
  const emitter = new Emitter();
  const handler1 = jest.fn();
  const handler2 = jest.fn();
  const handler3 = jest.fn();
  emitter.on('SignalType', handler1);
  emitter.on('SignalType', handler2, null, 2);
  emitter.once('SignalType', handler3);
  emitter.emit('SignalType', 1);
  emitter.emit('SignalType', 2);
  emitter.emit('SignalType', 3);
  expect(handler1.mock.calls.length).toBe(3);
  expect(handler1.mock.calls.map((item) => (item[0] as any).data)).toEqual(
    expect.arrayContaining([1, 2, 3])
  );
  expect(handler2.mock.calls.length).toBe(2);
  expect(handler2.mock.calls.map((item) => (item[0] as any).data)).toEqual(
    expect.arrayContaining([1, 2])
  );
  expect(handler3.mock.calls.length).toBe(1);
  expect(handler3.mock.calls.map((item) => (item[0] as any).data)).toEqual(
    expect.arrayContaining([1])
  );
});
test('eg4', () => {
  const parentHandler1 = jest.fn((signal: Signal<string>) => signal.data);
  const parentHandler2 = jest.fn((signal: Signal<string>) => signal.data);
  const currentHandler1 = jest.fn((signal: Signal<string>) => signal.data);
  const currentHandler2 = jest.fn((signal: Signal<string>) => signal.data);
  const currentHandler3 = jest.fn((signal: Signal<string>) => signal.data);
  const currentHandler4 = jest.fn((signal: Signal<string>) => signal.data);
  const childHandler1 = jest.fn((signal: Signal<string>) => signal.data);
  const childHandler2 = jest.fn((signal: Signal<string>) => signal.data);
  const childHandler3 = jest.fn((signal: Signal<string>) => signal.data);
  const parent = new Emitter();
  const current = new Emitter();
  const child_1 = new Emitter();
  const child_2 = new Emitter();
  /** set parent */
  current.parent = parent;
  /** add children */
  current.addChild(child_1, child_2);

  parent.on('SignalType', parentHandler1);
  parent.on('SignalType', parentHandler2, null, -1, Signal.Features.upward);
  current.on('SignalType', currentHandler1);
  current.on('SignalType', currentHandler2, null, -1, Signal.Features.upward);
  current.on('SignalType', currentHandler3, null, -1, Signal.Features.downward);
  current.on('SignalType', currentHandler4, null, -1, Signal.Features.whole);
  child_1.on('SignalType', childHandler1);
  child_1.on('SignalType', childHandler2, null, -1, Signal.Features.downward);
  child_1.on('SignalType', childHandler3, null, -1, Signal.Features.whole);

  parent.emit('SignalType', 'parent_exact');
  parent.emit('SignalType', 'parent_exact');
  parent.emit('SignalType', 'parent_exact_1');
  parent.emit('SignalType', 'parent_downward', Signal.Features.downward);
  current.emit('SignalType', 'current_exact');
  current.emit('SignalType', 'current_downward', Signal.Features.downward);
  current.emit('SignalType', 'current_upward', Signal.Features.upward);
  current.emit('SignalType', 'current_whole', Signal.Features.whole);
  child_1.emit('SignalType', 'child_1_exact');
  child_1.emit('SignalType', 'child_1_upward', Signal.Features.upward);

  expect(parentHandler1.mock.results.length).toBe(4);
  expect(parentHandler1.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'parent_exact',
      'parent_exact_1',
      'parent_downward',
    ])
  );
  expect(parentHandler2.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'parent_exact',
      'parent_downward',
      'current_upward',
      'current_whole',
      'child_1_upward',
    ])
  );
  expect(currentHandler1.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'current_exact',
      'current_downward',
      'current_upward',
      'current_whole',
    ])
  );
  expect(currentHandler2.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'current_exact',
      'current_downward',
      'current_upward',
      'current_whole',
      'child_1_upward',
    ])
  );
  expect(currentHandler3.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'parent_downward',
      'current_exact',
      'current_downward',
      'current_upward',
      'current_whole',
    ])
  );
  expect(currentHandler4.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'parent_downward',
      'current_exact',
      'current_downward',
      'current_upward',
      'current_whole',
      'child_1_upward',
    ])
  );
  expect(childHandler1.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining(['child_1_exact', 'child_1_upward'])
  );
  expect(childHandler2.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'parent_downward',
      'current_downward',
      'current_whole',
      'child_1_exact',
      'child_1_upward',
    ])
  );
  expect(childHandler3.mock.results.map((item) => item.value)).toEqual(
    expect.arrayContaining([
      'parent_downward',
      'current_downward',
      'current_whole',
      'child_1_exact',
      'child_1_upward',
    ])
  );
});
