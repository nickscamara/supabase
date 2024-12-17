import { motion, AnimatePresence } from 'framer-motion'
import {
  TooltipProvider_Shadcn_,
  Tooltip_Shadcn_,
  TooltipTrigger_Shadcn_,
  TooltipContent_Shadcn_,
} from 'ui'
import { User2, File, Database, Zap, Clock, ListOrdered, Box } from 'lucide-react'
import { SchemaVisualizer } from 'components/interfaces/SchemaVisualizer'
import Globe from 'components/ui/Globe'
import { AWS_REGIONS, FLY_REGIONS } from 'shared-data'
import { BASE_PATH } from 'lib/constants'

interface SupabaseService {
  name: 'Auth' | 'Storage' | 'Database' | 'Edge Function' | 'Cron' | 'Queues' | 'Vector'
  reason: string
}

interface ProjectVisualProps {
  sqlStatements: string[]
  services: SupabaseService[]
  selectedRegion: {
    name: string
    location: { latitude: number; longitude: number }
    displayName: string
  } | null
  projectDetails: {
    dbRegion: string
    cloudProvider: string
    computeSize: string
    postgresVersion: string
  }
  instanceLabel: (size: string) => string
}

export const ProjectVisual = ({
  sqlStatements,
  services,
  selectedRegion,
  projectDetails,
  instanceLabel,
}: ProjectVisualProps) => {
  return (
    <div className="flex h-full flex-1">
      <div className="flex-1 h-full relative">
        <motion.div
          key="info"
          transition={{
            duration: 1.25,
            ease: 'easeInOut',
          }}
          className={`absolute z-30 p-4 bg-surface-100 min-w-80 rounded-lg border shadow-lg`}
          initial={false}
          animate={
            sqlStatements.length > 0
              ? {
                  top: '3%',
                  right: '3%',
                  x: '0%',
                  y: '0%',
                }
              : {
                  top: '50%',
                  right: '50%',
                  x: '50%',
                  y: '-50%',
                }
          }
        >
          <div className="flex items-start justify-between w-80">
            <div className="flex gap-x-3">
              <div className="flex flex-col gap-y-0.5">
                <p className="text-sm">Primary Database</p>
                <p className="flex items-center gap-x-1">
                  <span className="text-sm text-foreground-light">{projectDetails.dbRegion}</span>
                </p>
                <p className="flex items-center gap-x-1">
                  <span className="text-sm text-foreground-light">
                    {projectDetails.cloudProvider}
                  </span>
                  <span className="text-sm text-foreground-light">•</span>
                  <span className="text-sm text-foreground-light">
                    {instanceLabel(projectDetails.computeSize)}
                  </span>
                  <span className="text-sm text-foreground-light">•</span>
                  <span className="text-sm text-foreground-light">
                    {projectDetails.postgresVersion}
                  </span>
                </p>
              </div>
            </div>
            {selectedRegion && (
              <img
                alt="region icon"
                className="w-8 rounded-sm mt-0.5"
                src={`${BASE_PATH}/img/regions/${selectedRegion.name}.svg`}
              />
            )}
          </div>

          <TooltipProvider_Shadcn_>
            <div className="flex gap-2 mt-4">
              {[
                { name: 'Auth', icon: User2 },
                { name: 'Storage', icon: File },
                { name: 'Database', icon: Database },
                { name: 'Edge Function', icon: Zap },
                { name: 'Cron', icon: Clock },
                { name: 'Queues', icon: ListOrdered },
                { name: 'Vector', icon: Box },
              ].map((service) => {
                const enabledService = services.find((s) => s.name === service.name)
                const isEnabled = !!enabledService
                return (
                  <Tooltip_Shadcn_ key={service.name} delayDuration={100}>
                    <TooltipTrigger_Shadcn_ asChild>
                      <div
                        className={`
                            flex items-center justify-center w-10 h-10 border rounded cursor-help
                            ${isEnabled ? 'border-brand-600 text-brand-600' : 'text-foreground-lighter'}
                          `}
                      >
                        <service.icon size={16} strokeWidth={2} />
                      </div>
                    </TooltipTrigger_Shadcn_>
                    <TooltipContent_Shadcn_>
                      {isEnabled ? `${service.name}: ${enabledService.reason}` : service.name}
                    </TooltipContent_Shadcn_>
                  </Tooltip_Shadcn_>
                )
              })}
            </div>
          </TooltipProvider_Shadcn_>
        </motion.div>

        <motion.div
          layout
          layoutId="globe"
          className="absolute z-10 pointer-events-none aspect-square right-0"
          initial={false}
          animate={{
            x: sqlStatements.length > 0 ? '25%' : '25%',
            opacity: 1,
            width: sqlStatements.length > 0 ? '60%' : '100%',
            top: sqlStatements.length > 0 ? '0' : '50%',
            y: sqlStatements.length > 0 ? '-35%' : '-50%',
          }}
          transition={{
            duration: 1.25,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-[10%] bg-background-200 rounded-full" />
          <div
            className="absolute inset-0"
            style={{ maskImage: 'linear-gradient(to top right, black, transparent 50%)' }}
          >
            <Globe
              currentLocation={selectedRegion?.location}
              markers={[
                ...Object.values(AWS_REGIONS).map((region) => region.location),
                ...Object.values(FLY_REGIONS).map((region) => region.location),
              ]}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {sqlStatements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 1 } }}
              exit={{ opacity: 0 }}
              className="h-full z-20"
            >
              <SchemaVisualizer sqlStatements={sqlStatements} className="h-full z-20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
