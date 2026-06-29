export interface PdfRequestBody {
    html: string;
    page?: {
        format?: 'A4' | 'A3';
        orientation?: 'vertical' | 'horizontal';
        margin?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        }
    }
}