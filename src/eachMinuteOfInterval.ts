// import addHours from '../addHours/index.js'
// import toDate from '../toDate/index.js'
// import requiredArgs from '../_lib/requiredArgs/index.js'

import addHours from "date-fns/addHours";
import addMinutes from "date-fns/addMinutes";
import toDate from "date-fns/toDate";

/**
 * @name eachHourOfInterval
 * @category Interval Helpers
 * @summary Return the array of hours within the specified time interval.
 *
 * @description
 * Return the array of hours within the specified time interval.
 *
 * @param {Interval} interval - the interval. See [Interval]{@link docs/types/Interval}
 * @param {Object} [options] - an object with options.
 * @param {Number} [options.step=1] - the step to increment by. The value should be more than 1.
 * @returns {Date[]} the array with starts of hours from the hour of the interval start to the hour of the interval end
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} `options.step` must be a number greater than 1
 * @throws {RangeError} The start of an interval cannot be after its end
 * @throws {RangeError} Date in interval cannot be `Invalid Date`
 *
 * @example
 * // Each hour between 6 October 2014, 12:00 and 10 October 2014, 15:00
 * var result = eachHourOfInterval({
 *   start: new Date(2014, 9, 6, 12),
 *   end: new Date(2014, 9, 6, 15)
 * })
 * //=> [
 * //   Mon Oct 06 2014 12:00:00,
 * //   Mon Oct 06 2014 13:00:00,
 * //   Mon Oct 06 2014 14:00:00,
 * //   Mon Oct 06 2014 15:00:00
 * // ]
 */

interface IDirtyInterval {
  start: Date | number;
  end: Date | number;
}

interface IOptions {
  step: number;
}

export default function eachMinuteOfInterval(
  dirtyInterval: IDirtyInterval,
  options: IOptions
) {
  // requiredArgs(1, arguments)

  const interval = dirtyInterval || {};
  const startDate = toDate(interval.start);
  const endDate = toDate(interval.end);

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  // Throw an exception if start date is after end date or if any date is `Invalid Date`
  if (!(startTime <= endTime)) {
    throw new RangeError("Invalid interval");
  }

  const dates = [];

  const step = options && "step" in options ? Number(options.step) : 30;
  if (step < 1 || isNaN(step))
    throw new RangeError("`options.step` must be a number greater than 1");

  let currentDate = startDate;
  currentDate.setMinutes(0, 0, 0);
  let dateWithMinutes = currentDate;

  dates.push(toDate(currentDate));
  while (currentDate.getTime() <= endTime) {
    let currentStep = 1;
    while (currentStep <= Math.floor(60 / step)) {
      dateWithMinutes = addMinutes(dateWithMinutes, step);
      dateWithMinutes.getTime() <= endTime &&
        dates.push(toDate(dateWithMinutes));
      currentStep += 1;
    }
    currentDate = addHours(currentDate, 1);
  }
  return dates;
}
