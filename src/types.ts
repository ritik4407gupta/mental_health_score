export type Gender = 'Male' | 'Female';

export type AcademicLevel = 'Undergraduate' | 'Graduate' | 'High School';

export type SocialPlatform =
  | 'Instagram'
  | 'TikTok'
  | 'YouTube'
  | 'Snapchat'
  | 'Twitter'
  | 'Facebook'
  | 'LinkedIn'
  | 'WhatsApp'
  | 'WeChat'
  | 'LINE'
  | 'KakaoTalk'
  | 'VKontakte';

export type PurposeOfUse = 'Networking' | 'Education' | 'Entertainment' | 'News';

export type StressLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface StudentData {
  age: number;
  gender: Gender;
  country: string;
  academic_level: AcademicLevel;
  most_used_platform: SocialPlatform;
  purpose_of_use: PurposeOfUse;
  avg_daily_usage_hours: number;
  daily_unlocks: number;
  study_hours: number;
  physical_activity_hours: number;
  sleep_hours_per_night: number;
  stress_level: StressLevel;
}

export interface PredictionResponse {
  predicted_mental_health_score: number;
}

export interface ApiStatus {
  online: boolean;
  checking: boolean;
  message: string;
  lastChecked?: number;
}

export interface PresetProfile {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
  data: StudentData;
}
