'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function LeadQualificationSection({ config, setConfig }) {
  const updateQualification = (field, value) => {
    setConfig({
      ...config,
      qualification: {
        ...config.qualification,
        [field]: value
      }
    });
  };

  const addCriteria = () => {
    const criteria = config.qualification?.criteria || [];
    updateQualification('criteria', [
      ...criteria,
      { id: Date.now(), question: '', weight: 10 }
    ]);
  };

  const updateCriteria = (id, field, value) => {
    const criteria = config.qualification?.criteria || [];
    updateQualification(
      'criteria',
      criteria.map(c => c.id === id ? { ...c, [field]: value } : c)
    );
  };

  const deleteCriteria = (id) => {
    const criteria = config.qualification?.criteria || [];
    updateQualification('criteria', criteria.filter(c => c.id !== id));
  };

  const addDisqualificationRule = () => {
    const rules = config.qualification?.disqualificationRules || [];
    updateQualification('disqualificationRules', [
      ...rules,
      { id: Date.now(), condition: '', message: '' }
    ]);
  };

  const updateDisqualificationRule = (id, field, value) => {
    const rules = config.qualification?.disqualificationRules || [];
    updateQualification(
      'disqualificationRules',
      rules.map(r => r.id === id ? { ...r, [field]: value } : r)
    );
  };

  const deleteDisqualificationRule = (id) => {
    const rules = config.qualification?.disqualificationRules || [];
    updateQualification('disqualificationRules', rules.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Enable Qualification */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Qualification</CardTitle>
          <CardDescription>Automatically score and qualify leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Lead Qualification</Label>
              <p className="text-sm text-muted-foreground">
                Score leads based on their responses
              </p>
            </div>
            <Switch
              checked={config.qualification?.enabled || false}
              onCheckedChange={(checked) => updateQualification('enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {config.qualification?.enabled && (
        <>
          {/* Qualification Criteria */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Qualification Criteria</CardTitle>
                  <CardDescription>Add questions that determine lead quality</CardDescription>
                </div>
                <Button onClick={addCriteria} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Criteria
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!config.qualification?.criteria || config.qualification.criteria.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No criteria added yet. Click "Add Criteria" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {config.qualification.criteria.map((criteria) => (
                    <Card key={criteria.id} className="border-2">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Question / Criteria</Label>
                              <Input
                                placeholder="e.g., What is your budget range?"
                                value={criteria.question}
                                onChange={(e) => updateCriteria(criteria.id, 'question', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Weight (Points)</Label>
                              <Input
                                type="number"
                                placeholder="10"
                                value={criteria.weight}
                                onChange={(e) => updateCriteria(criteria.id, 'weight', parseInt(e.target.value))}
                              />
                              <p className="text-xs text-muted-foreground">
                                Higher weight = more important criteria
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCriteria(criteria.id)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scoring System */}
          <Card>
            <CardHeader>
              <CardTitle>Scoring System</CardTitle>
              <CardDescription>Configure how leads are scored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Scoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Assign quality scores to leads
                  </p>
                </div>
                <Switch
                  checked={config.qualification?.scoringEnabled || false}
                  onCheckedChange={(checked) => updateQualification('scoringEnabled', checked)}
                />
              </div>

              {config.qualification?.scoringEnabled && (
                <div className="space-y-2">
                  <Label>Qualification Threshold</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={config.qualification?.qualificationThreshold || ''}
                    onChange={(e) => updateQualification('qualificationThreshold', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum score required to be considered "qualified"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disqualification Rules */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Disqualification Rules</CardTitle>
                  <CardDescription>Automatically reject unqualified leads</CardDescription>
                </div>
                <Button onClick={addDisqualificationRule} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!config.qualification?.disqualificationRules || config.qualification.disqualificationRules.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No disqualification rules added.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {config.qualification.disqualificationRules.map((rule) => (
                    <Card key={rule.id} className="border-2">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Condition</Label>
                              <Input
                                placeholder="e.g., Budget < $1000, Outside service area"
                                value={rule.condition}
                                onChange={(e) => updateDisqualificationRule(rule.id, 'condition', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Disqualification Message</Label>
                              <Textarea
                                placeholder="Thank you for your interest. Unfortunately, we're unable to serve your needs at this time..."
                                value={rule.message}
                                onChange={(e) => updateDisqualificationRule(rule.id, 'message', e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDisqualificationRule(rule.id)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
