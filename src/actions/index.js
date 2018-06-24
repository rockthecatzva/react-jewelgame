import { _basicJewelTypes, _numCols, _numRows,  } from '../constants'

export const JEWEL_CLICK = "JEWEL_CLICK";
export const SEQUENCE_FOUND = "SEQUENCE_FOUND";
export const EXIT_ANIMATION = "EXIT_ANIMATION";
export const REMOVE_DUPLICATES = "REMOVE_DUPLICATES";
export const REMOVE_EXITED = "REMOVE_EXITED";
export const APPLY_GRAVITY = "APPLY_GRAVITY";
export const REPLACE_MISSING = "REPLACE_MISSING";
export const INIT_GAME = "INIT_GAME";
export const INTRO_COMPLETE = "INTRO_COMPLETE";
export const NO_SEQUENCES_FOUND = "NO_SEQUENCES_FOUND";
export const CHECK_FOR_SEQUENCES = "CHECK_FOR_SEQUENCES";
export const COLLAPSE_SEQUENCE = "COLLAPSE_SEQUENCE";
export const SEQUENCES_HIGHLIGHTED = "SEQUENCES_HIGHLIGHTED";
export const REMOVE_EXITERS = "REMOVE_EXITERS";
export const COLLAPSE_COMPLETE = "COLLAPSE_COMPLETE";
export const SELECT_JEWEL = "SELECT_JEWEL";
export const SWAP_JEWELS = "SWAP_JEWELS";
export const RESET_JEWEL_ANIMATE = "RESET_JEWEL_ANIMATE";
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

export const onInitGame = (rows, columns) => {
    return {
        type: INIT_GAME,
        rows,
        columns
        //jewels,
        //nextPhase
    }
}

export const onIntroComplete = () => {
    return {
        type: INTRO_COMPLETE,
        
    }
}



export const onCheckForSequences = () => {
    return {
        type: CHECK_FOR_SEQUENCES,
        //nextPhaseFound,
        //nextPhaseNotfound
    }
}

export const onSequenceFound = ()=>{
    return {
        type: SEQUENCE_FOUND
    }
}

export const onNoSequenceFound = ()=>{
    return {
        type: NO_SEQUENCES_FOUND
    }
}


export const onCollapse = ()=>{
    return {
        type: COLLAPSE_COMPLETE,
        
    }
}


export const onAnimateExit = ()=>{
    return {
        type: EXIT_ANIMATION,
        
    }
}

export const onApplyGravity = (jewelMaker)=>{
    return {
        type: APPLY_GRAVITY,
        jewelMaker   
    }
}

export const onRemoveExiters = () =>{
    return {
        type: REMOVE_EXITED,
        
    }
}

export const onJewelSwap = (j1, j2) =>{
    return {
        type: SWAP_JEWELS,
        jewels: [j1, j2]
    }
}

export const onSelectJewel = (row, column)=>{
    return {
        type: SELECT_JEWEL,
        row,
        column
    }
}

export const onResetJewelAnimations = ()=>{
    return {
        type: RESET_JEWEL_ANIMATE
    }
}