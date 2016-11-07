import { Fingering } from './Fingering'

test('Fingering.updateBitmask(index, pressed)', () => {
  let fingering = new Fingering(0)
  fingering.updateBitmask(0, true)
  expect(fingering.bitmask).toEqual(1)
  fingering.updateBitmask(0, false)
  expect(fingering.bitmask).toEqual(0)

  fingering.updateBitmask(12, true)
  expect(fingering.bitmask).toEqual(1 << 12)

  fingering.updateBitmask(12, true)
  expect(fingering.bitmask).toEqual(1 << 12)
});
