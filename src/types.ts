export interface User {
  id: string;
  name: string;
  createdAt: string;
  image: string;
}

export interface Forecast {
  // Assuming properties for the Forecast object, add specific types as needed
  id: string;
  outcome: string;
  resolution?: string|null;
  forecast: string;
  probability?: number;
  createdAt: string;
  user?: User;
}

export interface ExtendedForecast extends Forecast {
  question: Question;
  probability: number;
  resolution: 'YES' | 'NO';
}

export interface Question {
  id: string;
  createdAt: string;
  comment: Comment | null;
  comments: Comment[];
  forecasts: Forecast[];
  hideForecastsUntil: string | null;
  hideForecastsUntilPrediction: boolean;
  notes: string | null;
  pingedForResolution: boolean;
  profileId: string | null;
  questionMessages: string[];
  resolution: 'YES' | 'NO' | 'AMBIGUOUS' | null;
  resolveBy: string;
  resolved: boolean;
  resolvedAt: string;
  sharedPublicly: boolean;
  sharedWith: string[];
  sharedWithLists: string[];
  tags: Tag[];
  title: string;
  unlisted: boolean;
  user: User;
  userId: string;
}

export interface Comment {
  id: string;
  createdAt: string;
  comment: string;
  questionId: string;
  user: User;
  userId: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
  count?: number;
}

export interface SubmitQuestionData {
  title: string;
  description: string;
  resolveBy?: string;
  forecast?: number;
  tags?: string[];
  sharePublicly?: boolean;
  shareWithLists?: string[];
  shareWithEmail?: string[];
  hideForecastsUntil?: string;
}