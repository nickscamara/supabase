import { useParams } from 'common'
import { OngoingQueriesPanel } from 'components/interfaces/SQLEditor/OngoingQueriesPanel'
import { usePathname } from 'next/navigation'
import { ComponentProps, ReactNode, useState } from 'react'
import { cn } from 'ui'
import { ProjectLayoutWithAuth } from '../ProjectLayout/ProjectLayout'
import { CollapseButton } from '../tabs/collapse-button'
import { ExplorerTabs } from '../tabs/explorer-tabs'
import { useFeaturePreviewContext } from 'components/interfaces/App/FeaturePreview/FeaturePreviewContext'
import { LOCAL_STORAGE_KEYS } from 'lib/constants'
import { useEditorType } from './editors-layout.hooks'

export interface ExplorerLayoutProps extends ComponentProps<typeof ProjectLayoutWithAuth> {
  children: ReactNode
  hideTabs?: boolean
}

export const EditorBaseLayout = ({ children, ...props }: ExplorerLayoutProps) => {
  const { ref } = useParams()
  const pathname = usePathname()
  const [showOngoingQueries, setShowOngoingQueries] = useState(false)

  // tabs preview flag logic
  const editor = useEditorType()
  const { flags } = useFeaturePreviewContext()
  const tableEditorTabsEnabled =
    editor === 'table' && flags[LOCAL_STORAGE_KEYS.UI_TABLE_EDITOR_TABS]
  const sqlEditorTabsEnabled = editor === 'sql' && flags[LOCAL_STORAGE_KEYS.UI_SQL_EDITOR_TABS]
  const hideTabs = pathname === `/project/${ref}/editor` || pathname === `/project/${ref}/sql`
  // end of tabs preview flag logic

  return (
    <ProjectLayoutWithAuth resizableSidebar={true} {...props}>
      <div className="flex flex-col h-full">
        {tableEditorTabsEnabled || sqlEditorTabsEnabled ? (
          <div
            className={cn(
              'h-10 flex items-center',
              !hideTabs ? 'bg-surface-200 dark:bg-alternative' : 'bg-surface-100'
            )}
          >
            {hideTabs && <CollapseButton hideTabs={hideTabs} />}
            {!hideTabs && <ExplorerTabs storeKey="explorer" />}
          </div>
        ) : null}
        <div className="h-full">{children}</div>
      </div>
      <OngoingQueriesPanel
        visible={showOngoingQueries}
        onClose={() => setShowOngoingQueries(false)}
      />
    </ProjectLayoutWithAuth>
  )
}
