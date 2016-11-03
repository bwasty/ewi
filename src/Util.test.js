import { bitCount } from './Util';

test('bitCount counts bits', () => {
  expect(bitCount(0b0)).toEqual(0)
  expect(bitCount(0b1)).toEqual(1)
  expect(bitCount(0b01)).toEqual(1)
  expect(bitCount(0b1111111111111)).toEqual(13)
  expect(bitCount(0b1010101010101)).toEqual(7)
  expect(bitCount(0b0101010101010)).toEqual(6)
});
