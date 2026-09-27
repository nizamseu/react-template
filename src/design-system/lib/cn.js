import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional className inputs and resolve Tailwind conflicts.
 * Always use this instead of manual string concatenation.
 */
export function cn(...inputs) {
    return twMerge(classNames(inputs))
}

export default cn
