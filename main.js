/*
 * HV Project Switch plugin
 */


const {Rectangle, Ellipse, Color, Text, Path, Group, Artboard, SymbolInstance, RepeatGrid,
Polygon, Line, ImageFill } = require("scenegraph"); 

const DAWN_THEME = 1;
const WICKED_THEME = 2; 
const THEMES_ARRAY = [

// Color Name, Dawn 1.x, Wicked 1.x

// accent
// [".acce0","#ffffff","#ffffff"],
[".acce1","#414141","#dedede"],
[".acce2","#146bd2","#146bd2"],
[".acce2h","#4389db","#4389db"],
[".acce3","#cc0000","#cc0000"],
		
// atmosphere
[".atmo1","#ffffff","#393939"],
[".atmo2","#f9f9f9","#424242"],
[".atmo3","#f5f5f5","#494949"],
[".atmo4","#f0f0f0","#545454"],
[".atmo5","#dedede","#626262"],
[".atmo6","#bcbcbc","#2c2c2c"],
[".atmo7","#999999","#919191"],
		
// semantic	
// severity	
[".sema2","#519884","#72cccb"],
[".sema3","#d77314","#e68c17"],
[".sema4","#eb4a57","#ff5e6c"],
[".sema5","#c51162","#e26bd2"],
[".sema6","#aa00ff","#928fff"],
		
// negative alt	
[".sema10","#d77249","#f4cab0"],
[".sema11","#d36041","#f1b7a0"],
[".sema12","#cf4e38","#eea291"],
[".sema13","#cb3b30","#e98b82"],
[".sema14","#c62828","#e57373"],
		
// positive/neutral alt	
[".sema15","#668fcd","#80deea"],
[".sema16","#4d8ac0","#4dd0e1"],
[".sema17","#3388b1","#26c6da"],
[".sema18","#1a85a1","#00acc1"],
[".sema19","#00838f","#00a0b7"],
		
// status & system feedback
[".sema1","#669a1d","#63a621"],
[".sema3","#d77314","#e68c17"],
[".sema4","#eb4a57","#ff5e6c"],
		
// notifications
[".sema20","#f9e3c5","#f9e3c5"],
[".sema9","#f5d8d8","#f5d8d8"],
[".sema7","#d3e3f6","#d3e3f6"],
      		
// support	
[".supp1","#0f8b8d","#0f8b8d"],
[".supp2","#734b6d","#734b6d"],
[".supp3","#4e7599","#4e7599"],
[".supp4","#c19c31","#c19c31"],
[".supp5","#546b6b","#546b6b"]

];

 


function switchTheme(selection, sourceIdx, destinationIdx){

    // Apply it...
    console.log("Switching HV theme");

    for (let index = 0; index < selection.items.length; index++) {
        const item = selection.items[index];
        
        processItem(item, sourceIdx, destinationIdx);
        
    }
}


function processItem(item, sourceIdx, destinationIdx){

    if ( item instanceof Text){
            
        //console.log("Found text... " )

        var styles = item.styleRanges;

        styles.map( styleRange => 
            replaceColor( styleRange, "fill", sourceIdx, destinationIdx) 
        )
        try {
            item.styleRanges = styles;            
        } catch (error) {
            console.log("Error applying text style...");
        }
    }
    else if (item instanceof Rectangle || item instanceof Ellipse || 
        item instanceof Path || item instanceof Polygon || item instanceof Line ){

        //console.log( "Found Rectangle or Ellipse");
        replaceColor(item,"fill",sourceIdx, destinationIdx);
        replaceColor(item,"stroke",sourceIdx, destinationIdx);
    }
    else if( item instanceof Artboard || item instanceof Group ){
        // go one level down
        if( item instanceof Artboard ){
            replaceColor(item,"fill",sourceIdx, destinationIdx);
        }

        // Skipping some conditions here...
        if ( item instanceof Group && item.mask ){
            // continue
        }
        else{

            //console.log("Going one level down...")
            item.children.forEach(function(e,i){
                //console.log("Here..." + e + i)
                processItem(e, sourceIdx, destinationIdx)
            })

        }


    }
    else if( item instanceof SymbolInstance ){

        console.log("Found symbol. We can't edit it...");

    }
    else if( item instanceof RepeatGrid ){

        // This one belongs to a different edit context... 

    }
    else{
        // Other elements
        console.log("Unknown element: " + typeof item)
    }

}

function replaceColor(elem, property,  sourceIdx, destinationIdx){
    
    try {

        if( elem[property] && !(elem[property] instanceof ImageFill)){

            var c = getEquivalentColor(elem[property].toHex(1), sourceIdx, destinationIdx);
            if (c){
                // Transforming
                //console.log("Changing color: from " + elem[property].toHex(1) + " to " + c)
                
                    elem[property] = new Color(c);                

            }
        }
    } 
    catch (error) {
        console.log("Error: " + error);
    }   

}


function getEquivalentColor(color, sourceIdx, destinationIdx){

    const found = THEMES_ARRAY.map( o => o[sourceIdx]).findIndex(element => element == color);
    //console.log("Searching for color: "+ color);

    if( found >= 0 ){
        //console.log("Found "+ THEMES_ARRAY[found][0] + " color " + color + " in position " + found + ". Returning " + THEMES_ARRAY[found][destinationIdx])
        return THEMES_ARRAY[found][destinationIdx];
    }

    return null;

}


function switchToDawn(selection) {

    switchTheme(selection, WICKED_THEME, DAWN_THEME);

}


function switchToWicked(selection) {

    switchTheme(selection, DAWN_THEME , WICKED_THEME);
}


module.exports = {
    commands: {
        switchToDawn: switchToDawn,
        switchToWicked: switchToWicked
    }
};
