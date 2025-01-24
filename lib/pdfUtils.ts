import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import type { TextContent } from 'pdfjs-dist/types/src/display/api'

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
  // Set worker mode on window
  ;(window as any).PDFJS = { disableWorker: true }
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    })
    const pdf = await loadingTask.promise
    let text = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent() as TextContent
      text += content.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ') + '\n'
    }

    return text
  } catch (error) {
    console.error('PDF extraction failed:', error)
    throw new Error('Failed to extract text from PDF')
  }
}
