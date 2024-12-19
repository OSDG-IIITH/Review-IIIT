type ErrorMessageCallback = (message: string | null) => void;
type LogoutCallback = () => void;
type FetchReviewsCallback = () => Promise<void>;

type Vote = 1 | 0 | -1;

interface ReviewType {
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  dtime: string;
  review_id: string;
  is_reviewer: boolean;
  votes_aggregate: number;
  votes_status: Vote;
}

interface ProfType {
  name: string;
  email: string;
}

interface CourseType {
  name: string;
  code: string;
  sem: string;
  profs: string[];
}

interface NameAndCode {
  name: string;
  code: string;
}
export type {
  ErrorMessageCallback,
  LogoutCallback,
  FetchReviewsCallback,
  Vote,
  ReviewType,
  ProfType,
  CourseType,
  NameAndCode,
};
