import React, { useState } from 'react';
import { Paperclip, X, Download, FileText, Image, File, Upload, Camera } from 'lucide-react';
import { Attachment } from '../types';

interface AttachmentManagerProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}

const AttachmentManager: React.FC<AttachmentManagerProps> = ({ attachments, onAttachmentsChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      // Limite de taille : 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert(`Le fichier "${file.name}" est trop volumineux (max 10MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment: Attachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target?.result as string,
          uploadedAt: new Date()
        };
        
        onAttachmentsChange([...attachments, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeAttachment = (attachmentId: string) => {
    onAttachmentsChange(attachments.filter(a => a.id !== attachmentId));
  };

  const downloadAttachment = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Pièces jointes</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">{attachments.length} fichier(s)</span>
          <label className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
            <Camera className="h-4 w-4" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Zone de dépôt */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Glissez-déposez vos fichiers ici ou
        </p>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
          <Paperclip className="h-4 w-4 mr-2" />
          Parcourir
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </label>
        <p className="text-xs text-gray-500 mt-2">
          Formats acceptés : Images, PDF, Documents Word, Texte (max 10MB par fichier)<br/>
          Utilisez le bouton "Photo" pour prendre une photo directement
        </p>
      </div>

      {/* Liste des fichiers */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Fichiers joints :</h4>
          {attachments.map(attachment => (
            <div key={attachment.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-gray-500">
                  {getFileIcon(attachment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadAttachment(attachment)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Supprimer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Limite de taille : 10MB
  if (file.size > 10 * 1024 * 1024) {
    alert(`La photo est trop volumineuse (max 10MB)`);
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const newAttachment: Attachment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: `Photo_${new Date().toISOString().split('T')[0]}_${Date.now()}.jpg`,
      type: 'image/jpeg',
      size: file.size,
      data: event.target?.result as string,
      uploadedAt: new Date()
    };
    
    onAttachmentsChange([...attachments, newAttachment]);
  };
  reader.readAsDataURL(file);
};
export default AttachmentManager;