import { afterEach, describe, test, expect, jest } from '@jest/globals';
import { Emitter, Signal } from '../src/index';

const parent = new Emitter();
const current = new Emitter();
const child_1 = new Emitter();
const child_2 = new Emitter();
const child_3 = new Emitter();

afterEach(() => {
  parent.destroy();
  current.destroy();
  child_1.destroy();
  child_2.destroy();
  child_3.destroy();
});

describe('test Emitter children', () => {
  test('addChild', () => {
    current.addChild(child_1, child_1, child_2, child_1, child_2);
    expect(current.children.length).toBe(2);
    expect(child_1.parent).toBe(current);
    expect(current.hasChild(child_1)).toBeTruthy();
    expect(current.hasChild(child_2)).toBeTruthy();
    expect(current.hasChild(child_3)).toBeFalsy();
    expect(current.getChildIndex(child_1)).toBe(0);
    expect(current.getChildIndex(child_2)).toBe(1);
    expect(current.getChildIndex(child_3)).toBe(-1);
  });
  test('removeChild', () => {
    current.addChild(child_1, child_2, child_3);
    expect(current.children.length).toBe(3);

    current.removeChild(child_2);
    expect(current.children.length).toBe(2);
    expect(current.hasChild(child_2)).toBeFalsy();
    expect(current.getChildIndex(child_3)).toBe(1);

    current.removeChild(child_1, child_3);
    expect(current.hasChild(child_1)).toBeFalsy();
    expect(current.hasChild(child_3)).toBeFalsy();
    expect(current.children.length).toBe(0);

    current.addChild(child_1, child_2, child_3);
    expect(current.children.length).toBe(3);
    current.removeChild();
    expect(current.children.length).toBe(0);
  });
});

describe('test Emitter parent', () => {
  test('set parent', () => {
    expect(current.parent).toBeNull();
    current.parent = parent;
    expect(parent.children.length).toBe(1);
    expect(current.parent).toBe(parent);
    expect(parent.hasChild(current)).toBeTruthy();
  });
  test('reset parent', () => {
    current.parent = parent;
    expect(current.parent).toBe(parent);
    current.parent = null;
    expect(parent.children.length).toBe(0);
    expect(current.parent).toBeNull();
    expect(parent.hasChild(current)).toBeFalsy();
  });
  test('change parent', () => {
    expect(child_1.parent).toBeNull();
    child_1.parent = current;
    child_1.parent = parent;
    expect(child_1.parent).toBe(parent);
    expect(parent.hasChild(child_1)).toBeTruthy();
    expect(current.children.length).toBe(0);
  });
});

describe('test Emitter listener', () => {
  const ctx = { id: 1 };
  const handler1 = jest.fn((signal: Signal<number>) => signal.data);
  const handler2 = jest.fn((signal: Signal<number>) => signal.data);
  const handler3 = jest.fn((signal: Signal<number>) => signal.data);
  test('addListener', () => {
    expect(current.totalListener).toBe(0);
    current.addListener('Type1', handler1);
    current.addListener('Type2', handler2);
    current.addListener('Type3', handler3);
    current.addListener('Type1', handler1);
    expect(current.totalListener).toBe(3);
    current.addListener('Type1', handler2);
    expect(current.totalListener).toBe(4);
  });
  test('removeListener', () => {
    current.addListener('Type1', handler1);
    current.addListener('Type1', handler2);
    current.addListener('Type1', handler3);
    current.addListener('Type2', handler2);
    current.addListener('Type3', handler3);
    expect(current.totalListener).toBe(5);
    current.removeListener('Type1', handler1);
    expect(current.totalListener).toBe(4);
    current.removeListener('Type1');
    expect(current.totalListener).toBe(2);
    current.removeListener();
    expect(current.totalListener).toBe(0);
  });
  test('receive signal', () => {
    current.parent = parent;
    current.addChild(child_1, child_2, child_3);
    current.addListener('Type1', handler2, ctx);
    current.emit('Type1', 5);
    expect(handler2.mock.calls.length).toBe(1);
    expect(handler2.mock.results[0].value).toBe(5);
    expect(handler2.mock.calls[0][0].origin).toBe(current);
    expect(handler2.mock.contexts[0]).toBe(ctx);
    parent.addListener('Type1', handler1, null, -1, Signal.Features.upward);
    current.addListener('Type1', handler2, null, -1, Signal.Features.whole);
    child_1.addListener('Type1', handler3, null, -1, Signal.Features.downward);
    child_1.emit('Type1', 6);
    expect(handler1.mock.calls.length).toBe(0);
    expect(handler2.mock.calls.length).toBe(1);
    expect(handler3.mock.calls.length).toBe(1);
    child_1.emit('Type1', 7, Signal.Features.upward);
    expect(handler1.mock.calls.length).toBe(1);
    expect(handler2.mock.calls.length).toBe(2);
    expect(handler3.mock.calls.length).toBe(2);
    child_1.emit('Type1', 7, Signal.Features.whole);
    expect(handler1.mock.calls.length).toBe(2);
    expect(handler2.mock.calls.length).toBe(3);
    expect(handler3.mock.calls.length).toBe(3);
    current.emit('Type1', 8, Signal.Features.whole);
    expect(handler1.mock.calls.length).toBe(3);
    expect(handler2.mock.calls.length).toBe(5);
    expect(handler3.mock.calls.length).toBe(4);
    current.emit('Type1', 9, Signal.Features.upward);
    expect(handler1.mock.calls.length).toBe(4);
    expect(handler2.mock.calls.length).toBe(7);
    expect(handler3.mock.calls.length).toBe(4);
    current.emit('Type1', 9, Signal.Features.downward);
    expect(handler1.mock.calls.length).toBe(4);
    expect(handler2.mock.calls.length).toBe(9);
    expect(handler3.mock.calls.length).toBe(5);
  });
});
