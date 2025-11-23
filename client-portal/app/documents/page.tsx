'use client';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDocuments, useUploadDocument } from '@/lib/api/queries';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatFileSize, formatRelativeTime } from '@/lib/utils';
import { FileText, Upload, Download, Search } from 'lucide-react';

export default function DocumentsPage() {
  const { user } = useAuthStore();
  const projectId = user?.projectId || '';
  const { data: documents, isLoading } = useDocuments(projectId);
  const uploadMutation = useUploadDocument(projectId);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredDocs = documents?.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      uploadMutation.mutate({
        name: file.name,
        phase: 'REQUIREMENTS',
        file,
      });
      setSelectedFile(null);
    }
  };

  const canUpload = ['PM', 'ADMIN'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Documents</h1>
        {canUpload && (
          <label className="cursor-pointer">
            <Button variant="primary">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Documents List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            {filteredDocs?.length ? (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">{doc.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default">{doc.phase}</Badge>
                          <span className="text-sm text-gray-400">v{doc.version}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-400">{formatFileSize(doc.fileSize)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded {formatRelativeTime(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">
                {search ? 'No documents found' : 'No documents uploaded yet'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
