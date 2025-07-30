import { SecurityValidator } from '@/lib/security';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  userId: string;
  productId?: string;
  category: 'image' | 'video' | 'document' | 'other';
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

class FileUploadService {
  private readonly STORAGE_KEY = 'size_uploaded_files';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private uploadProgress = new Map<string, UploadProgress>();

  // Upload single file
  async uploadFile(
    file: File, 
    userId: string, 
    productId?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile> {
    // Validate file
    const validation = SecurityValidator.validateFileUpload(file);
    if (!validation.isValid) {
      throw new Error(`Arquivo inválido: ${validation.errors.join(', ')}`);
    }

    const fileId = this.generateFileId();
    const category = this.getFileCategory(file.type);

    // Initialize progress
    const progress: UploadProgress = {
      fileId,
      progress: 0,
      status: 'uploading'
    };
    this.uploadProgress.set(fileId, progress);
    onProgress?.(progress);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        progress.progress = i;
        this.uploadProgress.set(fileId, progress);
        onProgress?.(progress);
      }

      // Convert to base64 and store locally (in production, would upload to CDN)
      const base64 = await this.fileToBase64(file);
      const thumbnailUrl = category === 'image' ? base64 : undefined;

      progress.status = 'processing';
      onProgress?.(progress);

      // Create file record
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: base64,
        thumbnailUrl,
        uploadedAt: new Date(),
        userId,
        productId,
        category
      };

      // Store file metadata
      this.storeFile(uploadedFile);

      progress.status = 'completed';
      progress.progress = 100;
      onProgress?.(progress);

      return uploadedFile;
    } catch (error) {
      progress.status = 'error';
      progress.error = error instanceof Error ? error.message : 'Erro desconhecido';
      onProgress?.(progress);
      throw error;
    } finally {
      // Clean up progress after 5 seconds
      setTimeout(() => {
        this.uploadProgress.delete(fileId);
      }, 5000);
    }
  }

  // Upload multiple files
  async uploadFiles(
    files: File[],
    userId: string,
    productId?: string,
    onProgress?: (progresses: UploadProgress[]) => void
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, userId, productId, (progress) => {
        const allProgresses = Array.from(this.uploadProgress.values());
        onProgress?.(allProgresses);
      })
    );

    return Promise.all(uploadPromises);
  }

  // Get files for user/product
  getFiles(filters?: {
    userId?: string;
    productId?: string;
    category?: UploadedFile['category'];
  }): UploadedFile[] {
    const allFiles = this.getAllFiles();
    
    if (!filters) return allFiles;

    return allFiles.filter(file => {
      if (filters.userId && file.userId !== filters.userId) return false;
      if (filters.productId && file.productId !== filters.productId) return false;
      if (filters.category && file.category !== filters.category) return false;
      return true;
    });
  }

  // Delete file
  deleteFile(fileId: string, userId: string): boolean {
    const files = this.getAllFiles();
    const fileIndex = files.findIndex(f => f.id === fileId && f.userId === userId);
    
    if (fileIndex === -1) return false;

    files.splice(fileIndex, 1);
    this.storeAllFiles(files);
    return true;
  }

  // Get file by ID
  getFile(fileId: string, userId?: string): UploadedFile | null {
    const file = this.getAllFiles().find(f => f.id === fileId);
    
    if (!file) return null;
    if (userId && file.userId !== userId) return null;
    
    return file;
  }

  // Get upload progress
  getUploadProgress(fileId: string): UploadProgress | null {
    return this.uploadProgress.get(fileId) || null;
  }

  // Create image thumbnail
  async createImageThumbnail(file: File, maxWidth: number = 300): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Arquivo não é uma imagem'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Erro ao processar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Validate file type for product materials
  validateMaterialFile(file: File, materialType: 'instagram' | 'tiktok' | 'email' | 'banner'): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const baseValidation = SecurityValidator.validateFileUpload(file);
    
    if (!baseValidation.isValid) {
      errors.push(...baseValidation.errors);
    }

    // Specific validations per material type
    switch (materialType) {
      case 'instagram':
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          errors.push('Instagram: apenas imagens e vídeos são permitidos');
        }
        if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) {
          errors.push('Instagram: vídeos devem ter no máximo 100MB');
        }
        break;

      case 'tiktok':
        if (!file.type.startsWith('video/')) {
          errors.push('TikTok: apenas vídeos são permitidos');
        }
        if (file.size > 300 * 1024 * 1024) {
          errors.push('TikTok: vídeos devem ter no máximo 300MB');
        }
        break;

      case 'email':
        if (!file.type.startsWith('image/') && file.type !== 'text/html' && file.type !== 'text/plain') {
          errors.push('Email: apenas imagens e arquivos de texto são permitidos');
        }
        break;

      case 'banner':
        if (!file.type.startsWith('image/')) {
          errors.push('Banner: apenas imagens são permitidas');
        }
        if (file.size > 5 * 1024 * 1024) {
          errors.push('Banner: imagens devem ter no máximo 5MB');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get storage usage stats
  getStorageStats(userId: string): {
    totalFiles: number;
    totalSize: number;
    sizeByCategory: Record<UploadedFile['category'], number>;
    recentFiles: UploadedFile[];
  } {
    const userFiles = this.getFiles({ userId });
    const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
    
    const sizeByCategory: Record<UploadedFile['category'], number> = {
      image: 0,
      video: 0,
      document: 0,
      other: 0
    };

    userFiles.forEach(file => {
      sizeByCategory[file.category] += file.size;
    });

    const recentFiles = userFiles
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .slice(0, 10);

    return {
      totalFiles: userFiles.length,
      totalSize,
      sizeByCategory,
      recentFiles
    };
  }

  // Private methods
  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFileCategory(mimeType: string): UploadedFile['category'] {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return 'document';
    }
    return 'other';
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private storeFile(file: UploadedFile): void {
    const files = this.getAllFiles();
    files.push(file);
    this.storeAllFiles(files);
  }

  private getAllFiles(): UploadedFile[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const files = JSON.parse(stored);
      return files.map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt)
      }));
    } catch {
      return [];
    }
  }

  private storeAllFiles(files: UploadedFile[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(files));
  }
}

export const fileUploadService = new FileUploadService();