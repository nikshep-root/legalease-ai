'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle, Download } from 'lucide-react';
import type { DocumentAnalysis } from '@/lib/document-processor';

interface SmartTimelineProps {
  analysis: DocumentAnalysis;
}

export function SmartTimeline({ analysis }: SmartTimelineProps) {
  // Process deadlines and obligations into timeline events
  const timelineEvents = [
    ...analysis.deadlines.map(deadline => ({
      type: 'deadline' as const,
      title: deadline.description,
      date: deadline.date || 'TBD',
      consequence: deadline.consequence,
      priority: deadline.date ? 'high' : 'medium',
    })),
    ...analysis.obligations
      .filter(obligation => obligation.deadline)
      .map(obligation => ({
        type: 'obligation' as const,
        title: `${obligation.party}: ${obligation.description}`,
        date: obligation.deadline || 'TBD',
        consequence: 'Obligation not fulfilled',
        priority: 'medium' as const,
      })),
  ];

  // Sort by date (TBD at the end)
  const sortedEvents = timelineEvents.sort((a, b) => {
    if (a.date === 'TBD') return 1;
    if (b.date === 'TBD') return -1;
    
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    } catch {
      return 0;
    }
  });

  const getDaysUntil = (dateStr: string) => {
    if (dateStr === 'TBD') return null;
    try {
      const targetDate = new Date(dateStr);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const getUrgencyColor = (daysUntil: number | null) => {
    if (daysUntil === null) return 'bg-gray-500';
    if (daysUntil < 0) return 'bg-red-600';
    if (daysUntil <= 7) return 'bg-red-500';
    if (daysUntil <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUrgencyLabel = (daysUntil: number | null) => {
    if (daysUntil === null) return 'Date TBD';
    if (daysUntil < 0) return 'OVERDUE';
    if (daysUntil === 0) return 'TODAY';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil <= 7) return `${daysUntil} days`;
    if (daysUntil <= 30) return `${Math.ceil(daysUntil / 7)} weeks`;
    return `${Math.ceil(daysUntil / 30)} months`;
  };

  const exportToCalendar = () => {
    // Create iCal format
    let icalContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LegalEase AI//Timeline//EN\nCALSCALE:GREGORIAN\n';
    
    sortedEvents.forEach((event, index) => {
      if (event.date && event.date !== 'TBD') {
        try {
          const eventDate = new Date(event.date);
          const dateStr = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          
          icalContent += `BEGIN:VEVENT\n`;
          icalContent += `UID:legalease-${index}-${Date.now()}@legalease.ai\n`;
          icalContent += `DTSTAMP:${dateStr}\n`;
          icalContent += `DTSTART:${dateStr}\n`;
          icalContent += `SUMMARY:${event.title}\n`;
          icalContent += `DESCRIPTION:${event.consequence || 'No description'}\n`;
          icalContent += `STATUS:CONFIRMED\n`;
          icalContent += `BEGIN:VALARM\n`;
          icalContent += `TRIGGER:-P1D\n`;
          icalContent += `ACTION:DISPLAY\n`;
          icalContent += `DESCRIPTION:Reminder: ${event.title}\n`;
          icalContent += `END:VALARM\n`;
          icalContent += `END:VEVENT\n`;
        } catch (error) {
          console.error('Error formatting date:', error);
        }
      }
    });
    
    icalContent += 'END:VCALENDAR';
    
    // Download
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'legal-deadlines.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (sortedEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Smart Timeline
          </CardTitle>
          <CardDescription>No deadlines or time-sensitive obligations found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>This document contains no specific deadlines or time-bound obligations.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Smart Timeline
            </CardTitle>
            <CardDescription>All deadlines and time-sensitive obligations</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportToCalendar}>
            <Download className="w-4 h-4 mr-2" />
            Export to Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Timeline events */}
          <div className="space-y-6">
            {sortedEvents.map((event, index) => {
              const daysUntil = getDaysUntil(event.date);
              const urgencyColor = getUrgencyColor(daysUntil);
              const urgencyLabel = getUrgencyLabel(daysUntil);
              const isOverdue = daysUntil !== null && daysUntil < 0;
              const isUpcoming = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;

              return (
                <div key={index} className="relative flex items-start gap-4 pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full ${urgencyColor} border-4 border-background`} />
                  
                  {/* Event card */}
                  <div className={`flex-1 p-4 rounded-lg border ${isOverdue ? 'bg-red-50 dark:bg-red-950/20 border-red-200' : isUpcoming ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200' : 'bg-card'}`}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={event.type === 'deadline' ? 'destructive' : 'default'}>
                            {event.type === 'deadline' ? 'Deadline' : 'Obligation'}
                          </Badge>
                          {(isOverdue || isUpcoming) && (
                            <Badge variant="outline" className={isOverdue ? 'border-red-600 text-red-600' : 'border-yellow-600 text-yellow-600'}>
                              {isOverdue ? (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  OVERDUE
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  URGENT
                                </>
                              )}
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold">{event.title}</h4>
                        {event.consequence && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Consequence:</strong> {event.consequence}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      {daysUntil !== null && (
                        <Badge variant="secondary" className={urgencyColor.replace('bg-', 'text-')}>
                          {urgencyLabel}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{sortedEvents.length}</div>
            <div className="text-xs text-muted-foreground">Total Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {sortedEvents.filter(e => {
                const days = getDaysUntil(e.date);
                return days !== null && days < 0;
              }).length}
            </div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {sortedEvents.filter(e => {
                const days = getDaysUntil(e.date);
                return days !== null && days >= 0 && days <= 7;
              }).length}
            </div>
            <div className="text-xs text-muted-foreground">Next 7 Days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
