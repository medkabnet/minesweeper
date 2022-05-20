const table = document.getElementById("table");
const newGame = document.getElementById("newGame");
const tableGame =[];
const totalMineStart = 30;
const lineCount = 15;
let firstClick = true;
let nbrMine = totalMineStart;
let gameOver = false ;
function startNewGame(){
    nbrMine = totalMineStart;
    document.getElementById("reste").innerHTML = nbrMine;
    resetTableGame()
    insertMine()
    insertIndice()
    loadTable()
}
newGame.addEventListener("click",()=>{
    startNewGame()
})
startNewGame()
function loadTable(showResult = false){
    table.innerHTML = "";
    for(let i = 0 ; i < lineCount ; i++){
        let newLine = table.insertRow();
        for (let j = 0 ; j < lineCount ; j++){
            let newCell = newLine.insertCell();
            newCell.classList.add("case");
            newCell.setAttribute("indexA",i)
            newCell.setAttribute("indexB",j)
            newCell.innerHTML = tableGame[i][j].value;
            if(tableGame[i][j].open == true){
                newCell.innerHTML = tableGame[i][j].value;
                newCell.classList.add("open");
            }
            else if(tableGame[i][j].blocked)
                newCell.classList.add("flag");
            else
                newCell.classList.add("close");
            newCell.addEventListener("click",(event)=>{
                let cell = event.target;
                if(gameOver || cell.getAttribute("block")=="true")
                    return;
                if(tableGame[cell.getAttribute("indexA")][cell.getAttribute("indexB")].value == "B"){
                    gameOver = true;
                    showAllCase('gameOver');
                    //loadTable(true);
                    return;
                }
                cell.classList.add("open")
                cell.classList.remove("close")
                tableGame[cell.getAttribute("indexA")][cell.getAttribute("indexB")].open = true;
                //openEmptyCase(Number(cell.getAttribute("indexA")),Number(cell.getAttribute("indexB")))
                // if(firstClick){
                //     firstClick = false;
                //     insertIndice()
                // }
                // else {
                    openEmptyCase(Number(cell.getAttribute("indexA")),Number(cell.getAttribute("indexB")))
                // }
                
                loadTable();
            })
            newCell.addEventListener("contextmenu",(event)=>{
                event.preventDefault();
                let cell = event.target;
                if(cell.classList.contains("open"))
                    return
                if(cell.classList.contains("flag")){
                    tableGame[cell.getAttribute("indexA")][cell.getAttribute("indexB")].blocked = false
                    document.getElementById("reste").innerHTML = ++nbrMine
                    cell.classList.remove("flag");
                    cell.classList.add("close");
                    cell.setAttribute("block","false");
                    countNewMin("non",cell.getAttribute("indexA"),cell.getAttribute("indexB"));
                }else{
                    tableGame[cell.getAttribute("indexA")][cell.getAttribute("indexB")].blocked = true
                    document.getElementById("reste").innerHTML = --nbrMine
                    cell.classList.add("flag");
                    cell.classList.remove("close");
                    cell.setAttribute("block","true");
                    countNewMin("oui",cell.getAttribute("indexA"),cell.getAttribute("indexB"));
                }
                if(nbrMine == 0 ){
                    gameOver = true;
                    showAllCase('wine');
                    document.getElementById("fin").innerHTML = "Gangner"
                }
            })
        }
    }
    console.log("Loaded")
}
// function insertNewCase(max,indexI,indexJ){
//     let mineNumber = getRandomArbitrary(-1, max);
//     if(indexI == 0 && indexJ == 0 ){
//         tableGame[indexI][indexJ]= mineNumber
//     }
// }
function resetTableGame(){
    if(tableGame.length == 0 ){
        for(let i = 0 ; i < lineCount ; i++){
            let Row = [];
            for (let j = 0 ; j < lineCount ; j++){
                Row.push('');
            }
            tableGame.push(Row);
        }
    }
    else{
        for(let i = 0 ; i < lineCount ; i++){
            for (let j = 0 ; j < lineCount ; j++){
                tableGame[i][j]="";
            }
            
        }
    }
}
function insertMine(){
    let totalMine = 0;
    do{
        let newMineAdded = false
        do{
            let indexI = getRandomArbitrary(0, lineCount);
            let indexJ = getRandomArbitrary(0, lineCount);
            if(tableGame[indexI][indexJ]== ""){
                tableGame[indexI][indexJ] = {
                    value : "B",
                    blocked : false,
                    open : false
                }
                newMineAdded = true;
                totalMine++;
            }
        }while(!newMineAdded)
    }while(totalMine < totalMineStart)
}
function insertIndice(){
    let endLoop = false;
    for (let i = 0 ; i < lineCount ; i++){
        for(let j = 0 ; j < lineCount ; j++){
            let open = false ;
            let empty = false ;
            if(tableGame[i][j].open !== undefined)
                if(tableGame[i][j].open == true)
                    open = true;
            if(tableGame[i][j].value !== undefined)
                if(tableGame[i][j].value == "")
                    empty = true;
            let countMine = 0;
            //let countMineBlocked = 0;
            let maxIndexI = i + 2;
            let minIndexI = i - 1;
            let maxIndexJ = j + 2;
            let minIndexJ = j - 1;
            if( i == 0){
                minIndexI = i ;
            }
            else if(i == lineCount-1 ){
                maxIndexI = i + 1;
            }
            if(j == 0 ){
                minIndexJ = j ;
            }
            else if(j == lineCount - 1 ){
                maxIndexJ = j + 1;
            }
            
            for(k = minIndexI ; k <  maxIndexI ; k++ ){
                for(l = minIndexJ ;l < maxIndexJ ; l++ ){
                    if(tableGame[k][l].value !== undefined){
                        if(tableGame[k][l].value== 'B'){
                            countMine++;
                        }
                        // if(tableGame[k][l].blocked)
                        //     countMineBlocked++;
                    }
                }
            }
            // for(k = minIndexI ; k <  maxIndexI ; k++ ){
            //     for(l = minIndexJ ;l < maxIndexJ ; l++ ){
            //         if(tableGame[k][l].value !== undefined){
            //             if(countMineBlocked == Number(tableGame[i][j].value) && Number(tableGame[k][l].value) >= 0 && open){
            //                 console.log("Found : "+i+" : "+ j+"Count Mine  :" + countMineBlocked);
            //                 tableGame[k][l].open = true;
            //             }
            //             else {
            //                 //console.log("Set : "+i+" : "+ j)
            //                 if(open && !empty){
            //                     if(tableGame[k][l].value == '')
            //                         tableGame[k][l].open = true;
            //                 }
            //                 else if(open && empty){
            //                     if(tableGame[k][l].value !== '' && tableGame[k][l].value !== "B")
            //                         tableGame[k][l].open = true; 
            //                 }
            //             }
            //         }
            //     }
            // }
            // if(countMineBlocked == tableGame[i][j].value && tableGame[i][j].value !== ""){
            //     endLoop = true;
            // }
            if(tableGame[i][j].value == undefined){
                if(countMine == 0)
                    countMine = "";
                tableGame[i][j] = {
                    value : countMine,
                    blocked : false,
                    open : false,
                    blockedMin : 0
                }
                // tableGame[i][j] = {
                //     value : i+";"+j+"-Cou : "+ countMine,
                //     blocked : false,
                //     open : false
                // }
            }
            if(endLoop)
                break;
        }
        if(endLoop)
            break;
    }
}
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}



