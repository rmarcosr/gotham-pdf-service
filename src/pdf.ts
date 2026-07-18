import puppeteer from 'puppeteer';
import type { PdfRequestBody } from './types';

export async function convertPdf(request: PdfRequestBody, signal?: AbortSignal): Promise<Uint8Array> {
    const browser = await puppeteer.launch({
        executablePath: process.env.IS_DEV === 'true' ? undefined : "/usr/bin/chromium",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const onAbort = async () => {
        try {
            await browser.close();
        } catch (e) {
            // Actually do nothing
        }
    };

    if (signal?.aborted) {
        await browser.close();
        throw new DOMException('The operation was aborted.', 'AbortError');
    }

    signal?.addEventListener('abort', onAbort);

    try {
        const page = await browser.newPage();

        await page.setContent(request.html, {
            waitUntil: "load",
        });

        const pdf = await page.pdf({
            format: request.page?.format,
            landscape: request.page?.orientation === 'horizontal',
            scale: request.scale,
            timeout: request.timeout,
            margin: request.page?.margin ? {
                bottom: request.page.margin.bottom,
                left: request.page.margin.left,
                right: request.page.margin.right,
                top: request.page.margin.top,
            } : undefined,
            printBackground: true,
        });

        return pdf;

    } catch (error) {
        if (signal?.aborted) {
            throw new DOMException('The operation was aborted.', 'AbortError');
        }
        throw error;
    } finally {
        signal?.removeEventListener('abort', onAbort);
        await browser.close();
    }
}



