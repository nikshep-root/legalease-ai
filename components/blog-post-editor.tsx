'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Send, X, Plus, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BlogPostEditorProps {
  initialData?: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    coverImage?: string;
    status: 'draft' | 'published';
  };
  onSave: (data: BlogPostData) => Promise<void>;
  onCancel?: () => void;
}

export interface BlogPostData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  status: 'draft' | 'published';
}

const CATEGORIES = [
  'Contract Law',
  'Intellectual Property',
  'Employment Law',
  'Real Estate',
  'Corporate Law',
  'Privacy & Data',
  'Compliance',
  'General Legal',
  'Tips & Guides',
];

export function BlogPostEditor({ initialData, onSave, onCancel }: BlogPostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim() || !content.trim() || !category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        coverImage: coverImage || undefined,
        status,
      });
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>✍️ {initialData ? 'Edit' : 'Create New'} Blog Post</span>
            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('published')}
                disabled={isSaving}
              >
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              className="text-2xl font-bold"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/200 characters</p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-sm font-medium mb-2 block">Cover Image URL (Optional)</label>
            <div className="flex gap-2">
              <Input
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setImageError(false);
                  setImageLoading(true);
                }}
                placeholder="https://example.com/image.jpg"
              />
              <Button 
                variant="outline" 
                size="icon"
                type="button"
                onClick={() => {
                  const input = prompt('Enter image URL:');
                  if (input) {
                    setCoverImage(input);
                    setImageError(false);
                    setImageLoading(true);
                  }
                }}
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
            {coverImage && !imageError && (
              <div className="mt-2 relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Loading image...</p>
                  </div>
                )}
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="rounded-lg max-h-48 w-full object-cover"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
              </div>
            )}
            {imageError && (
              <div className="mt-2 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                ⚠️ Failed to load image. Please check the URL and try again.
              </div>
            )}
          </div>

          {/* Category & Tags */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Category <span className="text-red-500">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags (Max 5)</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag..."
                  disabled={tags.length >= 5}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddTag}
                  disabled={tags.length >= 5 || !tagInput.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Content <span className="text-red-500">*</span>
              <span className="text-muted-foreground font-normal ml-2">(Markdown supported)</span>
            </label>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="write">
                  ✍️ Write
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-0">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here... (Markdown supported)

**Tips:**
- Use **bold** or *italic* for emphasis
- Create # Headings
- Add `code blocks`
- Insert [links](url)
- Add > blockquotes
- Create - bullet lists
"
                  className="w-full min-h-[500px] p-4 border rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {content.length} characters • Estimated reading time: {Math.ceil(content.split(' ').length / 200)} min
                </p>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="border rounded-lg p-6 min-h-[500px] prose prose-slate dark:prose-invert max-w-none">
                  {content ? (
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground italic">Nothing to preview yet. Start writing!</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Markdown Cheatsheet */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">📝 Markdown Cheatsheet</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-semibold mb-1">Headings:</p>
                <code># H1 ## H2 ### H3</code>
              </div>
              <div>
                <p className="font-semibold mb-1">Emphasis:</p>
                <code>**bold** *italic*</code>
              </div>
              <div>
                <p className="font-semibold mb-1">Lists:</p>
                <code>- item or 1. item</code>
              </div>
              <div>
                <p className="font-semibold mb-1">Links:</p>
                <code>[text](url)</code>
              </div>
              <div>
                <p className="font-semibold mb-1">Code:</p>
                <code>`inline` or ```block```</code>
              </div>
              <div>
                <p className="font-semibold mb-1">Quote:</p>
                <code>&gt; blockquote</code>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
