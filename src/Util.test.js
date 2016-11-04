import { bitCount, adjustOctave, showFlat, prettyAccidental, SHARP, FLAT} from './Util';

test('bitCount(i)', () => {
  expect(bitCount(0b0)).toEqual(0)
  expect(bitCount(0b1)).toEqual(1)
  expect(bitCount(0b01)).toEqual(1)
  expect(bitCount(0b1111111111111)).toEqual(13)
  expect(bitCount(0b1010101010101)).toEqual(7)
  expect(bitCount(0b0101010101010)).toEqual(6)
});

test('adjustOctave(note, roller)', () => {
  expect(adjustOctave("c", 0)).toEqual("c")
  expect(adjustOctave("d#", 1)).toEqual("d#'")
  expect(adjustOctave("eb", 2)).toEqual("eb''")

  expect(adjustOctave("f", -1)).toEqual("F")
  expect(adjustOctave("gb", -2)).toEqual("Gb,")
  expect(adjustOctave("a#", -3)).toEqual("A#,,")

  expect(adjustOctave("B", 1)).toEqual("b")
  expect(adjustOctave("c'", -1)).toEqual("c")
})

test('showFlat(note)', () => {
  expect(showFlat('d#')).toEqual('eb')
  expect(showFlat('A#')).toEqual('Bb')
})

test('prettyAccidental(note)', () => {
  expect(prettyAccidental('c#')).toEqual('c' + SHARP)
  expect(prettyAccidental('bb')).toEqual('b' + FLAT)
})
