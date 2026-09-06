/**
 * Email utilities for handling attachments and email formatting
 */

export interface InlineImage {
  dataUrl: string; // Full data URL for inline embedding
  filename: string;
  size: number;
  type: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 content
  contentType: string; // MIME type
}

/**
 * Converts a File object to Base64 for email attachment (Node.js server-side)
 */
export async function fileToBase64(file: File): Promise<string> {
  console.log(`Converting file to Base64: ${file.name} (${formatFileSize(file.size)})`);
  
  try {
    // Convert File to Buffer using arrayBuffer() method
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    console.log(`Base64 conversion complete for ${file.name}: ${base64.length} characters`);
    return base64;
  } catch (error) {
    console.error(`Failed to convert file to Base64: ${file.name}`, error);
    throw new Error(`Failed to convert file to Base64: ${file.name}`);
  }
}

/**
 * Converts a File object to a data URL for inline embedding (Node.js server-side)
 */
export async function fileToDataURL(file: File): Promise<string> {
  console.log(`Converting file to data URL: ${file.name} (${formatFileSize(file.size)})`);
  
  try {
    // Convert File to Buffer using arrayBuffer() method
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    
    console.log(`Data URL conversion complete for ${file.name}: ${dataUrl.length} characters`);
    return dataUrl;
  } catch (error) {
    console.error(`Failed to read file as data URL: ${file.name}`, error);
    throw new Error(`Failed to read file as data URL: ${file.name}`);
  }
}

/**
 * Converts an array of File objects to inline images for email embedding
 */
export async function filesToInlineImages(files: File[]): Promise<InlineImage[]> {
  console.log(`Starting conversion of ${files.length} files to inline images`);
  const images: InlineImage[] = [];
  
  for (const file of files) {
    try {
      console.log(`Processing file: ${file.name} (${file.type}, ${formatFileSize(file.size)})`);
      
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name} (${file.type})`);
        continue;
      }
      
      // Size limit for inline images (1MB per image)
      const maxSize = 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        console.warn(`Skipping large image: ${file.name} (${formatFileSize(file.size)} > ${formatFileSize(maxSize)})`);
        continue;
      }
      
      const dataUrl = await fileToDataURL(file);
      const image = {
        dataUrl,
        filename: sanitizeFilename(file.name),
        size: file.size,
        type: file.type,
      };
      images.push(image);
      console.log(`Successfully processed inline image: ${image.filename}`);
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);
      // Continue processing other files rather than failing completely
    }
  }
  
  console.log(`Inline image conversion complete: ${images.length}/${files.length} files successful`);
  return images;
}

/**
 * Converts an array of File objects to Resend-compatible attachments
 */
export async function filesToEmailAttachments(files: File[]): Promise<EmailAttachment[]> {
  console.log(`Starting conversion of ${files.length} files to email attachments`);
  const attachments: EmailAttachment[] = [];
  
  for (const file of files) {
    try {
      console.log(`Processing file: ${file.name} (${file.type}, ${formatFileSize(file.size)})`);
      const base64Content = await fileToBase64(file);
      const attachment = {
        content: base64Content,
        filename: sanitizeFilename(file.name),
        contentType: file.type || 'application/octet-stream',
      };
      attachments.push(attachment);
      console.log(`Successfully processed attachment: ${attachment.filename} (${attachment.content.length} chars)`);
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);
      // Continue processing other files rather than failing completely
    }
  }
  
  console.log(`Attachment conversion complete: ${attachments.length}/${files.length} files successful`);
  return attachments;
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets a safe filename for email attachments (removes problematic characters)
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace problematic characters for email attachments
  return filename.replace(/[<>:"/\\|?*]/g, '_').trim();
}

/**
 * Checks if the total size of attachments is within email limits
 * Most email providers have a 25MB limit for total message size
 */
export function validateAttachmentSize(files: File[], maxSizeMB: number = 20): { isValid: boolean; totalSize: number; error?: string } {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const totalMB = totalBytes / (1024 * 1024);
  
  if (totalMB > maxSizeMB) {
    return {
      isValid: false,
      totalSize: totalBytes,
      error: `Total attachment size (${formatFileSize(totalBytes)}) exceeds ${maxSizeMB}MB limit`,
    };
  }
  
  return {
    isValid: true,
    totalSize: totalBytes,
  };
}