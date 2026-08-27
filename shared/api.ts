/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface AnalysisResult {
  matchScore: number;
  breakdown: Record<string, number>;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  recommendations: Array<{
    title: string;
    description: string;
  }>;
  jobTitle: string;
  companyName?: string | null;
}
