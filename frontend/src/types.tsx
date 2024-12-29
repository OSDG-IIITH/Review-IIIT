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

interface ReviewsMetadata {
  num_reviews: number;
  newest_dtime: string | null;
  avg_rating: number | null;
}

interface ProfType {
  name: string;
  email: string;
  reviews_metadata: ReviewsMetadata;
}

interface CourseType {
  name: string;
  code: string;
  sem: string;
  profs: string[];
  reviews_metadata: ReviewsMetadata;
}

interface NameAndCode {
  name: string;
  code: string;
}

type SortType = keyof ReviewsMetadata;
type ReviewableType = CourseType | ProfType;

export type {
  ErrorMessageCallback,
  LogoutCallback,
  FetchReviewsCallback,
  Vote,
  ReviewType,
  ProfType,
  CourseType,
  NameAndCode,
  SortType,
  ReviewableType,
};
