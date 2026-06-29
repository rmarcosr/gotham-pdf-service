import { convertPdf } from "./pdf";
import type { PdfRequestBody } from "./types";

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

        if (!body.html) {
            return new Response('Bad Request: Missing html field', { status: 400 });
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
        return new Response('Internal Server Error', { status: 500 });
    }
}


