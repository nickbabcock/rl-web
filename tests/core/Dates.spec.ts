import { extractDate } from '../../src/core/Dates';

test('Can parse "2016-12-08 17-20-20"', () => {
  expect(extractDate("2016-12-08 17-20-20")).toStrictEqual(new Date(2016, 11, 8));
});
