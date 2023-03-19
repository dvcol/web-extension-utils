/**
 * Compute elapsed time between two dates
 * @param endDate
 * @param startDate
 */
export const elapsedTime = (endDate: Date, startDate = new Date()): number => {
  return (endDate.getTime() - startDate.getTime()) / 1000;
};
