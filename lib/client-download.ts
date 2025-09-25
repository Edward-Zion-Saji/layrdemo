// Client-side only download utility
// This file should only be imported and used on the client side

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  // Double check we're in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('Download not available in server environment');
    return false;
  }

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
};

export const downloadPDF = (content: string, title: string) => {
  const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
  return downloadFile(content, filename, 'text/plain');
};