function showAllCase(statu){
    let allCase = document.getElementsByClassName("case");
    for(let i = 0 ; i < allCase.length ; i++){
        if(allCase[i].classList.contains("close")){
            allCase[i].classList.add(statu);
            allCase[i].classList.remove("close");
        }
    }
}

function openEmptyCase(indexI,indexJ){
    indexI = Number(indexI);
    indexJ = Number(indexJ);
    let countMineBlocked = 0;
    let maxIndexI = indexI + 2;
    let minIndexI = indexI - 1;
    let maxIndexJ = indexJ + 2;
    let minIndexJ = indexJ - 1;
    if( indexI == 0){
        minIndexI = indexI ;
    }
    else if(indexI == lineCount-1 ){
        maxIndexI = indexI + 1;
    }
    if(indexJ == 0 ){
        minIndexJ = indexJ ;
    }
    else if(indexJ == lineCount - 1 ){
        maxIndexJ = indexJ + 1;
    }
    for(k = minIndexI ; k <  maxIndexI ; k++ ){
        for(l = minIndexJ ;l < maxIndexJ ; l++ ){
            if(tableGame[k][l].value == '' || (tableGame[indexI][indexJ].value == "" && tableGame[k][l].value != 'B')){
                tableGame[k][l].open = true
            }
        }
    }
    checkAllNotOpnedCell();
}

function countNewMin(add, indexI , indexJ){
    let countMineBlocked = 0;
    indexI = Number(indexI);
    indexJ = Number(indexJ);
    let maxIndexI = indexI + 2;
    let minIndexI = indexI - 1;
    let maxIndexJ = indexJ + 2;
    let minIndexJ = indexJ - 1;
    if( indexI == 0){
        minIndexI = indexI ;
    }
    else if(indexI == lineCount-1 ){
        maxIndexI = indexI + 1;
    }
    if(indexJ == 0 ){
        minIndexJ = indexJ ;
    }
    else if(indexJ == lineCount - 1 ){
        maxIndexJ = indexJ + 1;
    }
    for(k = minIndexI ; k <  maxIndexI ; k++ ){
        for(l = minIndexJ ;l < maxIndexJ ; l++ ){
            if(tableGame[k][l].blockedMin !== undefined){
                if(add == "oui" && tableGame[k][l].blockedMin < tableGame[k][l].value){
                    tableGame[k][l].blockedMin++;
                }
                if(add == "non" && tableGame[k][l].blockedMin > 0){
                    tableGame[k][l].blockedMin--;
                }
            }
            
        }
    }
}

function checkAllNotOpnedCell(){
    for(let i =0 ; i < lineCount , i++)
}


