import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiChevronDown } from 'react-icons/hi'

import EcommerceMegaMenu from './MegaMenus/EcommerceMegaMenu'
import LearningMegaMenu from './MegaMenus/LearningMegaMenu'
import SaasMegaMenu from './MegaMenus/SaasMegaMenu'
import MediaMegaMenu from './MegaMenus/MediaMegaMenu'
import CommunityMegaMenu from './MegaMenus/CommunityMegaMenu'
import CorporateMegaMenu from './MegaMenus/CorporateMegaMenu'
import PortfolioMegaMenu from './MegaMenus/PortfolioMegaMenu'
import BookingMegaMenu from './MegaMenus/BookingMegaMenu'
import DirectoryMegaMenu from './MegaMenus/DirectoryMegaMenu'
import KnowledgeMegaMenu from './MegaMenus/KnowledgeMegaMenu'

// Dynamic container styles per (category, variant) to guarantee NO two mega menus look alike
const panelContainerStyles = {
    ecommerce: {
        1: 'rounded-none border-b-2 border-black/20 shadow-2xl backdrop-blur-md', // Editorial full-bleed lookbook
        2: 'rounded-none border-2 border-white/25 shadow-[8px_8px_0px_0px_#d6f36a]', // Neo-brutalist dark archive
        3: 'rounded-xl border border-[#e8e4dc] shadow-2xl bg-[#fbfaf8]', // Haute couture maison
        4: 'rounded-none border-t-4 border-[#d6f36a] border-b-2 border-black/40 shadow-2xl bg-[#202315]', // Streetwear circular
        5: 'rounded-2xl border border-[#d8c8ba] shadow-xl bg-[#f5ede4]', // Artisan apothecary
    },
    learning: {
        1: 'rounded-xl border-t-2 border-[#c8ef70] shadow-2xl bg-[#0e272f]', // Academy cohorts
        2: 'rounded-none border-y border-[#d8e2d8] shadow-2xl bg-[#f7f4ed]', // Studio calendar
        3: 'rounded-xl border border-gray-200 shadow-2xl bg-white', // Swiss roadmap
        4: 'rounded-none border-2 border-[#c8ef70] shadow-[6px_6px_0px_0px_#c8ef70] bg-[#11241f]', // Creative lab sandbox
        5: 'rounded-2xl border border-[#3c7e5d] shadow-2xl bg-[#12282e]', // Mentor residency
    },
    saas: {
        1: 'rounded-xl border-t-2 border-[#17a878] shadow-2xl bg-[#0b1319]', // Enterprise suite
        2: 'rounded-none border border-[#263640] shadow-2xl bg-[#0e161c]', // Developer terminal
        3: 'rounded-2xl border border-white/10 shadow-2xl bg-[#121c24]', // Cloud solutions matrix
        4: 'rounded-3xl border border-black/10 backdrop-blur-xl shadow-2xl bg-[#edf3ee]', // Glassmorphism command
        5: 'rounded-none border-y border-[#263640] shadow-2xl bg-[#17232c]', // Modular ecosystem
    },
    media: {
        1: 'rounded-none border-t-2 border-[#a8472b] border-b border-black/20 shadow-2xl bg-[#f2efe9]', // Sunday broadsheet
        2: 'rounded-xl border border-white/20 shadow-2xl bg-[#191919]', // Broadcast audio player
        3: 'rounded-none border-2 border-white shadow-2xl bg-[#121212]', // Gazette high contrast
        4: 'rounded-lg border border-black/15 shadow-xl bg-[#f7f5f2]', // Breaking news wire
        5: 'rounded-none border border-[#443e39] shadow-2xl bg-[#1a1816]', // Art book monograph
    },
    community: {
        1: 'rounded-2xl border-t-2 border-[#ffccad] shadow-2xl bg-[#241c19]', // Guilds & spaces
        2: 'rounded-none border-b-2 border-[#a34c38] shadow-xl bg-[#fcf8f5]', // City chapters
        3: 'rounded-xl border border-white/15 shadow-2xl bg-[#1e1715]', // Trending topic radar
        4: 'rounded-lg border border-[#a34c38] shadow-2xl bg-[#291f1b]', // Peer Q&A
        5: 'rounded-none border border-white/15 shadow-2xl bg-[#1b1513]', // Discord collective
    },
    corporate: {
        1: 'rounded-none border-t-2 border-[#84b9ff] border-b border-white/10 shadow-2xl bg-[#0e1724]', // Global advisory
        2: 'rounded-lg border border-white/20 shadow-2xl bg-[#0b111a]', // Financial terminal
        3: 'rounded-xl border border-white/10 shadow-2xl bg-[#101b2a]', // Quantified case studies
        4: 'rounded-none border-t border-[#3476c5] shadow-2xl bg-[#0d1520]', // Research institute
        5: 'rounded-none border-2 border-[#84b9ff]/40 shadow-2xl bg-[#0a0f17]', // Private capital
    },
    portfolio: {
        1: 'rounded-none border-t-2 border-[#ef6a4b] shadow-2xl bg-[#1c1816]', // Case studies
        2: 'rounded-none border-2 border-white/20 shadow-[6px_6px_0px_0px_#ef6a4b] bg-[#111]', // WebGL shader lab
        3: 'rounded-xl border border-[#ded8cf] shadow-xl bg-[#f9f7f4]', // Typographic manifesto
        4: 'rounded-2xl border border-[#ef6a4b]/50 shadow-2xl bg-[#241d1a]', // Retainer packages
        5: 'rounded-none border border-white/20 shadow-2xl bg-[#181412]', // Contact sheet
    },
    booking: {
        1: 'rounded-2xl border-t-2 border-[#e07d5b] shadow-2xl bg-[#102530]', // Sanctuaries
        2: 'rounded-xl border border-[#d8e2e6] shadow-xl bg-[#f7f5f0]', // Travel search
        3: 'rounded-none border-b-2 border-[#b65f47] shadow-2xl bg-[#14232c]', // Typologies
        4: 'rounded-xl border border-[#e07d5b] shadow-2xl bg-[#1a2d36]', // Experiences
        5: 'rounded-none border-2 border-[#e07d5b] shadow-2xl bg-[#0e1d24]', // Flash escapes
    },
    directory: {
        1: 'rounded-none border-t-2 border-[#d9f064] shadow-2xl bg-[#14201e]', // Verified guilds
        2: 'rounded-xl border border-[#d5e0d7] shadow-xl bg-[#f5f8f5]', // Power filters
        3: 'rounded-lg border border-[#527354] shadow-2xl bg-[#182622]', // Field guides
        4: 'rounded-none border border-white/20 shadow-2xl bg-[#12201c]', // Creative studios
        5: 'rounded-2xl border border-[#527354] shadow-2xl bg-[#1b2b27]', // District walks
    },
    knowledge: {
        1: 'rounded-xl border-t-2 border-[#9bd2a7] shadow-2xl bg-[#0f1a16]', // Developer docs
        2: 'rounded-2xl border border-[#d1e2d7] shadow-xl bg-[#f4f8f5]', // Instant answers
        3: 'rounded-none border-t border-[#41715d] shadow-2xl bg-[#121f1a]', // Trust architecture
        4: 'rounded-lg border border-white/20 shadow-2xl bg-[#101c17]', // Cookbook recipes
        5: 'rounded-none border-y border-[#41715d] shadow-2xl bg-[#172721]', // Support escalation
    },
}

