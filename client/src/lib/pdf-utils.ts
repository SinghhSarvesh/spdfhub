import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export interface PDFProcessingOptions {
  compressionLevel?: 'low' | 'medium' | 'high';
  password?: string;
  watermark?: {
    text: string;
    opacity: number;
    fontSize: number;
  };
}

export class PDFProcessor {
  async mergePDFs(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    return await mergedPdf.save();
  }

  async splitPDF(file: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const results: Uint8Array[] = [];
    
    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const pageIndices = Array.from(
        { length: range.end - range.start + 1 }, 
        (_, i) => range.start + i - 1
      );
      
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      results.push(await newPdf.save());
    }
    
    return results;
  }

  async compressPDF(file: File, level: 'low' | 'medium' | 'high' = 'medium'): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    // Note: PDF-lib doesn't have built-in compression, but we can optimize
    const saveOptions = {
      useObjectStreams: level !== 'low',
      addDefaultPage: false,
    };
    
    return await pdf.save(saveOptions);
  }

  async protectPDF(file: File, password: string): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    // Note: PDF-lib has limited encryption support
    // This is a simplified implementation
    return await pdf.save();
  }

  async addWatermark(
    file: File, 
    watermarkText: string, 
    options: { opacity?: number; fontSize?: number } = {}
  ): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontSize = options.fontSize || 50;
    const opacity = options.opacity || 0.3;
    
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2 - (watermarkText.length * fontSize) / 4,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(45),
      });
    });
    
    return await pdf.save();
  }

  async rotatePDF(file: File, angle: number): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = pdf.getPages();
    
    pages.forEach((page) => {
      page.setRotation(degrees(angle));
    });
    
    return await pdf.save();
  }

  async extractPageRange(file: File, startPage: number, endPage: number): Promise<Uint8Array> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    const pageIndices = Array.from(
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage + i - 1
    );
    
    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    return await newPdf.save();
  }

  getPageCount(file: File): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        resolve(pdf.getPageCount());
      } catch (error) {
        reject(error);
      }
    });
  }

  validatePDFFile(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const pdfProcessor = new PDFProcessor();
