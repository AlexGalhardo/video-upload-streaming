import { z } from "zod";

export const ONE_MB = 1024 * 1024;
export const MAX_MB = 10 * ONE_MB;

export const RangeBytesSchema = z
	.string()
	.regex(/^bytes=(\d+)-(\d*)$/, "Invalid format")
	.transform((range) => {
		const match = /^bytes=(\d+)-(\d*)$/.exec(range);
		if (!match) {
			throw new Error("Invalid range format");
		}
		const [, startStr, endStr] = match;
		const start = Number.parseInt(startStr, 10);
		const end = Number.parseInt(endStr, 10);

		return { start, end };
	})
	.refine(({ start, end }) => !Number.isNaN(start) && !Number.isNaN(end), {
		message: "Start and end must be valid numbers",
	})
	.refine(({ start, end }) => end > start, {
		message: "End must be greater than start",
	})
	.refine(({ start, end }) => end - start >= ONE_MB, {
		message: "Range must be at least 1MB",
	})
	.refine(({ start, end }) => (end - start) % ONE_MB === 0, {
		message: "Range must be in 1MB increments",
	})
	.refine(({ start, end }) => end - start <= MAX_MB, {
		message: "Range cannot exceed 10MB",
	});