const defaultLabels = {
    ecommerce: {
        1: 'Lookbook Drop',
        2: 'Department Archive',
        3: 'Maison Atelier',
        4: 'Pre-Loved Market',
        5: 'Artisan Provisions',
    },
    learning: {
        1: 'Curriculum Tracks',
        2: 'Live Studio',
        3: 'Career Roadmap',
        4: 'Experiment Lab',
        5: 'Mentorship Residency',
    },
    saas: {
        1: 'Platform Suite',
        2: 'Developers & API',
        3: 'Solutions Matrix',
        4: 'AI Command Center',
        5: 'Integrations',
    },
    media: {
        1: 'Sunday Edition',
        2: 'Broadcast Audio',
        3: 'Gazette Archive',
        4: 'Live Wire Feed',
        5: 'Visual Folios',
    },
    community: {
        1: 'Guilds & Spaces',
        2: 'City Chapters',
        3: 'Topic Radar',
        4: 'Peer Q&A',
        5: 'Discord Hub',
    },
    corporate: {
        1: 'Advisory Practices',
        2: 'Investor Relations',
        3: 'Quantified Impact',
        4: 'Research Institute',
        5: 'Private Capital',
    },
    portfolio: {
        1: 'Selected Works',
        2: 'Shader Laboratory',
        3: 'Design Manifesto',
        4: 'Services & Retainers',
        5: 'Visual Notes',
    },
    booking: {
        1: 'Architectural Stays',
        2: 'Destination Finder',
        3: 'Stays by Typology',
        4: 'Host Experiences',
        5: 'Weekend Escapes',
    },
    directory: {
        1: 'Local Guilds',
        2: 'Power Search',
        3: 'Curated Guides',
        4: 'Verified Studios',
        5: 'District Walks',
    },
    knowledge: {
        1: 'API & SDKs',
        2: 'Self-Service Hub',
        3: 'Trust & Security',
        4: 'Cookbook Recipes',
        5: 'Support SLA',
    },
}

