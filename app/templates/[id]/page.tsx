'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { templates, type Template, type TemplateField } from '@/lib/templates-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  Eye,
  Copy,
} from 'lucide-react';
import Link from 'next/link';

export default function TemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const foundTemplate = templates.find((t) => t.id === templateId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
      // Initialize form data with empty strings
      const initialData: Record<string, string> = {};
      foundTemplate.fields.forEach((field) => {
        initialData[field.id] = '';
      });
      setFormData(initialData);
    }
  }, [templateId]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    template?.fields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!template) return;

    if (validateForm()) {
      const document = template.generateDocument(formData);
      const doc = template.generateDocument(formData);
      setGeneratedDocument(doc);
      setShowPreview(true);
      // Scroll to preview
      setTimeout(() => {
        window.document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      window.document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownload = () => {
    if (!generatedDocument || !template) return;

    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!generatedDocument) return;
    
    try {
      await navigator.clipboard.writeText(generatedDocument);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderField = (field: TemplateField) => {
    const commonProps = {
      id: field.id,
      value: formData[field.id] || '',
      placeholder: field.placeholder,
      className: errors[field.id] ? 'border-red-500' : '',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            rows={4}
          />
        );
      case 'select':
        return (
          <Select value={formData[field.id]} onValueChange={(value) => handleInputChange(field.id, value)}>
            <SelectTrigger className={errors[field.id] ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
    }
  };

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Template Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The template you're looking for doesn't exist.
            </p>
            <Link href="/templates">
              <Button>Browse Templates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/templates">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Fill in all required fields marked with <span className="text-red-500">*</span> to
                  generate your document. Estimated time: {template.estimatedTime}
                </AlertDescription>
              </Alert>

              {template.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="block text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.description && (
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                  )}
                  {renderField(field)}
                  {errors[field.id] && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleGenerate} className="flex-1" size="lg">
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Document
                </Button>
                <Button
                  onClick={() => {
                    const initialData: Record<string, string> = {};
                    template.fields.forEach((field) => {
                      initialData[field.id] = '';
                    });
                    setFormData(initialData);
                    setErrors({});
                    setGeneratedDocument('');
                    setShowPreview(false);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {showPreview && generatedDocument && (
            <Card id="preview-section" className="mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Document Generated
                    </CardTitle>
                    <CardDescription>Review and download your document below</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" size="sm">
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button onClick={handleDownload} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                    {generatedDocument}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                <Badge className="capitalize">{template.difficulty}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Time</p>
                <p className="text-sm font-medium">{template.estimatedTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Number of Fields</p>
                <p className="text-sm font-medium">{template.fields.length} fields</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-yellow-900">
              <p className="mb-2">
                This template is provided for informational purposes only and does not constitute
                legal advice.
              </p>
              <p>
                It is recommended that you consult with a qualified attorney to ensure the document
                meets your specific legal needs and complies with applicable laws.
              </p>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have questions about this template or need assistance:
              </p>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
