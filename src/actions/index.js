import { _basicJewelTypes, _numCols, _numRows,  } from '../constants'

export const JEWEL_CLICK = "JEWEL_CLICK";
export const SEQUENCE_FOUND = "SEQUENCE_FOUND";
export const EXIT_ANIMATION = "EXIT_ANIMATION";
export const REMOVE_DUPLICATES = "REMOVE_DUPLICATES";
export const REMOVE_EXITED = "REMOVE_EXITED";
export const APPLY_GRAVITY = "APPLY_GRAVITY";
export const REPLACE_MISSING = "REPLACE_MISSING";
export const JEWELS_CREATED = "JEWELS_CREATED";
export const INTRO_COMPLETE = "INTRO_COMPLETE";
export const NO_SEQUENCES_FOUND = "NO_SEQUENCES_FOUND";
export const CHECK_FOR_SEQUENCES = "CHECK_FOR_SEQUENCES";
export const COLLAPSE_SEQUENCE = "COLLAPSE_SEQUENCE";
export const SEQUENCES_HIGHLIGHTED = "SEQUENCES_HIGHLIGHTED";
export const REMOVE_EXITERS = "REMOVE_EXITERS";
export const COLLAPSE_COMPLETE = "COLLAPSE_COMPLETE";
export const SELECT_JEWEL = "SELECT_JEWEL";
export const SWAP_JEWELS = "SWAP_JEWELS";
export const COMPLETE_SWAP = "COMPLETE_SWAP";
export const NEUTRAL = "NEUTRAL";
export const INTRO_ANIMATION = "INTRO_ANIMATION";
export const JEWEL_CLICK_IN = "JEWEL_CLICK_IN";
export const HIGHLIGHT_SEQUENCES = "HIGHLIGHT_SEQUENCES";


export const onJewelClick = (row, column) => {
    return {
        type: JEWEL_CLICK,
        jewel: [row, column]
    }
}

export const onJewelsCreated = (nextPhase, jewels) => {
    return {
        type: JEWELS_CREATED,
        jewels,
        nextPhase
    }
}

export const onIntroComplete = (nextPhase) => {
    return {
        type: INTRO_COMPLETE,
        nextPhase
    }
}



export const onCheckForSequences = (nextPhase) => {
    return {
        type: CHECK_FOR_SEQUENCES,
        nextPhase
    }
}

export const onSequenceFound = (nextPhase)=>{
    return {
        type: SEQUENCE_FOUND,
        nextPhase
    }
}



export const onCollapse = (nextPhase)=>{
    return {
        type: COLLAPSE_COMPLETE,
        nextPhase
    }
}


export const onAnimateExit = (nextPhase)=>{
    return {
        type: EXIT_ANIMATION,
        nextPhase
    }
}

export const onApplyGravity = (nextPhase)=>{
    return {
        type: APPLY_GRAVITY,
        nextPhase
    }
}

export const onRemoveExiters = (nextPhase) =>{
    return {
        type: REMOVE_EXITED,
        nextPhase
    }
}

export const onReplaceMissing = (nextPhase, jewelMaker) =>{
    return {
        type: REPLACE_MISSING,
        jewelMaker,
        nextPhase
    }
}

export const onJewelSwap = (j1, j2) =>{
    return {
        type: SWAP_JEWELS,
        jewels: [j1, j2]
    }
}

export const onSelectJewel = (nextPhase , row, column)=>{
    return {
        type: SELECT_JEWEL,
        row,
        column,
        nextPhase
    }
}

export const onCompleteSwappingJewels = (nextPhase)=>{
    return {
        type: COMPLETE_SWAP,
        nextPhase
    }
}