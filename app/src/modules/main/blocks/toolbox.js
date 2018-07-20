import Blockly from 'scratch-blocks';

import robotBlocks from '../robots/Blocks';
import {motion, looks,sound,sensing, others} from '../robots/Toolbox';
/*
Blockly.Colours = {
  // SVG colours: these must be specificed in #RRGGBB style
  // To add an opacity, this must be specified as a separate property (for SVG fill-opacity)
  "motion": {
    "primary": "#4C97FF",
    "secondary": "#4280D7",
    "tertiary": "#3373CC"
  },
  "looks": {
    "primary": "#9966FF",
    "secondary": "#855CD6",
    "tertiary": "#774DCB"
  },
  "sounds": {
    "primary": "#CF63CF",
    "secondary": "#C94FC9",
    "tertiary": "#BD42BD"
  },
  "control": {
    "primary": "#FFAB19",
    "secondary": "#EC9C13",
    "tertiary": "#CF8B17"
  },
  "event": {
    "primary": "#FFBF00",
    "secondary": "#E6AC00",
    "tertiary": "#CC9900"
  },
  "sensing": {
    "primary": "#5CB1D6",
    "secondary": "#47A8D1",
    "tertiary": "#2E8EB8"
  },
  "pen": {
    "primary": "#0fBD8C",
    "secondary": "#0DA57A",
    "tertiary": "#0B8E69"
  },
  "operators": {
    "primary": "#59C059",
    "secondary": "#46B946",
    "tertiary": "#389438"
  },
  "data": {
    "primary": "#FF8C1A",
    "secondary": "#FF8000",
    "tertiary": "#DB6E00"
  },
  // This is not a new category, but rather for differentiation
  // between lists and scalar variables.
  "data_lists": {
    "primary": "#FF661A",
    "secondary": "#FF5500",
    "tertiary": "#E64D00"
  },
  "more": {
    "primary": "#FF6680",
    "secondary": "#FF4D6A",
    "tertiary": "#FF3355"
  },
  "text": "#575E75",
  "workspace": "#F9F9F9",
  "toolboxHover": "#4C97FF",
  "toolboxSelected": "#e9eef2",
  "toolboxText": "#575E75",
  "toolbox": "#FFFFFF",
  "flyout": "#F9F9F9",
  "scrollbar": "#CECDCE",
  "scrollbarHover": '#CECDCE',
  "textField": "#FFFFFF",
  "insertionMarker": "#000000",
  "insertionMarkerOpacity": 0.2,
  "dragShadowOpacity": 0.3,
  "stackGlow": "#FFF200",
  "stackGlowSize": 4,
  "stackGlowOpacity": 1,
  "replacementGlow": "#FFFFFF",
  "replacementGlowSize": 2,
  "replacementGlowOpacity": 1,
  "colourPickerStroke": "#FFFFFF",
  // CSS colours: support RGBA
  "fieldShadow": "rgba(0,0,0,0.1)",
  "dropDownShadow": "rgba(0, 0, 0, .3)",
  "numPadBackground": "#547AB2",
  "numPadBorder": "#435F91",
  "numPadActiveBackground": "#435F91",
  "numPadText": "#FFFFFF",
  "valueReportBackground": "#FFFFFF",
  "valueReportBorder": "#AAAAAA"
};
*/

Object.assign(Blockly.Blocks, robotBlocks());

export default '<xml id="toolbox-categories" style="display: none">' +
'<category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">' +
    '<block type="event_whenflagclicked" id="event_whenflagclicked"></block>' +
  '</category>' +
    '<category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17">' +
    '<block type="control_wait" id="control_wait">' +
      '<value name="DURATION">' +
        '<shadow type="math_positive_number">' +
          '<field name="NUM">1</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="control_repeat" id="control_repeat">' +
      '<value name="TIMES">' +
        '<shadow type="math_whole_number">' +
          '<field name="NUM">10</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="control_forever" id="control_forever"></block>' +
    '<block type="control_if" id="control_if"></block>' +
    '<block type="control_if_else" id="control_if_else"></block>' +
    '<block type="control_wait_until" id="control_wait_until"></block>' +
    '<block type="control_repeat_until" id="control_repeat_until"></block>' +
  '</category>' +
  motion+
  looks+
 
 sound+
  
