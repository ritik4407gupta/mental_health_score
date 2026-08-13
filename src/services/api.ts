import { StudentData, PredictionResponse, ApiStatus } from '../types';

export const BACKEND_URL = 'https://mental-health-score-a7dj.onrender.com';

export const TOP_COUNTRIES = [
  'USA',
  'India',
  'Canada',
  'UK',
  'Australia',
  'Germany',
  'Mexico',
  'Turkey',
  'France',
  'Other',
];

export const ALL_COUNTRIES = [
  'USA',
  'India',
  'Canada',
  'UK',
  'Australia',
  'Germany',
  'Mexico',
  'Turkey',
  'France',
  'Brazil',
  'Japan',
  'South Korea',
  'Spain',
  'Italy',
  'Netherlands',
  'Indonesia',
  'Pakistan',
  'Nigeria',
  'Philippines',
  'Other',
];

/**
 * Pings the Render backend to warm up cold start and check health
 */
export async function checkBackendHealth(): Promise<ApiStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second check

    const res = await fetch(`${BACKEND_URL}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return {
        online: true,
        checking: false,
        message: 'Render ML Model Server Active',
        lastChecked: Date.now(),
      };
    } else {
      return {
        online: false,
        checking: false,
        message: `Server responded with code ${res.status}`,
        lastChecked: Date.now(),
      };
    }
  } catch (err: any) {
    return {
      online: false,
      checking: false,
      message: err.name === 'AbortError' ? 'Server warming up...' : 'Offline / Standby mode',
      lastChecked: Date.now(),
    };
  }
}

/**
 * Sends student data to backend /predict endpoint
 */
export async function predictMentalHealth(data: StudentData): Promise<{
  score: number;
  isFallback: boolean;
  message?: string;
}> {
  try {
    const controller = new AbortController();
    // 45s timeout to allow Render free instance to spin up
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server status ${response.status}: ${response.statusText}`);
    }

    const json: PredictionResponse = await response.json();
    if (typeof json.predicted_mental_health_score === 'number' && !isNaN(json.predicted_mental_health_score)) {
      let rawScore = json.predicted_mental_health_score;
      // Convert 0-100 score to 0-10 scale if returned on 0-100 scale
      if (rawScore > 10) {
        rawScore = rawScore / 10;
      }
      const score = Math.round(Math.min(Math.max(rawScore, 1.0), 10.0) * 10) / 10;
      return {
        score,
        isFallback: false,
      };
    } else {
      throw new Error('Invalid response structure from backend model');
    }
  } catch (error: any) {
    console.warn('Backend prediction error or timeout, running ML local estimator model fallback:', error);
    const localScore = calculateLocalMLScore(data);
    return {
      score: localScore,
      isFallback: true,
      message: error.name === 'AbortError' 
        ? 'Render server took too long to wake up. Used local fallback prediction model.'
        : 'Could not connect directly to backend. Generated via client ML estimate model.',
    };
  }
}

/**
 * Local fallback regression model approximating the Python Mental_Health_Model.pkl
 * based on sleep, screen time, stress, physical activity, study hours, unlocks, etc.
 * Returns score on 0.0 - 10.0 scale.
 */
export function calculateLocalMLScore(data: StudentData): number {
  // Baseline score around 70
  let baseScore = 68.0;

  // Sleep hours (+ impact up to 8h, negative if < 6 or > 10)
  if (data.sleep_hours_per_night >= 7 && data.sleep_hours_per_night <= 9) {
    baseScore += (data.sleep_hours_per_night - 6) * 3.5;
  } else if (data.sleep_hours_per_night < 7) {
    baseScore -= (7 - data.sleep_hours_per_night) * 4.2;
  } else {
    baseScore -= (data.sleep_hours_per_night - 9) * 2.0;
  }

  // Daily Screen usage hours (heavy penalty after 4 hours)
  if (data.avg_daily_usage_hours > 3) {
    baseScore -= (data.avg_daily_usage_hours - 3) * 3.2;
  } else {
    baseScore += (3 - data.avg_daily_usage_hours) * 1.5;
  }

  // Daily unlocks (over 70 unlocks indicates compulsive checking)
  if (data.daily_unlocks > 60) {
    baseScore -= Math.min((data.daily_unlocks - 60) * 0.18, 12);
  }

  // Physical activity (+ boost up to 3h)
  baseScore += Math.min(data.physical_activity_hours * 2.8, 10);

  // Study hours balance (optimal 3-6 hours)
  if (data.study_hours >= 2 && data.study_hours <= 6) {
    baseScore += 4;
  } else if (data.study_hours > 8) {
    baseScore -= (data.study_hours - 8) * 1.8;
  }

  // Stress Level penalty
  switch (data.stress_level) {
    case 'Low':
      baseScore += 12;
      break;
    case 'Medium':
      baseScore += 2;
      break;
    case 'High':
      baseScore -= 12;
      break;
    case 'Very High':
      baseScore -= 22;
      break;
  }

  // Purpose of social media use adjustment
  if (data.purpose_of_use === 'Education') baseScore += 2.5;
  if (data.purpose_of_use === 'Networking') baseScore += 1.0;
  if (data.purpose_of_use === 'Entertainment') baseScore -= 1.5;

  // Clamp between 1.0 and 9.9, scaled on 0-10
  const finalScore = Math.min(Math.max(baseScore, 10.0), 99.5) / 10;
  return Math.round(finalScore * 10) / 10;
}
