import { lazy } from 'react'
const unrestrictedRoutes = [
    {
        key: 'uiComponent.common.sectionDesigns',
        path: '/design-studio',
        component: lazy(
            () => import('@/views/ui-components/common/SectionDesigns'),
        ),
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
]

export default unrestrictedRoutes
