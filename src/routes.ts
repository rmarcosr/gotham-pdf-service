import { convertPdf } from "./pdf";
import { parsePdfRequestBody } from "./types";
import { ZodError, z } from "zod";
import { timingSafeEqual } from "node:crypto"

const TOKEN = process.env.TOKEN;


export const routes = {
    '/': () => new Response(null, { status: 200 }),
    '/pdf': withAuth(pdfHandler),
};


function withAuth(handler: (req: Request) => Response | Promise<Response>) {
    return async (req: Request): Promise<Response> => {
        const headerToken = req.headers.get('x-api-key');

        if (!headerToken) {
            return new Response(JSON.stringify({ error: 'Missing token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const a = Buffer.from(headerToken, 'utf-8');
        const b = Buffer.from(TOKEN || '', 'utf-8');

        if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return handler(req);
    };
}

async function pdfHandler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const json = await req.json();

        let body;
        try {
            body = parsePdfRequestBody(json);
        } catch (error) {
            if (error instanceof ZodError) {
                return new Response(JSON.stringify({
                    errors: z.flattenError(error).fieldErrors
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, body.timeout);

        const pdf = await convertPdf(body, signal);
        clearTimeout(timeoutId);

        return new Response(pdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="document.pdf"',
            },
        })

    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return new Response(JSON.stringify({ error: 'Request timed out' }), {
                status: 408,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


