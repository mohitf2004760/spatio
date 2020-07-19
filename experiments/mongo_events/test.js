a = 5;
var test = 2 + 2*a;
console.log(test);

// var percentColors = [
//     { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
//     { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
//     { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

// var getColorForPercentage = function(pct) {
//     for (var i = 1; i < percentColors.length - 1; i++) {
//         if (pct < percentColors[i].pct) {
//             break;
//         }
//     }
//     var lower = percentColors[i - 1];
//     var upper = percentColors[i];
//     var range = upper.pct - lower.pct;
//     var rangePct = (pct - lower.pct) / range;
//     var pctLower = 1 - rangePct;
//     var pctUpper = rangePct;
//     var color = {
//         r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
//         g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
//         b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
//     };
    
//     //return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
//     // or output as hex if preferred
//     return rgbToHex(color.r,color.g,color.b);
// }  

// function componentToHex(c) {
//     var hex = c.toString(16);
//     return hex.length == 1 ? "0" + hex : hex;
// }

// function rgbToHex(r, g, b) {
//     return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
// }

// console.log(getColorForPercentage(0.0));
// console.log(getColorForPercentage(0.1));
// console.log(getColorForPercentage(0.2));
// console.log(getColorForPercentage(0.3));
// console.log(getColorForPercentage(0.4));
// console.log(getColorForPercentage(0.5));
// console.log(getColorForPercentage(0.6));
// console.log(getColorForPercentage(0.7));
// console.log(getColorForPercentage(0.8));
// console.log(getColorForPercentage(0.9));
// console.log(getColorForPercentage(1.0));
