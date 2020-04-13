/*
 * HV Project Switch plugin
 */


const {Rectangle, Color} = require("scenegraph"); 

const TODAWN = 0;
const TOWICKED = 1;


function switchTheme(selection, themeIdx){

    // Apply it...
    console.log("Switching HV theme to " + themeIdx + "\n"+ JSON.stringify(selection));

    for (let index = 0; index < selection.items.length; index++) {
        const item = selection.items[index];


        console.log("Fill color: " + item.fill.toHex() + "; Stroke color: " + item.stroke.toHex());

        
    }
}


function switchToDawn(selection) {

    switchTheme(selection, TODAWN);

}

function switchToWicked(selection) {

    switchTheme(selection, TOWICKED);
}


module.exports = {
    commands: {
        switchToDawn: switchToDawn,
        switchToWicked: switchToWicked
    }
};
