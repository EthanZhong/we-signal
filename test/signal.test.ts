import { describe, test, expect } from '@jest/globals';
import { Emitter, Signal } from '../src/index';

describe('test create Signal instance', () => {
  test('use Constructor', () => {
    expect(
      () =>
        new Signal(
          Symbol() as any,
          'type',
          1,
          new Emitter(),
          Signal.Features.exact
        )
    ).toThrow('Please use [Signal.create]');
  });
  test('use Signal.create', () => {
    const signal1 = Signal.create(
      'type',
      { id: 5 },
      new Emitter(),
      Signal.Features.whole
    );
    const signal2 = Signal.create('Finish', 10, new Emitter());
    expect(signal1.data).toEqual({ id: 5 });
    expect(signal1.feature).toBe(Signal.Features.whole);
    expect(signal2.feature).toBe(Signal.Features.exact);
  });
});
