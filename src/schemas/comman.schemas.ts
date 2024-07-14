import { z } from "zod";

export const DefaultSearchParams = z.object({
  page: z.string().optional(),
  size: z.string().optional(),
  order: z.enum(["ASC", "DESC"]).optional(),
});

export const DateRangeParams = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),  
});

export const RangeDate = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),  
});

export type DefaultSearchParamsType = z.infer<typeof DefaultSearchParams>;
export type DateRangeParamsType = z.infer<typeof DateRangeParams>;
export type RangeDateType = z.infer<typeof RangeDate>;