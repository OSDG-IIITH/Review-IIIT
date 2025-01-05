import { ReviewableType, SortType } from './types';

const semCompare = (a: string, b: string) => {
  // Extract year and term (S/M) for comparison
  const [termA, yearA] = [a[0], parseInt(a.slice(1))];
  const [termB, yearB] = [b[0], parseInt(b.slice(1))];

  // Compare by year first (descending order)
  if (yearA !== yearB) {
    return yearB - yearA;
  }

  // If the year is the same, compare by term (M before S)
  if (termA !== termB) {
    return termA === 'M' ? -1 : 1;
  }

  return 0;
};

const reviewableDefaultCompare = <T extends ReviewableType>(a: T, b: T) => {
  if ('sem' in a && 'sem' in b) {
    // First compare by semester, if that is same compare by name (ascending order)
    const res = semCompare(a.sem, b.sem);
    if (res) {
      return res;
    }
  }
  return a.name.localeCompare(b.name);
};

const reviewableDefaultSortString = <T extends ReviewableType>(
  arr: T[] | null
) => {
  return JSON.stringify(arr && [...arr].sort(reviewableDefaultCompare));
};

const reviewableEqual = <T extends ReviewableType>(a: T[], b: T[]) => {
  if (a.length !== b.length) return false;
  return reviewableDefaultSortString(a) === reviewableDefaultSortString(b);
};

const reviewableSort = <T extends ReviewableType>(
  sortableData: T[],
  sortBy: SortType | '' = '',
  sortByAscending: boolean = false
) => {
  const reviewableCompare = <T extends ReviewableType>(a: T, b: T) => {
    if (!sortBy) {
      return 0;
    }

    const left = a.reviews_metadata[sortBy];
    const right = b.reviews_metadata[sortBy];
    if (right === left) {
      /* Both null or both equal, return 0 */
      return 0;
    }

    /* always settle the null entries at the end */
    if (right === null || right === 0) {
      return -1;
    }
    if (left === null || left === 0) {
      return 1;
    }

    if (typeof left === 'number' && typeof right === 'number') {
      return sortByAscending ? left - right : right - left;
    } else if (typeof left === 'string' && typeof right === 'string') {
      return sortByAscending
        ? left.localeCompare(right)
        : right.localeCompare(left);
    } else {
      return 0;
    }
  };

  // First compare with reviewableCompare (uses sort parameters), and if that
  // returns 0 then use the default comparator (sorts by name/sem).
  return [...sortableData].sort(
    (a, b) => reviewableCompare(a, b) || reviewableDefaultCompare(a, b)
  );
};

export {
  semCompare,
  reviewableDefaultSortString,
  reviewableEqual,
  reviewableSort,
};
