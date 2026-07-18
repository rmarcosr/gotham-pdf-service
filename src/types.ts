import z from "zod";

export type PdfRequestBody = z.infer<typeof PdfRequestSchema>;

export const PdfRequestSchema = z.object({
    html: z.string(),
    scale: z.number().optional(),
    timeout: z.number().optional().default(30000),
    page: z.object({
        format: z.enum(['A6','A5', 'A4', 'A3', 'A2', 'A1']).optional().default('A4'),
        orientation: z.enum(['vertical', 'horizontal']).optional(),
        margin: z.object({
            top: z.number().optional(),
            right: z.number().optional(),
            bottom: z.number().optional(),
            left: z.number().optional(),
        }).optional(),
    }).optional(),
});




export function parsePdfRequestBody(obj: unknown): PdfRequestBody {
    return PdfRequestSchema.parse(obj);
}