const componentMap = {
    ecommerce: EcommerceMegaMenu,
    learning: LearningMegaMenu,
    saas: SaasMegaMenu,
    media: MediaMegaMenu,
    community: CommunityMegaMenu,
    corporate: CorporateMegaMenu,
    portfolio: PortfolioMegaMenu,
    booking: BookingMegaMenu,
    directory: DirectoryMegaMenu,
    knowledge: KnowledgeMegaMenu,
}

const MegaMenu = ({
    category = 'ecommerce',
    variant = 1,
    label,
    accent,
    triggerClassName = '',
    className = '',
}) => {
    const [open, setOpen] = useState(false)
    const [panelPosition, setPanelPosition] = useState(null)
    const triggerRef = useRef(null)
    const panelRef = useRef(null)
    const closeTimerRef = useRef(null)

    const normalizedVariant = ((variant - 1) % 5) + 1
    const menuLabel =
        label ||
        defaultLabels[category]?.[normalizedVariant] ||
        'Explore'

    const Component = componentMap[category] || EcommerceMegaMenu
    const containerStyle =
        panelContainerStyles[category]?.[normalizedVariant] ||
        'rounded-xl border border-black/10 shadow-2xl'

    const updatePanelPosition = () => {
        const header = triggerRef.current?.closest('header')
        if (!header) return

        const bounds = header.getBoundingClientRect()
        // If container is full-bleed sharp (like variant 1 or 2 in certain themes), make it flush
        const isFlush = containerStyle.includes('rounded-none') && containerStyle.includes('border-b')
        const width = isFlush ? Math.min(bounds.width, window.innerWidth) : Math.min(bounds.width, window.innerWidth - 32)
        const left = isFlush ? bounds.left : Math.min(
            Math.max(bounds.left, 16),
            window.innerWidth - width - 16,
        )

        setPanelPosition({
            top: isFlush ? bounds.bottom : bounds.bottom + 6,
            left,
            width,
        })
    }

    useLayoutEffect(() => {
        if (!open) return undefined

        updatePanelPosition()
        window.addEventListener('resize', updatePanelPosition)
        window.addEventListener('scroll', updatePanelPosition, true)

        return () => {
            window.removeEventListener('resize', updatePanelPosition)
            window.removeEventListener('scroll', updatePanelPosition, true)
        }
    }, [open])

    const cancelClose = () => {
        window.clearTimeout(closeTimerRef.current)
    }

    const scheduleClose = () => {
        cancelClose()
        closeTimerRef.current = window.setTimeout(() => setOpen(false), 160)
    }

    const closeMenu = () => {
        cancelClose()
        setOpen(false)
    }

    const handleBlur = (event) => {
        if (
            !triggerRef.current?.contains(event.relatedTarget) &&
            !panelRef.current?.contains(event.relatedTarget)
        ) {
            scheduleClose()
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') closeMenu()
    }

    return (
        <div
            ref={triggerRef}
            className={`relative z-40 inline-flex items-center self-center ${className}`}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => {
                cancelClose()
                setOpen(true)
            }}
            onBlurCapture={handleBlur}
            onKeyDown={handleKeyDown}
        >
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="true"
                aria-controls={`mega-menu-${category}-${variant}`}
                className={
                    triggerClassName ||
                    'group inline-flex items-center gap-1 leading-normal transition-colors cursor-pointer hover:opacity-75 focus-visible:outline-none'
                }
                style={accent ? { '--accent-color': accent } : undefined}
                onClick={() => {
                    cancelClose()
                    setOpen((value) => !value)
                }}
            >
                <span>{menuLabel}</span>
                <HiChevronDown
                    aria-hidden="true"
                    className={`h-3 w-3 shrink-0 transition-transform duration-300 ease-out ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open &&
                panelPosition &&
                createPortal(
                    <div
                        ref={panelRef}
                        id={`mega-menu-${category}-${variant}`}
                        aria-hidden={!open}
                        className={`fixed z-[9999] overflow-auto transition-[opacity,transform] duration-300 ease-out ${containerStyle}`}
                        style={{
                            top: panelPosition.top,
                            left: panelPosition.left,
                            width: panelPosition.width,
                            maxHeight: `calc(100vh - ${panelPosition.top}px - 16px)`,
                            transformOrigin: 'top center',
                        }}
                        onMouseEnter={() => {
                            cancelClose()
                            setOpen(true)
                        }}
                        onMouseLeave={scheduleClose}
                        onBlurCapture={handleBlur}
                        onKeyDown={handleKeyDown}
                    >
                        <Component
                            variant={normalizedVariant}
                            closeMenu={closeMenu}
                            accent={accent}
                        />
                    </div>,
                    document.body,
                )}
        </div>
    )
}

export default MegaMenu
