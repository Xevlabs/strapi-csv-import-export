export const useDownloadFile = () => {
  const downloadFile = (content: BlobPart, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
  };

  const withTimestamp = (fileName: string) => {
    const ts = new Date().toISOString().replace(/\D/g, '').substring(2);
    const name = fileName.split('.').slice(0, -1).join('.').concat(`_${ts}`);
    const extension = fileName.split('.').slice(-1);
    return [name, extension].join('.');
  };

  return {
    downloadFile,
    withTimestamp,
  };
};
