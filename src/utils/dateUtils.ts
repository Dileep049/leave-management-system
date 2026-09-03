import { differenceInBusinessDays, parseISO, format, differenceInDays } from 'date-fns';

export const calculateLeaveDays = (fromDateStr: string, toDateStr: string): number => {
  if (!fromDateStr || !toDateStr) return 0;
  try {
    const fromDate = parseISO(fromDateStr);
    const toDate = parseISO(toDateStr);
    if (toDate < fromDate) return 0;
    
    // Inclusive count: e.g. 5th to 7th is 3 days
    const diff = differenceInDays(toDate, fromDate) + 1;
    return diff > 0 ? diff : 0;
  } catch (error) {
    return 0;
  }
};

export const formatDateString = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = parseISO(dateStr);
    return format(date, 'MMM dd, yyyy');
  } catch (e) {
    return dateStr;
  }
};

export const formatDateTimeString = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = parseISO(dateStr);
    return format(date, 'MMM dd, yyyy hh:mm a');
  } catch (e) {
    return dateStr;
  }
};

export const getCurrentMonthString = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthNameString = (monthYearStr: string): string => {
  try {
    const [year, month] = monthYearStr.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return format(date, 'MMMM yyyy');
  } catch (e) {
    return monthYearStr;
  }
};
