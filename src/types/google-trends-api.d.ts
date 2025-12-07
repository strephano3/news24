declare module "google-trends-api" {
  export type DailyTrendsOptions = {
    trendDate?: Date;
    geo?: string;
  };

  export type InterestOverTimeOptions = {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
  };

  export function dailyTrends(options: DailyTrendsOptions): Promise<string>;
  export function interestOverTime(options: InterestOverTimeOptions): Promise<string>;
}
