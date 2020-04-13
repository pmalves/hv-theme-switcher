/*
 * HV Project Switch plugin
 */


const {Rectangle, Ellipse, Color, Text, Group, Artboard } = require("scenegraph"); 

const DAWN_ARRAY = [
   // accent
   "#414141",
   "#146bd2",
   "#4389db",
   "#cc0000",
   
   // atmosphere
   "#ffffff",
   "#f9f9f9",
   "#f5f5f5",
   "#f0f0f0",
   "#dedede",
   "#bcbcbc",
   "#999999",
   
   // semantic
   // severity
   "#519884",
   "#d77314",
   "#eb4a57",
   "#c51162",
   "#aa00ff",
   
   // negative alt
   "#d77249",
   "#d36041",
   "#cf4e38",
   "#cb3b30",
   "#c62828",
   
   // positive/neutral alt
   "#668fcd",
   "#4d8ac0",
   "#3388b1",
   "#1a85a1",
   "#00838f",
   
   // status & system feedback
   "#669a1d",
   "#d77314",
   "#eb4a57"
   ];
   
const WICKED_ARRAY = [
    // accent
    "#dedede",
    "#146bd2",
    "#4389db",
    "#cc0000",

    // atmosphere
    "#393939",
    "#424242",
    "#494949",
    "#545454",
    "#626262",
    "#2c2c2c",
    "#919191",

    // semantic
    // severity
    "#72cccb",
    "#e68c17",
    "#ff5e6c",
    "#e26bd2",
    "#928fff",

    // negative alt
    "#f4cab0",
    "#f1b7a0",
    "#eea291",
    "#e98b82",
    "#e57373",

    // positive/neutral alt
    "#80deea",
    "#4dd0e1",
    "#26c6da",
    "#00acc1",
    "#00a0b7",

    // status & system feedback
    "#63a621",
    "#e68c17",
    "#ff5e6c"
];
 


function switchTheme(selection, documentRoot, sourceArray, destinationArray){

    // Apply it...
    console.log("Switching HV theme");

    for (let index = 0; index < selection.items.length; index++) {
        const item = selection.items[index];
        
        processItem(item, sourceArray, destinationArray);
        
    }
}


function processItem(item, sourceArray, destinationArray){

    if ( item instanceof Text){
            
        //console.log("Found text... " )

        var styles = item.styleRanges;

        styles.map( styleRange => 
            replaceColor( styleRange, "fill", sourceArray,destinationArray ) 
        )
        item.styleRanges = styles;
    }
    else if (item instanceof Rectangle || item instanceof Ellipse){

        //console.log( "Found Rectangle or Ellipse");
        replaceColor(item,"fill",sourceArray,destinationArray);
        replaceColor(item,"stroke",sourceArray,destinationArray);
    }
    else if( item instanceof Artboard || item instanceof Group ){
        // go one level down
        if( item instanceof Artboard ){
            replaceColor(item,"fill",sourceArray,destinationArray);
        }

        console.log("Going one level down...")
        item.children.forEach(function(e,i){
            //console.log("Here..." + e + i)
            processItem(e, sourceArray, destinationArray)
        })

    }
    else if( false ){
        // go one level down
        console.log("Going one level down...")
        item.children.forEach(function(e,i){
            console.log("Here..." + e + i)
            // switchTheme(e, sourceArray, destinationArray)
        })

    }
    else{
        // Other elements
        console.log("Unknown element: " + typeof item)
    }

}

function replaceColor(elem, property, sourceArray, destinationArray){
    
    if( elem[property] ){

        var c = getEquivalentColor(elem[property].toHex(1),sourceArray,destinationArray);
        if (c){
            // Transforming
            //console.log("Changing color: from " + elem[property].toHex(1) + " to " + c)
            elem[property] = new Color(c); 
        }
    }

}


function getEquivalentColor(color, sourceArray, destinationArray){

    const found = sourceArray.findIndex(element => element == color);
    //console.log("Searching for color: "+ color);

    if( found >= 0 ){
        //console.log("Found color " + color + " in position " + found)
        return destinationArray[found];
    }

    return null;

}

function switchToDawn(selection, documentRoot) {

    switchTheme(selection, documentRoot, WICKED_ARRAY, DAWN_ARRAY);

}

function switchToWicked(selection, documentRoot) {

    switchTheme(selection, documentRoot, DAWN_ARRAY, WICKED_ARRAY);
}


module.exports = {
    commands: {
        switchToDawn: switchToDawn,
        switchToWicked: switchToWicked
    }
};
