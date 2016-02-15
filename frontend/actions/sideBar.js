export const SIDEBAR_SHOW = 'SIDEBAR_SHOW';
export const SIDEBAR_HIDE = 'SIDEBAR_HIDE';
export const SIDEBAR_TOGGLE = 'SIDEBAR_TOGGLE';
export const SIDEBAR_ENABLE = 'SIDEBAR_ENABLE';
export const SIDEBAR_DISABLE = 'SIDEBAR_DISABLE';

export function show() {
    return {
        type: SIDEBAR_SHOW
    }
}

export function hide() {
    return {
        type: SIDEBAR_HIDE
    }
}

export function toggle() {
    return {
        type: SIDEBAR_TOGGLE
    }
}

export function enable() {
    return {
        type: SIDEBAR_ENABLE
    }
}

export function disable() {
    return {
        type: SIDEBAR_DISABLE
    }
}