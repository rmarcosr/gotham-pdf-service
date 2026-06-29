import puppeteer from 'puppeteer';
import type { PdfRequestBody } from './types';

export async function convertPdf(request: PdfRequestBody): Promise<Uint8Array> {
    const browser = await puppeteer.launch({
    });

    const page = await browser.newPage();

    await page.setContent(request.html, {
        waitUntil: "load",
    });

    const pdf = await page.pdf({
        format: request.page?.format ?? 'A4',
        landscape: request.page?.orientation === 'horizontal',
        margin: request.page?.margin ? {
            bottom: request.page.margin.bottom,
            left: request.page.margin.left,
            right: request.page.margin.right,
            top: request.page.margin.top,
        } : undefined,
        printBackground: true,
    });

    await browser.close();

    return pdf;
}



