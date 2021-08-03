const { sample } = require("./samples/sample.json")
const { configs } = require("./samples/configs.json")

// configs do afnd
const afnd = sample;
const { alpha: afndAlpha, start: afndStart, end: afndEnd }  = configs;
// configs do afd
let afd = {}
let afdStates = []

const newStateIsEnd = ( arr )=>{
    for (const endState of afndEnd) {
        if(arr.includes(endState)){
            return true
        }
    }
    return false
}

const updateAFD = (state, array) => {
    const newState = {};
    if (newStateIsEnd(array)){
        state = '[end]'+ state; 
    }
    newState[state] = {};
    afdStates = [...afdStates, array];
    // iterando agora no alfabeto buscando cada possibilidade 
    // para o proximo estado
    for (let i = 0; i < afndAlpha.length; i++){
        let possibilities = [];
        for (let j = 0; j < array.length; j++){
            // caminho antigo
            const history = afnd[array[j]][afndAlpha[i]];
            if(history.length > 0){
                // junção dos dois estados
                possibilities = [...possibilities, ...history];
            }
        }
        // adicionando a um Set para retirar todas as entradas duplicadas.
        possibilities = [...new Set([...possibilities])];
        newState[state][afndAlpha[i]] = [...possibilities];
    }
    afd = {...afd, ...newState};
    for (const s in newState){
        nextStep(newState[s]);
    }
}

const isAFDState = (newState, afdState)  => {
    if(newState.length !== afdState.length) return false;
    for (let j = 0; j < afdState.length; j++) {
        if (newState.indexOf(afdState[j]) === -1) {
            return false;
        }
    }
    return true;
}


const nextStep = (state_row) => {
    for (const row in state_row){
        const actual = state_row[row];
        const nextState = state_row[row].join('');
        if(afd[nextState] === undefined && nextState !== ''){
            let finded = false;
            for(let i = 0; i < afdStates.length; i++){
                if(isAFDState(actual, afdStates[i])){
                    finded=true;
                }
            }
            if(!finded){
                updateAFD(nextState, actual);
            }
        }

    }
}

const convertAFNDtoAFD = () => {
    for (const state in afnd){
        // enquanto não houver esse estado no afd, adiciona
        if (afd[state] === undefined){
            if(afndStart === state){
                afd['[start]' + state] = afnd[state];
            }else if (afndEnd.includes(state)){
                afd['[end]' + state] = afnd[state];
            } else {
                afd[''] = afnd[state];
            }
            // atualiza os estados do afd
            afdStates = [...afdStates, [state]];
            nextStep(afnd[state]);
        }
    }
};

convertAFNDtoAFD();

console.table(afnd);
console.table(afd);

// console.info(afd)
// console.info(afnd);