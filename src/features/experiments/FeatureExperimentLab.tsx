import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useExperimentsStore } from '@/store/experimentsStore'
import { FlaskConical, Trash2, BarChart3 } from 'lucide-react'

export function FeatureExperimentLab() {
  const { experiments, toggleExperiment, updateRollout, deleteExperiment } =
    useExperimentsStore()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Feature Experiment Lab</h1>
        <p className="mt-2 text-muted-foreground">
          Manage feature flags and A/B experiments
        </p>
      </motion.div>

      <div className="grid gap-6">
        {experiments.map((experiment, index) => (
          <motion.div
            key={experiment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        experiment.enabled
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <FlaskConical className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {experiment.name}
                        <Badge
                          variant={
                            experiment.status === 'running'
                              ? 'success'
                              : experiment.status === 'draft'
                              ? 'secondary'
                              : experiment.status === 'paused'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {experiment.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {experiment.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={experiment.enabled}
                      onCheckedChange={() => toggleExperiment(experiment.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExperiment(experiment.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Rollout Control */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rollout Percentage</span>
                      <span className="text-sm font-mono text-muted-foreground">
                        {experiment.rolloutPercentage}%
                      </span>
                    </div>
                    <Slider
                      value={experiment.rolloutPercentage}
                      onValueChange={(value) =>
                        updateRollout(experiment.id, value)
                      }
                      min={0}
                      max={100}
                      step={5}
                      disabled={!experiment.enabled}
                    />
                  </div>

                  {/* Variants */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {experiment.variants.map((variant, i) => (
                      <div
                        key={variant.name}
                        className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{variant.name}</span>
                          </div>
                          <Badge variant="outline">{variant.percentage}%</Badge>
                        </div>
                        {experiment.metrics.impressions > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Conversions</span>
                              <span>
                                {experiment.metrics.conversions.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Impressions</span>
                              <span>
                                {experiment.metrics.impressions.toLocaleString()}
                              </span>
                            </div>
                            <div className="pt-2">
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary transition-all duration-300"
                                  style={{
                                    width: `${
                                      (experiment.metrics.conversions /
                                        experiment.metrics.impressions) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Conversion rate:{' '}
                                {(
                                  (experiment.metrics.conversions /
                                    experiment.metrics.impressions) *
                                  100
                                ).toFixed(2)}
                                %
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
