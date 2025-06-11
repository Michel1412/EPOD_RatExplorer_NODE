export function formatFileSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}

export function getFileType(filePath) {
  const extension = filePath.split('.').pop();
  return extension ? extension : 'unknown';
}