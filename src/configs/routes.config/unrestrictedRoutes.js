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
    {
        key: 'uiComponent.common.pageSections',
        path: '/page-sections',
        component: lazy(
            () => import('@/views/ui-components/common/PageSections'),
        ),
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.common.formComponents',
        path: '/form-components',
        component: lazy(
            () => import('@/views/ui-components/common/FormComponents'),
        ),
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
]

export default unrestrictedRoutes
