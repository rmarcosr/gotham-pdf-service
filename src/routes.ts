import { convertPdf } from "./pdf";
import { isPdfRequestBody, type PdfRequestBody } from "./types";
import { ZodError, z } from "zod";



export const routes = {
    '/': () => new Response(null, { status: 200 }),
    '/pdf': pdfHandler,
};


async function pdfHandler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const body = await req.json() as PdfRequestBody;

        try {
            isPdfRequestBody(body);
        } catch (error) {
            if (error instanceof ZodError) {
                return new Response(JSON.stringify({ errors: z.flattenError(error).fieldErrors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
            return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const pdf = await convertPdf(body);

        return new Response(pdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="document.pdf"',
            },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}


