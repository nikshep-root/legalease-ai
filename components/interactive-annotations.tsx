'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Plus, 
  X, 
  Edit2, 
  Trash2, 
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  Flag,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import type { DocumentAnalysis } from '@/lib/document-processor';

interface Annotation {
  id: string;
  text: string;
  note: string;
  type: 'concern' | 'question' | 'approval' | 'flag';
  timestamp: Date;
  author: string;
}

interface InteractiveAnnotationsProps {
  analysis: DocumentAnalysis;
  documentId: string;
}

export function InteractiveAnnotations({ analysis, documentId }: InteractiveAnnotationsProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newType, setNewType] = useState<Annotation['type']>('concern');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [filterType, setFilterType] = useState<'all' | Annotation['type']>('all');
  const [showAnnotations, setShowAnnotations] = useState(true);

  // Load annotations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`annotations-${documentId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setAnnotations(parsed.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      })));
    }
  }, [documentId]);

  // Save annotations to localStorage
  const saveAnnotations = (newAnnotations: Annotation[]) => {
    localStorage.setItem(`annotations-${documentId}`, JSON.stringify(newAnnotations));
    setAnnotations(newAnnotations);
  };

  const addAnnotation = () => {
    if (!selectedText || !newNote.trim()) return;

    const annotation: Annotation = {
      id: `${Date.now()}-${Math.random()}`,
      text: selectedText,
      note: newNote.trim(),
      type: newType,
      timestamp: new Date(),
      author: 'You', // In real app, get from auth
    };

    saveAnnotations([...annotations, annotation]);
    setShowAddModal(false);
    setNewNote('');
    setSelectedText('');
  };

  const deleteAnnotation = (id: string) => {
    saveAnnotations(annotations.filter(a => a.id !== id));
  };

  const startEdit = (annotation: Annotation) => {
    setEditingId(annotation.id);
    setEditNote(annotation.note);
  };

  const saveEdit = (id: string) => {
    saveAnnotations(
      annotations.map(a =>
        a.id === id ? { ...a, note: editNote.trim() } : a
      )
    );
    setEditingId(null);
    setEditNote('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNote('');
  };

  const exportAnnotations = () => {
    const exportData = {
      documentId,
      documentTitle: analysis.summary || 'Document',
      exportDate: new Date().toISOString(),
      annotations: annotations.map(a => ({
        text: a.text,
        note: a.note,
        type: a.type,
        timestamp: a.timestamp.toISOString(),
        author: a.author,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `annotations-${documentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'concern':
        return <AlertCircle className="w-4 h-4" />;
      case 'question':
        return <MessageSquare className="w-4 h-4" />;
      case 'approval':
        return <CheckCircle className="w-4 h-4" />;
      case 'flag':
        return <Flag className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Annotation['type']) => {
    switch (type) {
      case 'concern':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400';
      case 'question':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400';
      case 'approval':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400';
      case 'flag':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400';
    }
  };

  const getTypeBadge = (type: Annotation['type']) => {
    const colors = {
      concern: 'bg-red-600',
      question: 'bg-blue-600',
      approval: 'bg-green-600',
      flag: 'bg-yellow-600',
    };
    return <Badge className={colors[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  const filteredAnnotations = annotations.filter(a =>
    filterType === 'all' || a.type === filterType
  );

  const typeCounts = {
    concern: annotations.filter(a => a.type === 'concern').length,
    question: annotations.filter(a => a.type === 'question').length,
    approval: annotations.filter(a => a.type === 'approval').length,
    flag: annotations.filter(a => a.type === 'flag').length,
  };

  // Generate clickable text sections from clauses and risks
  const textSections = [
    ...analysis.importantClauses.map(c => ({ text: c.title, category: 'clause' })),
    ...analysis.risks.map(r => ({ text: r.description, category: 'risk' })),
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Interactive Annotations
            </CardTitle>
            <CardDescription>
              Click on text to add personal notes, highlights, and collaborative reviews
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnnotations(!showAnnotations)}
            >
              {showAnnotations ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showAnnotations ? 'Hide' : 'Show'}
            </Button>
            {annotations.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportAnnotations}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{typeCounts.concern}</span>
            </div>
            <p className="text-xs text-muted-foreground">Concerns</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{typeCounts.question}</span>
            </div>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{typeCounts.approval}</span>
            </div>
            <p className="text-xs text-muted-foreground">Approvals</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flag className="w-5 h-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{typeCounts.flag}</span>
            </div>
            <p className="text-xs text-muted-foreground">Flags</p>
          </div>
        </div>

        {showAnnotations && (
          <>
            {/* Clickable Text Sections */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Click on any section below to add an annotation:
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                {textSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedText(section.text);
                      setShowAddModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm flex items-start gap-2 group"
                  >
                    <Badge variant="outline" className="flex-shrink-0 mt-0.5">
                      {section.category}
                    </Badge>
                    <span className="flex-1 group-hover:text-primary transition-colors">
                      {section.text}
                    </span>
                    <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Add Annotation Modal */}
            {showAddModal && (
              <div className="mb-6 p-4 border-2 border-primary rounded-lg bg-primary/5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Annotation
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedText('');
                      setNewNote('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Selected Text:</label>
                    <div className="p-2 bg-muted rounded text-sm italic">"{selectedText}"</div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block">Annotation Type:</label>
                    <Select value={newType} onValueChange={(value: any) => setNewType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concern">🔴 Concern - Something worrying</SelectItem>
                        <SelectItem value="question">🔵 Question - Need clarification</SelectItem>
                        <SelectItem value="approval">🟢 Approval - Looks good</SelectItem>
                        <SelectItem value="flag">🟡 Flag - Follow up later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block">Your Note:</label>
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add your comment or observation..."
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          addAnnotation();
                        }
                      }}
                    />
                  </div>

                  <Button onClick={addAnnotation} className="w-full" disabled={!newNote.trim()}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Annotation
                  </Button>
                </div>
              </div>
            )}

            {/* Filter */}
            {annotations.length > 0 && (
              <div className="mb-4">
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Annotations ({annotations.length})</SelectItem>
                    <SelectItem value="concern">Concerns ({typeCounts.concern})</SelectItem>
                    <SelectItem value="question">Questions ({typeCounts.question})</SelectItem>
                    <SelectItem value="approval">Approvals ({typeCounts.approval})</SelectItem>
                    <SelectItem value="flag">Flags ({typeCounts.flag})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Annotations List */}
            <div className="space-y-3">
              {filteredAnnotations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No annotations yet. Click on any section above to add your first note.</p>
                </div>
              )}

              {filteredAnnotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className={`border-2 rounded-lg p-4 ${getTypeColor(annotation.type)}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(annotation.type)}
                      {getTypeBadge(annotation.type)}
                    </div>
                    <div className="flex items-center gap-1">
                      {editingId !== annotation.id && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(annotation)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAnnotation(annotation.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-2 p-2 bg-background/50 rounded text-sm italic">
                    "{annotation.text}"
                  </div>

                  {editingId === annotation.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(annotation.id)}>
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm mb-2">{annotation.note}</p>
                      <div className="flex items-center gap-2 text-xs opacity-70">
                        <span>{annotation.author}</span>
                        <span>•</span>
                        <span>{annotation.timestamp.toLocaleDateString()}</span>
                        <span>{annotation.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tips */}
        {annotations.length === 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Annotation Tips
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-600">🔴</span>
                <span><strong>Concern:</strong> Mark problematic clauses or risky terms that need attention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">🔵</span>
                <span><strong>Question:</strong> Flag sections that need clarification from legal counsel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">🟢</span>
                <span><strong>Approval:</strong> Indicate terms you're comfortable with and approve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">🟡</span>
                <span><strong>Flag:</strong> Bookmark items to revisit or discuss later</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