sensing+
  '<category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="#40BF4A" secondaryColour="#389438">' +
    '<block type="operator_add" id="operator_add">' +
      '<value name="NUM1">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="NUM2">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_subtract" id="operator_subtract">' +
      '<value name="NUM1">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="NUM2">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_multiply" id="operator_multiply">' +
      '<value name="NUM1">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="NUM2">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_divide" id="operator_divide">' +
      '<value name="NUM1">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="NUM2">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_random" id="operator_random">' +
      '<value name="FROM">' +
        '<shadow type="math_number">' +
          '<field name="NUM">1</field>' +
        '</shadow>' +
      '</value>' +
      '<value name="TO">' +
        '<shadow type="math_number">' +
          '<field name="NUM">10</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_lt" id="operator_lt">' +
      '<value name="OPERAND1">' +
        '<shadow type="text">' +
          '<field name="TEXT"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="OPERAND2">' +
        '<shadow type="text">' +
          '<field name="TEXT"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_equals" id="operator_equals">' +
      '<value name="OPERAND1">' +
        '<shadow type="text">' +
          '<field name="TEXT"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="OPERAND2">' +
        '<shadow type="text">' +
          '<field name="TEXT"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_gt" id="operator_gt">' +
      '<value name="OPERAND1">' +
        '<shadow type="text">' +
          '<field name="TEXT"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="OPERAND2">' +
        '<shadow type="text">' +
          '<field name="TEXT"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_and" id="operator_and"></block>' +
    '<block type="operator_or" id="operator_or"></block>' +
    '<block type="operator_not" id="operator_not"></block>' +
    '<block type="operator_join" id="operator_join">' +
      '<value name="STRING1">' +
        '<shadow type="text">' +
          '<field name="TEXT">hello</field>' +
        '</shadow>' +
      '</value>' +
      '<value name="STRING2">' +
        '<shadow type="text">' +
          '<field name="TEXT">world</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_letter_of" id="operator_letter_of">' +
      '<value name="LETTER">' +
        '<shadow type="math_whole_number">' +
          '<field name="NUM">1</field>' +
        '</shadow>' +
      '</value>' +
      '<value name="STRING">' +
        '<shadow type="text">' +
          '<field name="TEXT">world</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_length" id="operator_length">' +
      '<value name="STRING">' +
        '<shadow type="text">' +
          '<field name="TEXT">world</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_contains" id="operator_contains">' +
      '<value name="STRING1">' +
        '<shadow type="text">' +
          '<field name="TEXT">hello</field>' +
        '</shadow>' +
      '</value>' +
      '<value name="STRING2">' +
        '<shadow type="text">' +
          '<field name="TEXT">world</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_mod" id="operator_mod">' +
      '<value name="NUM1">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
      '<value name="NUM2">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_round" id="operator_round">' +
      '<value name="NUM">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
    '<block type="operator_mathop" id="operator_mathop">' +
      '<value name="NUM">' +
        '<shadow type="math_number">' +
          '<field name="NUM"></field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
  '</category>' +
  '<category name="%{BKY_CATEGORY_VARIABLES}" id="data" colour="#FF8C1A" secondaryColour="#DB6E00" custom="VARIABLE">' +
  '</category>' +
  '<category name="%{BKY_CATEGORY_MYBLOCKS}" id="more" colour="#FF6680" secondaryColour="#FF4D6A" custom="PROCEDURE">' +
  '</category>' +
  '<category name="Extensions" id="extensions" colour="#FF6680" secondaryColour="#FF4D6A" ' +
    'iconURI="../media/extensions/wedo2-block-icon.svg" showStatusButton="true">' +
//*
    
    //*/
    '<block type="extension_microbit_display" id="extension_microbit_display">' +
      '<value name="MATRIX">' +
        '<shadow type="matrix">' +
          '<field name="MATRIX">0101010101100010101000100</field>' +
        '</shadow>' +
      '</value>' +
    '</block>' +
  '</category>' +
  others + 
  '</xml>';
