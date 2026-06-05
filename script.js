window.addEventListener("resize", setChemTableHeight);

var activeModels = new Array();
var activeChems = new Array();
var activeRefsCount = 0;
/**
 * The modelCount is an Object containing 5 Arrays: species, routes, genders, starges, and compartments
 * Each array contains the number of models in the current activeModels list that match
 * The numbers are used to display how many models would result in adding a given filter
 */
var modelCount = new Object(); //Object of Objects of Arrays

class ChemFilter {
  constructor(isExact, stringType, stringText) {
    this.isExact = isExact; // a boolean
    this.stringType = stringType; // Name or CAS RN
    this.stringText = stringText; // the text in the search query
  }
}

var filters = new Object();

var cid2chemId = new Array();

function init(){
  iris1Alert();
  initFilters();
  updateActiveModels();
  drawChemRows();
  updateHeaderBox();
  update_filterRow_text();
  for(var i in chemicals){
    var chem = chemicals[i];
      if (chem.dtxcid > 0){
        if (cid2chemId[chem.dtxcid] == undefined){cid2chemId[chem.dtxcid] = new Array();}
        cid2chemId[chem.dtxcid].push(i);
      }
  }
  setChemTableHeight();
  handleComboBoxes();
}


var isStep2Existing = null;
var isStep6Existing = null;
var isStep8Existing = null;
var isStep11Existing = null;
var isStep14Existing = null;
var isStep17Existing = null;
var isStep20Existing = null;
var isStep23Existing = null;
var isStep26Existing = null;
var isStep29Existing = null;


function showFileSelector(){
  $('#file-input').trigger('click');
}

function fileInputChange(){
  var fileInput = document.getElementById("file-input");
  var selectedFiles = fileInput.files;
  if(selectedFiles.length > 0) {
    var jsonFileToLoad = fileInput.files[0];
     var reader = new FileReader();
     reader.onload = (function(reader) {
       return function() {
         var contents = reader.result;
         var lines = contents.split('\n');
         for(i =0; i < lines.length; i++){
           if(i==0){
             var g = JSON.parse(lines[i]); //Genders
             genders = g;
           } else if (i==1){
             var c = JSON.parse(lines[i]); //Chemicals
             chemicals = c;
           } else if (i==2){ 
             var m = JSON.parse(lines[i]); //Models
             models = m;
           } else if (i==3){
             var p = JSON.parse(lines[i]); //Populations
             populations = p;
	   } else if (i==4){
             var co = JSON.parse(lines[i]); //Compartments
             compartments = co;
           } else if (i==5){
             var s = JSON.parse(lines[i]); //Species
             species = s;
	   } else if (i==6){
             var sp = JSON.parse(lines[i]); //Species Full
             species_full = sp;
           } else if (i==7){
             var st = JSON.parse(lines[i]); //Stages
             stages = st;
           } else if (i==8){
             var r = JSON.parse(lines[i]); //Routes
             routes = r;
           } else if (i==8){
             var rf = JSON.parse(lines[i]); //Refs
             refs = rf;
           } else if (i==10){
             var e = JSON.parse(lines[i]); //Equation
             equation = e;
           } else if (i==11){
             var sf = JSON.parse(lines[i]); //Software
             software = sf;
           }
         }
         updateActiveModels();
         updateHeaderBox();
       }
     })(reader);
     reader.readAsText(jsonFileToLoad);
  }
}

function saveModels(){
  var jsonData = getJSONData();
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(jsonData));
  a.setAttribute('download', "pbpk_data.json");
  a.click()
}

function getJSONData(){
  var JSONDataString;
  JSONDataString = JSON.stringify(genders) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(chemicals) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(models) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(populations) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(compartments) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(species) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(species_full) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(stages) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(routes) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(refs) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(equation) + "\n";
  JSONDataString = JSONDataString + JSON.stringify(software);
  return JSONDataString;
}


function handleComboBoxes(){
  fillChemicalComboBox();
  fillPopulationComboBox();
  fillSpeciesComboBox();
  fillGenderComboBox();
  fillStageComboBox();
  fillRouteComboBox();
  fillReferenceComboBox();
  fillCompartmentComboBox();
  fillEquationComboBox();
  fillSoftwareComboBox();
}

function fillChemicalComboBox(){
  var chemSelection = document.getElementById('chemicalSelection');
  var opt = null;
  for(i = 0; i< chemicals.length; i++) {
    if(chemicals[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = chemicals[i].name;
    chemSelection.appendChild(opt);
    }
  }
}

function fillPopulationComboBox(){
  var populationSelection = document.getElementById('populationSelection');
  var opt = null;
  for(i = 0; i< populations.length; i++) {
    if(populations[i] != null){
      var genderId = populations[i].gender_id;
      var speciesId = populations[i].species_id;
      var stageId = populations[i].stage_id;
      var g = genders[genderId];
      var sp = species[speciesId];
      var st = stages[stageId];
      var concat = g + ", " + sp + ", " + st;
      opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = concat;
      populationSelection.appendChild(opt);
    }
  }
}

function fillSpeciesComboBox(){
  var speciesSelection = document.getElementById('speciesSelection');
  var opt = null;
  for(i = 0; i< species.length; i++) {
    if(species[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = species[i];
    speciesSelection.appendChild(opt);
    }
  }
}

function fillGenderComboBox(){
  var genderSelection = document.getElementById('genderSelection');
  var opt = null;
  for(i = 0; i< genders.length; i++) {
    if(genders[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = genders[i];
    genderSelection.appendChild(opt);
    }
  }
}

function fillStageComboBox(){
  var stageSelection = document.getElementById('stageSelection');
  var opt = null;
  for(i = 0; i< stages.length; i++) {
    if(stages[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = stages[i];
    stageSelection.appendChild(opt);
    }
  }
}

function fillRouteComboBox(){
  var routeSelection = document.getElementById('routeSelection');
  var opt = null;
  for(i = 0; i< routes.length; i++) {
    if(routes[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = routes[i];
    routeSelection.appendChild(opt);
    }
  }
}

function fillReferenceComboBox(){
  var referenceSelection = document.getElementById('referenceSelection');
  var opt = null;
  for(i = 0; i< refs.length; i++) {
    if(refs[i] != null){
        var author = refs[i].author;
        var year = refs[i].year;
        var journal = refs[i].journal;
        var vol = refs[i].vol;
        var pages = refs[i].pages;
        var concat = author + ", " + year + ", " + journal + ", " + vol + ", " + pages;
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = concat;
    referenceSelection.appendChild(opt);
    }
  }
}

function fillCompartmentComboBox(){
  var compartmentSelection = document.getElementById('compartmentSelection');
  var opt = null;
  for(i = 0; i< compartments.length; i++) {
    if(compartments[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = compartments[i];
    compartmentSelection.appendChild(opt);
    }
  }
}

function fillEquationComboBox(){
  var equationSelection = document.getElementById('equationSelection');
  var opt = null;
  for(i = 0; i< equation.length; i++) {
    if(equation[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = equation[i];
    equationSelection.appendChild(opt);
    }
  }
}

function fillSoftwareComboBox(){
  var softwareSelection = document.getElementById('softwareSelection');
  var opt = null;
  for(i = 0; i< software.length; i++) {
    if(software[i] != null){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = software[i];
    softwareSelection.appendChild(opt);
    }
  }
}

function closeButtonClicked(){
  
  document.getElementById("step2ExistingRadioButton").checked = false;
  document.getElementById("step2NewRadioButton").checked = false;
  document.getElementById("step6ExistingRadioButton").checked = false;
  document.getElementById("step6NewRadioButton").checked = false;
  document.getElementById("step8ExistingRadioButton").checked = false;
  document.getElementById("step8NewRadioButton").checked = false;
  document.getElementById("step11ExistingRadioButton").checked = false;
  document.getElementById("step11NewRadioButton").checked = false;
  document.getElementById("step14ExistingRadioButton").checked = false;
  document.getElementById("step14NewRadioButton").checked = false;
  document.getElementById("step17ExistingRadioButton").checked = false;
  document.getElementById("step17NewRadioButton").checked = false;
  document.getElementById("step20ExistingRadioButton").checked = false;
  document.getElementById("step20NewRadioButton").checked = false;
  document.getElementById("step23ExistingRadioButton").checked = false;
  document.getElementById("step23NewRadioButton").checked = false;
  document.getElementById("step26ExistingRadioButton").checked = false;
  document.getElementById("step26NewRadioButton").checked = false;
  document.getElementById("step29ExistingRadioButton").checked = false;
  document.getElementById("step29NewRadioButton").checked = false;
  document.getElementById("chemicalSelection").selectedIndex = 0;
  document.getElementById("nameText").value = null;
  document.getElementById("chemDTXCIDText").value = null;
  document.getElementById("chemCASText").value = null;
  document.getElementById("chemRelationText").value = null;
  document.getElementById("chemDTXSIDText").value = null;
  document.getElementById("chemPlusText").value = null;
  document.getElementById("populationSelection").selectedIndex = 0;
  document.getElementById("speciesSelection").selectedIndex = 0;
  document.getElementById("specNameText").value = null;
  document.getElementById("genderSelection").selectedIndex = 0;
  document.getElementById("genderText").value = null;
  document.getElementById("stageSelection").selectedIndex = 0;
  document.getElementById("stageText").value = null;
  document.getElementById("routeSelection").selectedIndex = 0;
  document.getElementById("routeText").value = null;
  document.getElementById("referenceSelection").selectedIndex = 0;
  document.getElementById("refAutText").value = null;
  document.getElementById("refYearText").value = null;
  document.getElementById("refJourText").value = null;
  document.getElementById("refVolText").value = null;
  document.getElementById("refPageText").value = null;
  document.getElementById("refPubMedText").value = null;
  document.getElementById("refDOIText").value = null;
  document.getElementById("compartmentSelection").selectedIndex = 0;
  document.getElementById("compartText").value = null;
  document.getElementById("equationSelection").selectedIndex = 0;
  document.getElementById("equatText").value = null;
  document.getElementById("softwareSelection").selectedIndex = 0;
  document.getElementById("softText").value = null;
  document.getElementById("notesText").value = null;
  $('[href="#step1"]').tab('show');
  $('.formwizardpopup .modal-content').addClass('banner');
  
    isStep2Existing = null;
    isStep6Existing = null;
    isStep8Existing = null;
    isStep11Existing = null;
    isStep14Existing = null;
    isStep17Existing = null;
    isStep20Existing = null;
    isStep23Existing = null;
    isStep26Existing = null;
    isStep29Existing = null;

}

$(document).ready(function(){

$('.next').click(function(){
  var currentId = $(this).parents('.tab-pane').attr("id");
  var nextId = $(this).parents('.tab-pane').next().attr("id");

  if(currentId == "step1"){
  } else if(currentId == "step2"){
    nextId = handleStep2(true, false);
  } else if(currentId == "step3"){
    nextId = handleStep3(true, false);
  } else if(currentId == "step4"){
    nextId = handleStep4(true, false);
  } else if(currentId == "step5"){
    nextId = handleStep5(true, false);
  } else if(currentId == "step6"){
    nextId = handleStep6(true, false);
  } else if(currentId == "step7"){
    nextId = handleStep7(true, false);
  } else if(currentId == "step8"){
    nextId = handleStep8(true, false);
  } else if(currentId == "step9"){
    nextId = handleStep9(true, false);
  } else if(currentId == "step10"){
    nextId = handleStep10(true, false);
  } else if(currentId == "step11"){
    nextId = handleStep11(true, false);
  } else if(currentId == "step12"){
    nextId = handleStep12(true, false);
  } else if(currentId == "step13"){
    nextId = handleStep13(true, false);
  } else if(currentId == "step14"){
    nextId = handleStep14(true, false);
  } else if(currentId == "step15"){
    nextId = handleStep15(true, false);
  } else if(currentId == "step16"){
    nextId = handleStep16(true, false);
  } else if(currentId == "step17"){
    nextId = handleStep17(true, false);
  } else if(currentId == "step18"){
    nextId = handleStep18(true, false);
  } else if(currentId == "step19"){
    nextId = handleStep19(true, false);
  } else if(currentId == "step20"){
    nextId = handleStep20(true, false);
  } else if(currentId == "step21"){
    nextId = handleStep21(true, false);
  } else if(currentId == "step22"){
    nextId = handleStep22(true, false);
  } else if(currentId == "step23"){
    nextId = handleStep23(true, false);
  } else if(currentId == "step24"){
    nextId = handleStep24(true, false);
  } else if(currentId == "step25"){
    nextId = handleStep25(true, false);
  } else if(currentId == "step26"){
    nextId = handleStep26(true, false);
  } else if(currentId == "step27"){
    nextId = handleStep27(true, false);
  } else if(currentId == "step28"){
    nextId = handleStep28(true, false);
  } else if(currentId == "step29"){
    nextId = handleStep29(true, false);
  } else if(currentId == "step30"){
    nextId = handleStep30(true, false);
  } else if(currentId == "step31"){
    nextId = handleStep31(true, false);
  } else if(currentId == "step32"){
      nextId = handleStep32(true, false);
  }
if(nextId !== null){ 
    $('[href="#'+nextId+'"]').tab('show');
    $('.formwizardpopup .modal-content').removeClass('banner');
  }	
  return false; 
})


$('.back').click(function(){
  var currentId = $(this).parents('.tab-pane').attr("id");
  var prevId = $(this).parents('.tab-pane').prev().attr("id");
  if(prevId === "step1"){
    $('.formwizardpopup .modal-content').addClass('banner');
  }

  if(currentId == "step1"){
  } else if(currentId == "step2"){
    prevId = handleStep2(false, true);
  } else if(currentId == "step3"){
    prevId = handleStep3(false, true);
  } else if(currentId == "step4"){
    prevId = handleStep4(false, true);
  } else if(currentId == "step5"){
    prevId = handleStep5(false, true);
  } else if(currentId == "step6"){
    prevId = handleStep6(false, true);
  } else if(currentId == "step7"){
    prevId = handleStep7(false, true);
  } else if(currentId == "step8"){
    prevId = handleStep8(false, true);
  } else if(currentId == "step9"){
    prevId = handleStep9(false, true);
  } else if(currentId == "step10"){
    prevId = handleStep10(false, true);
  } else if(currentId == "step11"){
    prevId = handleStep11(false, true);
  } else if(currentId == "step12"){
    prevId = handleStep12(false, true);
  } else if(currentId == "step13"){
    prevId = handleStep13(false, true);
  } else if(currentId == "step14"){
    prevId = handleStep14(false, true);
  } else if(currentId == "step15"){
    prevId = handleStep15(false, true);
  } else if(currentId == "step16"){
    prevId = handleStep16(false, true);
  } else if(currentId == "step17"){
    prevId = handleStep17(false, true);
  } else if(currentId == "step18"){
    prevId = handleStep18(false, true);
  } else if(currentId == "step19"){
    prevId = handleStep19(false, true);
  } else if(currentId == "step20"){
    prevId = handleStep20(false, true);
  } else if(currentId == "step21"){
    prevId = handleStep21(false, true);
  } else if(currentId == "step22"){
    prevId = handleStep22(false, true);
  } else if(currentId == "step23"){
    prevId = handleStep23(false, true);
  } else if(currentId == "step24"){
    prevId = handleStep24(false, true);
  } else if(currentId == "step25"){
    prevId = handleStep25(false, true);
  } else if(currentId == "step26"){
    prevId = handleStep26(false, true);
  } else if(currentId == "step27"){
    prevId = handleStep27(false, true);
  } else if(currentId == "step28"){
    prevId = handleStep28(false, true);
  } else if(currentId == "step29"){
    prevId = handleStep29(false, true);
  } else if(currentId == "step30"){
    prevId = handleStep30(false, true);
  } else if(currentId == "step31"){
    prevId = handleStep31(false, true);
  } else if(currentId == "step32"){
    prevId = handleStep32(false, true);
  }
  $('[href="#'+prevId+'"]').tab('show');      
  return false; 
})

$('.done').click(function(){
  checkRequirements();
})

$('.first').click(function(){
  $('#myWizard a:first').tab('show')
})

function checkRequirements(){
  //Check that all required fields were filled out, and an option was selected in all combo boxes.
  var metAllRequirements = false; 
  var checkBoxesMetRequirements = checkComboBoxRequirements();
  var textResponseMetRequirements = checkTextResponseRequirements();
  if(checkBoxesMetRequirements && textResponseMetRequirements){
    metAllRequirements = true;
  }
  if(metAllRequirements){
    storeResults();
    updateActiveModels();
    updateHeaderBox();
    var close = document.getElementsByClassName("close");
    var closeButton = close[0];
    closeButton.click();    
  }
}

function storeResults(){
    var chemIdForNewModel;
    var chemPlusForNewModel;
    var popIdForNewModel;
    var routeIdForNewModel;
    var refIdForNewModel;
    var equatIdForNewModel;
    var softIdForNewModel;
    var notesForNewModel;
 
    var compartForNewModel = new Array();

    if(isStep2Existing != null && isStep2Existing){
      var chemSelection = document.getElementById("chemicalSelection");
      chemIdForNewModel  = chemicals[chemSelection[chemSelection.selectedIndex].value].chem_id;
    } else if(isStep2Existing != null && !isStep2Existing){
      var chemName = document.getElementById("nameText").value.trim();
      var contains = false;
      for(i =0; i < chemicals.length;i++){
        if(chemicals[i] != null && chemicals[i].name === chemName){
          contains = true;
          chemIdForNewModel = i;
        }
      }
      if(!contains){
        var chemIdForNewModel = chemicals[chemicals.length-1].chem_id + 1;
        var chemName = document.getElementById("nameText").value.trim();
        var chemDTXCID = document.getElementById("chemDTXCIDText").value.trim();
        var chemCAS = document.getElementById("chemCASText").value.trim();
        var chemRel = document.getElementById("chemRelationText").value.trim();
        var chemDTXSID = document.getElementById("chemDTXSIDText").value.trim();
        var newChemical = new Chemical(chemIdForNewModel, chemName, chemRel, chemDTXCID, "", chemDTXSID, chemCAS, "");
        chemicals.push(newChemical);
      }
    }
    chemPlusForNewModel = document.getElementById("chemPlusText").value.trim();
    if(isStep6Existing != null && isStep6Existing){
      var popSelection = document.getElementById("populationSelection");
      popIdForNewModel = populations.indexOf(populations[popSelection[popSelection.selectedIndex].value]);
    } else if(isStep6Existing != null && !isStep6Existing) {
      var speciesId = "";
      var genderId = "";
      var stageId = "";
      if(isStep8Existing != null && isStep8Existing){
        var specSelection = document.getElementById("speciesSelection");
        speciesId = species.indexOf(species[specSelection[specSelection.selectedIndex].value]);
      } else if (isStep8Existing != null && !isStep8Existing) {
        var newSpeciesName = document.getElementById("specNameText").value.trim();
        if(!species.includes(newSpeciesName)){
          species.push(newSpeciesName);   
        }    
        speciesId = species.indexOf(newSpeciesName);
      }
      if(isStep11Existing != null && isStep11Existing){
        var genSelection = document.getElementById("genderSelection");
        genderId = genders.indexOf(genders[genSelection[genSelection.selectedIndex].value]);
      } else if (isStep11Existing != null && !isStep11Existing) {
        var newGenderName = document.getElementById("genderText").value.trim();
        if(!genders.includes(newGenderName)){
          genders.push(newGenderName);
        }
        genderId = genders.indexOf(newGenderName);
      }
      if(isStep14Existing != null && isStep14Existing){
        var stageSelection = document.getElementById("stageSelection");
        stageId = stages.indexOf(stages[stageSelection[stageSelection.selectedIndex].value]);
      } else if (isStep14Existing != null && !isStep14Existing) {
        var newStageName = document.getElementById("stageText").value.trim();
        if(!stages.includes(newStageName)){
          stages.push(newStageName);
        }
        stageId = stages.indexOf(newStageName);
      }
      var newPopulation;
      var popExists = false;
      for(i =0; i < populations.length; i++){
         if(populations[i] != null){
           var spec = populations[i].species_id;
           var gen = populations[i].gender_id;
           var stg = populations[i].stage_id;
           if(spec == speciesId && gen == genderId && stg == stageId){
             popExists = true;
             popIdForNewModel = i;
           }
         }
      }
      if(!popExists){
        var newPopulation  = new Population(speciesId, genderId, stageId);
        populations.push(newPopulation);
        popIdForNewModel = populations.indexOf(newPopulation);
      }
    }
    if(isStep17Existing != null && isStep17Existing){
      var routeSelection = document.getElementById("routeSelection");
      routeIdForNewModel = routes.indexOf(routes[routeSelection[routeSelection.selectedIndex].value]);
    } else if (isStep17Existing != null && !isStep17Existing) {
      var newRouteName = document.getElementById("routeText").value.trim();
      if(!routes.includes(newRouteName)){
        routes.push(newRouteName);
      }
      routeIdForNewModel = routes.indexOf(newRouteName);
    }
    if(isStep20Existing != null && isStep20Existing){
      var refSelection = document.getElementById("referenceSelection");
      refIdForNewModel = refs.indexOf(refs[refSelection[refSelection.selectedIndex].value]);
    } else if (isStep20Existing != null && !isStep20Existing) {
      var refAuthor = document.getElementById("refAutText").value.trim();
      var refYear = document.getElementById("refYearText").value.trim();
      var refJour = document.getElementById("refJourText").value.trim();
      var refVol = document.getElementById("refVolText").value.trim();
      var refPage = document.getElementById("refPageText").value.trim();
      var refPubMed = document.getElementById("refPubMedText").value.trim();
      var refDOI = document.getElementById("refDOIText").value.trim();
      var newReference = new Reference(refAuthor, refYear, refJour, refVol, refPage, refPubMed, refDOI);
      refs.push(newReference);
      refIdForNewModel = refs.indexOf(newReference);
    }
    if(isStep23Existing != null && isStep23Existing){
      var compartSelection = document.getElementById("compartmentSelection");
      compartForNewModel.push(compartments.indexOf(compartments[compartSelection[compartSelection.selectedIndex].value]));
    } else if (isStep23Existing != null && !isStep23Existing) {
      var newCompartName = document.getElementById("compartText").value.trim();
      if(newCompartName.length > 0){
        var partsOfStr = newCompartName.split(',');
        for(i =0; i< partsOfStr.length; i++){
          if(!compartments.includes(partsOfStr[i].trim())){
            compartments.push(partsOfStr[i].trim());
          }
          compartForNewModel.push(compartments.indexOf(partsOfStr[i].trim()));
        }
      }
    }
    if(isStep26Existing != null && isStep26Existing){
      var equatSelection = document.getElementById("equationSelection");
      equatIdForNewModel = equation.indexOf(equation[equatSelection[equatSelection.selectedIndex].value]);
    } else if (isStep26Existing != null && !isStep26Existing) {
      var newEquationName = document.getElementById("equatText").value.trim();
      if(newEquationName.length > 0) {
        if(!equation.includes(newEquationName)){
          equation.push(newEquationName);
        }
        equatIdForNewModel = equation.indexOf(newEquationName);
      } else {
        equatIdForNewModel = "";
      }
    }
    if(isStep29Existing != null && isStep29Existing){
      var softSelection = document.getElementById("softwareSelection");
      softIdForNewModel = software.indexOf(software[softSelection[softSelection.selectedIndex].value]);
    } else if (isStep29Existing != null && !isStep29Existing) {
      var newSoftwareName = document.getElementById("softText").value.trim();
      if(newSoftwareName.length > 0) {
        if(!software.includes(newSoftwareName)){
          software.push(newSoftwareName);
        }
        softIdForNewModel = software.indexOf(newSoftwareName);
      } else {
        softIdForNewModel = "";
      }
    }
    notesForNewModel = document.getElementById("notesText").value.trim();
   
    var newModel = new Model(chemIdForNewModel, chemPlusForNewModel, popIdForNewModel, routeIdForNewModel, refIdForNewModel, equatIdForNewModel, softIdForNewModel, notesForNewModel);
    for(i =0; i < compartForNewModel.length; i++){
      newModel.compartmentsList.push(compartForNewModel[i]);
    }
    models.push(newModel);
}

function checkTextResponseRequirements(){
  var metRequirements = true;
  if(isStep2Existing != null && !isStep2Existing){
    var chemNameText = document.getElementById("nameText");
    if(chemNameText.value.trim().length <=0){
      metRequirements = false;
    }
  }
  if(isStep8Existing != null && !isStep8Existing){
    var specNameText = document.getElementById("specNameText");
    if(specNameText.value.trim().length <=0){
      metRequirements = false;
    }
  }
  if(isStep11Existing != null && !isStep11Existing){
    var genderText = document.getElementById("genderText");
    if(genderText.value.trim().length <=0){
      metRequirements = false;
    }
  }
  if(isStep14Existing != null && !isStep14Existing){
    var stageText = document.getElementById("stageText");
    if(stageText.value.trim().length <=0){
      metRequirements = false;
    }
  }
  if(isStep17Existing != null && !isStep17Existing){
    var routeText = document.getElementById("routeText");
    if(routeText.value.trim().length <=0){
      metRequirements = false;
    }
  }
  if(isStep20Existing != null && !isStep20Existing){
    var refAutText = document.getElementById("refAutText");
    if(refAutText.value.trim().length <=0){
      metRequirements = false;
    }
  }
  if(isStep23Existing != null && !isStep23Existing){
    var compartText = document.getElementById("compartText");
    if(compartText.value.trim().length <=0){
      metRequirements = false;
    }
  }
  return metRequirements;
}

function checkComboBoxRequirements(){
  var metRequirements = true;
  if(isStep2Existing != null && isStep2Existing){
    var step4ComboBox = document.getElementById("chemicalSelection");
    if(step4ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep6Existing != null && isStep6Existing){
    var step7ComboBox = document.getElementById("populationSelection");
    if(step7ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep8Existing != null && isStep8Existing){
    var step10ComboBox = document.getElementById("speciesSelection");
    if(step10ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep11Existing != null && isStep11Existing){
    var step13ComboBox = document.getElementById("genderSelection");
    if(step13ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep14Existing != null && isStep14Existing){
    var step16ComboBox = document.getElementById("stageSelection");
    if(step16ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep17Existing != null && isStep17Existing){
    var step19ComboBox = document.getElementById("routeSelection");
    if(step19ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep20Existing != null && isStep20Existing){
    var step22ComboBox = document.getElementById("referenceSelection");
    if(step22ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep23Existing != null && isStep23Existing){
    var step25ComboBox = document.getElementById("compartmentSelection");
    if(step25ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep26Existing != null && isStep26Existing){
    var step28ComboBox = document.getElementById("equationSelection");
    if(step28ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  if(isStep29Existing != null && isStep29Existing){
    var step31ComboBox = document.getElementById("softwareSelection");
    if(step31ComboBox.selectedIndex <=0){
      metRequirements = false;
    }
  }
  return metRequirements; 
}

function handleStep2(next, previous){
  if(next){
	var isExisting = isExistingChecked("step2");
	isStep2Existing = isExisting;
	if(isExisting !== null && isExisting){
      return "step4";
    } else if (isExisting !== null && !isExisting){
      return "step3";
    } else {
      return "";
    }
  } else if (previous){
    return "step1";
  }
}

function handleStep3(next, previous){
  if(next){
    return "step5";
  } else if (previous){
	handleButtonsAfterNav("step2");
    return "step2";
  }
}

function handleStep4(next, previous){
  if(next){
    return "step5";
  } else if (previous){
	handleButtonsAfterNav("step2");
    return "step2";
  }
}

function handleStep5(next, previous){
  if(next){
	handleButtonsAfterNav("step6");
    return "step6";
  } else if (previous){
	if(isStep2Existing){
	  document.getElementById("step2ExistingRadioButton").checked = true;
	  return "step4";
	} else {
	  document.getElementById("step2NewRadioButton").checked = true;
	  return "step3";
	}
  }
}

function handleStep6(next, previous){
  if(next){
    var isExisting = isExistingChecked("step6");
	isStep6Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step7";
    } else if (isExisting !== null && !isExisting){
      handleButtonsAfterNav("step8");
      return "step8";
    } else {
      return "";
    }
  } else if (previous){
    return "step5";
  }
}

function handleStep7(next, previous){
  if(next){
	handleButtonsAfterNav("step17");
    return "step17";
  } else if (previous){
	handleButtonsAfterNav("step6");
    return "step6";
  }
}

function handleStep8(next, previous){
  if(next){
    var isExisting = isExistingChecked("step8");
	isStep8Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step10";
    } else if (isExisting !== null && !isExisting){
      return "step9";
    } else {
      return "";
    }
  } else if (previous){
	handleButtonsAfterNav("step6");
    return "step6";
  }
}

function handleStep9(next, previous){
  if(next){
	handleButtonsAfterNav("step11");
    return "step11";
  } else if (previous){
	handleButtonsAfterNav("step8");
    return "step8";
  }
}

function handleStep10(next, previous){
  if(next){
	handleButtonsAfterNav("step11");
    return "step11";
  } else if (previous){
	handleButtonsAfterNav("step8");
    return "step8";
  }
}

function handleStep11(next, previous){
  if(next){
    var isExisting = isExistingChecked("step11");
	isStep11Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step13";
    } else if (isExisting !== null && !isExisting){
      return "step12";
    } else {
      return "";
    }
  } else if (previous){
    if(isStep8Existing){
	  document.getElementById("step8ExistingRadioButton").checked = true;
	  return "step10";
	} else {
	  document.getElementById("step8NewRadioButton").checked = true;
	  return "step9";
	}
  }
}

function handleStep12(next, previous){
  if(next){
	handleButtonsAfterNav("step14");
    return "step14";
  } else if (previous){
	handleButtonsAfterNav("step11");
    return "step11";
  }
}

function handleStep13(next, previous){
  if(next){
	handleButtonsAfterNav("step14");
    return "step14";
  } else if (previous){
	handleButtonsAfterNav("step11");
    return "step11";
  }
}

function handleStep14(next, previous){
  if (next){
    var isExisting = isExistingChecked("step14");
	isStep14Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step16";
    } else if (isExisting !== null && !isExisting){
      return "step15";
    } else {
      return "";
    }
  } else if (previous){
	if(isStep11Existing){
	  document.getElementById("step11ExistingRadioButton").checked = true;
	  return "step13";
	} else {
	  document.getElementById("step11NewRadioButton").checked = true;
	  return "step12";
	}   
  }
}

function handleStep15(next, previous){
  if(next){
	handleButtonsAfterNav("step17");
    return "step17";
  } else if (previous){
	handleButtonsAfterNav("step14");
    return "step14";
  }
}

function handleStep16(next, previous){
  if(next){
	handleButtonsAfterNav("step17");
    return "step17";
  } else if (previous){
	handleButtonsAfterNav("step14");
    return "step14";
  }
}

function handleStep17(next, previous){
  if (next) {
   var isExisting = isExistingChecked("step17");
   isStep17Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step19";
    } else if (isExisting !== null && !isExisting){
      return "step18";
    } else {
      return "";
    }
  } else if (previous){
    if (isStep6Existing) {
	  document.getElementById("step6ExistingRadioButton").checked = true;
	  return "step7";
	} else {
	  document.getElementById("step6NewRadioButton").checked = true;
	  if (isStep14Existing){
	    document.getElementById("step14ExistingRadioButton").checked = true;
		return "step16";
	  } else {
		document.getElementById("step14NewRadioButton").checked = true;
		return "step15";
	  }
	}  
  }
}

function handleStep18(next, previous){
   if(next){
	handleButtonsAfterNav("step20");
    return "step20";
  } else if (previous){
	handleButtonsAfterNav("step17");
    return "step17";
  }
}

function handleStep19(next, previous){
  if(next){
	handleButtonsAfterNav("step20");
    return "step20";
  } else if (previous){
	handleButtonsAfterNav("step17");
    return "step17";
  }
}

function handleStep20(next, previous){
  if(next){
   var isExisting = isExistingChecked("step20");
   isStep20Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step22";
    } else if (isExisting !== null && !isExisting){
      return "step21";
    } else {
      return "";
    } 
  } else if (previous){
	if(isStep17Existing){
	  document.getElementById("step17ExistingRadioButton").checked = true;
	  return "step19";
	} else {
	  document.getElementById("step17NewRadioButton").checked = true;
	  return "step18";
	}
  }
}

function handleStep21(next, previous){
  if(next){
	handleButtonsAfterNav("step23");
    return "step23";
  } else if (previous){
	handleButtonsAfterNav("step20");
    return "step20";
  }
}

function handleStep22(next, previous){
  if(next){
	handleButtonsAfterNav("step23");
    return "step23";
  } else if (previous){
	handleButtonsAfterNav("step20");
    return "step20";
  }
}

function handleStep23(next, previous){
  if(next){
   var isExisting = isExistingChecked("step23");
   isStep23Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step25";
    } else if (isExisting !== null && !isExisting){
      return "step24";
    } else {
      return "";
    }
  } else if (previous){
    if(isStep20Existing){
      document.getElementById("step20ExistingRadioButton").checked = true;
      return "step22";
    } else {
      document.getElementById("step20NewRadioButton").checked = true;
      return "step21";
    }
  }
}

function handleStep24(next, previous){
  if(next){
	handleButtonsAfterNav("step26");
    return "step26";
  } else if (previous){
	handleButtonsAfterNav("step23");
    return "step23";
  }
}

function handleStep25(next, previous){
  if(next){
	handleButtonsAfterNav("step26");
    return "step26";
  } else if (previous){
	handleButtonsAfterNav("step23");
    return "step23";
  }
}

function handleStep26(next, previous){
  if(next) {
    var isExisting = isExistingChecked("step26");
    isStep26Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step28";
    } else if (isExisting !== null && !isExisting){
      return "step27";
    } else {
      return "";
    }
  } else if (previous){
    if(isStep23Existing){
      document.getElementById("step23ExistingRadioButton").checked = true;
      return "step25";
    } else {
      document.getElementById("step23NewRadioButton").checked = true;
      return "step24";
    } 
  }
}

function handleStep27(next, previous){
  if(next){
	handleButtonsAfterNav("step29");
    return "step29";
  } else if (previous){
	handleButtonsAfterNav("step26");
    return "step26";
  }
}

function handleStep28(next, previous){
  if(next){
	handleButtonsAfterNav("step29");
    return "step29";
  } else if (previous){
	handleButtonsAfterNav("step26");
    return "step26";
  }
}

function handleStep29(next, previous){
  if(next){
    var isExisting = isExistingChecked("step29");
    isStep29Existing = isExisting;
    if(isExisting !== null && isExisting){
      return "step31";
    } else if (isExisting !== null && !isExisting){
      return "step30";
    } else {
      return "";
    }
  } else if (previous){
    if(isStep26Existing){
      document.getElementById("step26ExistingRadioButton").checked = true;
      return "step28";
    } else {
      document.getElementById("step26NewRadioButton").checked = true;
      return "step27";
    } 
  }
}

function handleStep30(next, previous){
  if(next){
    return "step32";
  } else if (previous){
	handleButtonsAfterNav("step29");
    return "step29";
  }
}

function handleStep31(next, previous){
  if(next){
    return "step32";
  } else if (previous){
	handleButtonsAfterNav("step29");
    return "step29";
  }
}

function handleStep32(next, previous){
  if(next){
    return "";
  } else if (previous){
    if(isStep29Existing){
      document.getElementById("step29ExistingRadioButton").checked = true;
      return "step31";
    } else {
      document.getElementById("step29NewRadioButton").checked = true;
      return "step30";
    }
  }
}

function handleButtonsAfterNav(stepId){
  if(stepId === "step2"){
    if(isStep2Existing != null && isStep2Existing){
      document.getElementById("step2ExistingRadioButton").checked = true;
    } else if(isStep2Existing != null && !isStep2Existing){
      document.getElementById("step2NewRadioButton").checked = true;
    }
  } else if (stepId === "step6") {
    if(isStep6Existing != null && isStep6Existing){
      document.getElementById("step6ExistingRadioButton").checked = true;
    } else if(isStep6Existing != null && !isStep6Existing) {
      document.getElementById("step6NewRadioButton").checked = true;
    }
  } else if (stepId === "step8") {
    if(isStep8Existing != null && isStep8Existing){
      document.getElementById("step8ExistingRadioButton").checked = true;
    } else if (isStep8Existing != null && !isStep8Existing) {
      document.getElementById("step8NewRadioButton").checked = true;
    }
  } else if (stepId === "step11") {
    if(isStep11Existing != null && isStep11Existing){
      document.getElementById("step11ExistingRadioButton").checked = true;
    } else if (isStep11Existing != null && !isStep11Existing) {
      document.getElementById("step11NewRadioButton").checked = true;
    }
  } else if (stepId === "step14") {
    if(isStep14Existing != null && isStep14Existing){
      document.getElementById("step14ExistingRadioButton").checked = true;
    } else if (isStep14Existing != null && !isStep14Existing) {
      document.getElementById("step14NewRadioButton").checked = true;
    }
  } else if (stepId === "step17") {
    if(isStep17Existing != null && isStep17Existing){
      document.getElementById("step17ExistingRadioButton").checked = true;
    } else if (isStep17Existing != null && !isStep17Existing) {
      document.getElementById("step17NewRadioButton").checked = true;
    }
  } else if (stepId === "step20") {
    if(isStep20Existing != null && isStep20Existing){
      document.getElementById("step20ExistingRadioButton").checked = true;
    } else if (isStep20Existing != null && !isStep20Existing) {
      document.getElementById("step20NewRadioButton").checked = true;
    }
  } else if (stepId === "step23") {
    if(isStep23Existing != null && isStep23Existing){
      document.getElementById("step23ExistingRadioButton").checked = true;
    } else if (isStep23Existing != null && !isStep23Existing) {
      document.getElementById("step23NewRadioButton").checked = true;
    }
  } else if (stepId === "step26") {
    if(isStep26Existing != null && isStep26Existing){
      document.getElementById("step26ExistingRadioButton").checked = true;
    } else if (isStep26Existing != null && !isStep26Existing) {
      document.getElementById("step26NewRadioButton").checked = true;
    }
  } else if (stepId === "step29") {
    if(isStep29Existing != null && isStep29Existing){
      document.getElementById("step29ExistingRadioButton").checked = true;
    } else if (isStep29Existing != null && !isStep29Existing) {
      document.getElementById("step29NewRadioButton").checked = true;
    }
  } 
}

function isExistingChecked(panelId){
  var existingButton = document.getElementById(panelId + "ExistingRadioButton");
  var newButton = document.getElementById(panelId + "NewRadioButton");
  if(existingButton.checked && !newButton.checked){
    return true;
  } else if (!existingButton.checked && newButton.checked){
    return false;
  } else {
	return null;  
  }
}

});


function iris1Alert(){
  if (location.host.startsWith("iris1")){
    var newHref = location.href.replaceAll("iris1","iris3");
    alert("NOTE: The host is now iris3 instead of iris1.\nPlease copy and save this URL for future use:\n\n"+newHref+"\n\nClick OK to be redirected now...");
    location.replace(newHref);
  }
}

function add_collapsed_chem_row(chem_id){
  var tbody = document.getElementById("chem_table_body");
  var row1 = document.createElement("tr");
  var td11 = document.createElement("td");
  td11.setAttribute("colspan",7);
  td11.style.borderBottom = "4px solid #888";

  
  row1.appendChild(td11);
  tbody.appendChild(row1);
  
  var row2 = document.createElement("tr");
  if (chemicals[chem_id] == undefined){
    alert ("Can't find chem: "+chem_id);
    return;
  }
  var chem = chemicals[chem_id];

  var td21 = document.createElement("td");
  td21.style.width = "200px";
  td21.style.borderLeft = "1px solid #888";
  
  var cid = chem.dtxcid;
  if (cid.length > 0){
    var image = document.createElement("img");
    //Comptox API call to get chemical structure images
    image.src = "https://comptox.epa.gov/dashboard-api/ccdapp1/chemical-files/image/by-dtxcid/" + cid;
    image.width = "200";
    image.height = "200";
    td21.appendChild(image);
   
  } else {
    td21.appendChild(document.createTextNode("(no structure)"));
    td21.style.textAlign = "center";
  }
  row2.appendChild(td21);

  // NOW build much info
  var modelCount = 0;
  var referenceObj = new Object();
  var populationObj = new Object();
  var routesObj = new Object();
  var compartmentsObj = new Object();
  for (var i = 0; i < activeModels.length; i++){
    var mod = models[activeModels[i]];
    if(mod.chem_id == chem_id){
      modelCount++;
      populationObj[mod.population_id]=1; 
      referenceObj[mod.refId] = 1;
        routesObj[routes[mod.route_id ]]=1;
      for (var j = 0; j < mod.compartmentsList.length; j++){
        compartmentsObj[compartments[mod.compartmentsList[j]]]=1;
      }
    }
  }
  var refCount = 0;
  for (var key in referenceObj){refCount++;}
  var speciesObj = new Object()
  var stageObj = new Object();
  var genderObj = new Object();
  for (var popKey in populationObj){
    var pop = populations[popKey];
    speciesObj[species_full[pop.species_id]]=1;
    stageObj[stages[pop.stage_id]]=1;
    genderObj[genders[pop.gender_id]]=1;
  }
  var td22 = document.createElement("td");
  td22.appendChild(document.createTextNode(modelCount+" model(s)"));
  td22.appendChild(document.createElement("br"));
  td22.appendChild(document.createTextNode(refCount+" ref(s)"));
  td22.style.minWidth = "75px";
  row2.appendChild(td22);

  var toSort = new Array();
  for (key in speciesObj){
    toSort.push(key);
  }
  var td23 = document.createElement("td");
  td23.appendChild(document.createTextNode(toSort.sort().join(", ")));
  td23.style.minWidth = "70px";
  row2.appendChild(td23);

  toSort = new Array();
  for (key in routesObj){
    toSort.push(key);
  }
  var td24 = document.createElement("td");
  td24.appendChild(document.createTextNode(toSort.sort().join(", ")));
  td24.style.minWidth = "75px";
  row2.appendChild(td24);

  toSort = new Array();
  for (key in genderObj){
    toSort.push(key);
  }
  var td25 = document.createElement("td");
  td25.appendChild(document.createTextNode(toSort.sort().join(", ")));
  td25.style.minWidth = "70px";
  row2.appendChild(td25);

  toSort = new Array();
  for (key in stageObj){
    toSort.push(key);
  }
  var td26 = document.createElement("td");
  td26.appendChild(document.createTextNode(toSort.sort().join(", ")));
  td26.style.minWidth = "70px";
  row2.appendChild(td26);

  toSort = new Array();
  for (key in compartmentsObj){
    toSort.push(key);
  }

  var td27 = document.createElement("td");
  td27.appendChild(document.createTextNode(toSort.sort().join(", ")));
  td27.style.minWidth = "150px";
  td27.style.borderRight = "1px solid #888";
  row2.appendChild(td27);

  tbody.appendChild(row2);
  // If a bad image is returned, we don't konw the size until after it is rendered
  // If it is less than 100, replace it with a "(no structure)" text
  if (false){ // THIS IS DESIGNED TO HANDLE IMAGES THAT DO NOT LOAD QUICKLY
    if (row2.firstElementChild.firstElementChild != null && row2.firstElementChild.firstElementChild.clientWidth < 100){
      row2.firstElementChild.removeChild(row2.firstElementChild.firstElementChild);
      row2.firstElementChild.insertBefore(document.createTextNode("(no structure)"),row2.firstElementChild.firstElementChild);
    }
  }
  var row3 = document.createElement("tr");
  var td31 = document.createElement("td");
  td31.setAttribute("colspan",7);
  td31.appendChild(document.createTextNode(chem.name));
  td31.style.borderLeft = "1px solid #888";
  td31.style.borderRight = "1px solid #888";
  row3.appendChild(td31);
  tbody.appendChild(row3);

  var chemNote = chem.chem_relationship;
  if (chemNote != ""){
    var row4 = document.createElement("tr");
    var td41 = document.createElement("td");
    td41.setAttribute("colspan",7);
    td41.appendChild(document.createTextNode("Note: "+chemNote));
    td41.style.borderLeft = "1px solid #888";
    td41.style.borderRight = "1px solid #888";
    td41.style.paddingLeft = "15px";
    row4.appendChild(td41);
    tbody.appendChild(row4);
  }
}

function rebuildSpeciesPulldown(){
  var speciesDiv = document.getElementById("species");
  var oneSpecies = speciesDiv.firstElementChild;
  
  while (oneSpecies != null){
    speciesDiv.removeChild(oneSpecies);
    oneSpecies = speciesDiv.firstElementChild;
  }

  // Don't know what biggest is, but know when to stop
  //
  var biggestUnchecked = null;
  var hitCountDown = modelCount.species.length;
  var count = -1;
  while (hitCountDown > 0){
    count++;
    var next = 0;
    var index = modelCount.species.indexOf(count,0);
    while (index > -1){
      hitCountDown--;
      var anchor = document.createElement("a");
      anchor.classList.add("list-group-item");
      if(count > 0){
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "species_"+index;
        checkbox.addEventListener('click', handleCheckBox, false);
        if (filters.species.indexOf(index) > -1){
          checkbox.checked = true;
          anchor.appendChild(checkbox);
          anchor.appendChild(document.createTextNode("  "+species_full[index]+" ("+count+")"));
          speciesDiv.insertBefore(anchor,speciesDiv.firstElementChild);
        } else {
          checkbox.checked = false;
          anchor.appendChild(checkbox);
          if(filters.species.length > 0){
            anchor.appendChild(document.createTextNode("  "+species_full[index]+" (+"+count+")"));
          } else {
            anchor.appendChild(document.createTextNode("  "+species_full[index]+" ("+count+")"));
          }
          if (biggestUnchecked == null){speciesDiv.appendChild(anchor); }
          else {speciesDiv.insertBefore(anchor,biggestUnchecked);}
          biggestUnchecked = anchor;
        }
      }
      
      next = index+1;
      index = modelCount.species.indexOf(count,next);
      if (next > index){index = -1;}
    }
  }
}

function rebuildRoutesPulldown(){
  var routesDiv = document.getElementById("routes");
  var oneRoutes = routesDiv.firstElementChild;
  while (oneRoutes != null){
    routesDiv.removeChild(oneRoutes);
    oneRoutes = routesDiv.firstElementChild;
  }

  var hitCountDown = modelCount.routes.length;
  var count = -1;
  var biggestUnchecked = null;
  while (hitCountDown > 0){
    count++;
    var next = 0;
    var index = modelCount.routes.indexOf(count,0);
    while (index > -1){
      //console.log(count,next,index);
      hitCountDown--;
      var anchor = document.createElement("a");
      anchor.classList.add("list-group-item");
      if(count > 0){
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "routes_"+index;
        checkbox.addEventListener('click', handleCheckBox, false);
        if (filters.routes.indexOf(index) > -1){
          checkbox.checked = true;
          anchor.appendChild(checkbox);
          anchor.appendChild(document.createTextNode("  "+routes[index]+" ("+count+")"));
          routesDiv.insertBefore(anchor,routesDiv.firstElementChild);
        } else {
          checkbox.checked = false;
          anchor.appendChild(checkbox);
          if(filters.routes.length > 0){
            anchor.appendChild(document.createTextNode("  "+routes[index]+" (+"+count+")"));
          } else {
            anchor.appendChild(document.createTextNode("  "+routes[index]+" ("+count+")"));
          }
          if (biggestUnchecked == null){routesDiv.appendChild(anchor); }
          else {routesDiv.insertBefore(anchor,biggestUnchecked);}
          biggestUnchecked = anchor;
        }
      }
      
      next = index+1;
      index = modelCount.routes.indexOf(count,next);
      if (next > index){index = -1;}
    }
  }
}

function rebuildGendersPulldown(){
  var unspecified_anchor = document.getElementById("unspecified_anchor");
  var numUnspecified = modelCount.genders[0];
  unspecified_anchor.nextSibling.data = "  unspecified ("+numUnspecified+")";

  var female_anchor = document.getElementById("female_anchor");
  var numFemale = modelCount.genders[1];
  female_anchor.nextSibling.data = "  female ("+numFemale+")";

  var numMale = modelCount.genders[2];
  var male_anchor = document.getElementById("male_anchor");
  male_anchor.nextSibling.data = "  male ("+numMale+")";
} 

function rebuildStagesPulldown(){
  var stagesDiv = document.getElementById("stages");
  var oneStages = stagesDiv.firstElementChild;
  while (oneStages != null){
    stagesDiv.removeChild(oneStages);
    oneStages = stagesDiv.firstElementChild;
  }

  var hitCountDown = modelCount.stages.length;
  var count = -1;
  var biggestUnchecked = null;
  while (hitCountDown > 0){
    count++;
    var next = 0;
    var index = modelCount.stages.indexOf(count,0);
    while (index > -1){
      hitCountDown--;
      var anchor = document.createElement("a");
      anchor.classList.add("list-group-item");
      if(count > 0){
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "stages_"+index;
        checkbox.addEventListener('click', handleCheckBox, false);
        if (filters.stages.indexOf(index) > -1){
          checkbox.checked = true;
          anchor.appendChild(checkbox);
          anchor.appendChild(document.createTextNode("  "+stages[index]+" ("+count+")"));
          stagesDiv.insertBefore(anchor,stagesDiv.firstElementChild);
        } else {
          checkbox.checked = false;
          anchor.appendChild(checkbox);
          if(filters.stages.length > 0){
            anchor.appendChild(document.createTextNode("  "+stages[index]+" (+"+count+")"));
          } else {
            anchor.appendChild(document.createTextNode("  "+stages[index]+" ("+count+")"));
          }
          if (biggestUnchecked == null){stagesDiv.appendChild(anchor); }
          else {stagesDiv.insertBefore(anchor,biggestUnchecked);}
          biggestUnchecked = anchor;
        }
      }
      
      next = index+1;
      index = modelCount.stages.indexOf(count,next);
      if (next > index){index = -1;}
    }
  }
}

function rebuildCompartmentsPulldown(){
  var compartmentsDiv = document.getElementById("compartments");
  var oneCompartments = compartmentsDiv.firstElementChild;
  while (oneCompartments != null){
    compartmentsDiv.removeChild(oneCompartments);
    oneCompartments = compartmentsDiv.firstElementChild;
  }

  var biggestUnchecked = null;
  var compKeys = Object.keys(modelCount.compartments);
  var compVals = Object.values(modelCount.compartments);
  var hitCountDown = compKeys.length - 1;
  var count = -1;
  while (hitCountDown > 0){
    count++;
    var next = 0;
    var index = compVals.indexOf(count,0);
    while (index > -1){
      var theKey = compKeys[index];
      hitCountDown--;
      var anchor = document.createElement("a");
      anchor.classList.add("list-group-item");
      if(count > 0){
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "compartments_"+theKey;
        checkbox.addEventListener('click', handleCheckBox, false);
        if (filters.compartments.indexOf(1*theKey) > -1){
          checkbox.checked = true;
          anchor.appendChild(checkbox);
          if(filters.compartments.length > 0){
            anchor.appendChild(document.createTextNode("  "+compartments[theKey]+" (+"+count+")"));
          } else {
            anchor.appendChild(document.createTextNode("  "+compartments[theKey]+" ("+count+")"));
          }
          compartmentsDiv.insertBefore(anchor,compartmentsDiv.firstElementChild);
        } else {
          checkbox.checked = false;
          anchor.appendChild(checkbox);
          if(filters.compartments.length > 0){
            anchor.appendChild(document.createTextNode("  "+compartments[theKey]+" (+"+count+")"));
          } else {
            anchor.appendChild(document.createTextNode("  "+compartments[theKey]+" ("+count+")"));
          }
          if (biggestUnchecked == null){compartmentsDiv.appendChild(anchor); }
          else {compartmentsDiv.insertBefore(anchor,biggestUnchecked);}
          biggestUnchecked = anchor;
        }
      }
      
      next = index+1;
      index = compVals.indexOf(count,next);
      if (next > index){index = -1;}
    }
  }
  return;
}

function initFilters(){
  filters.chemFilters = new Array();
  filters.genders = new Array();
  filters.species = new Array();
  filters.routes = new Array();
  filters.stages = new Array();
  filters.compartments = new Array();
  filterListParents = document.getElementsByClassName("list-group-submenu");
  for (var i = 0; i < filterListParents.length; i++){
    var listParent = filterListParents[i];
    var anchorElement = listParent.firstElementChild;
    while (anchorElement != null){
      var check_item = anchorElement.firstElementChild;
      if (check_item != null){
        var parts = check_item.name.split(/_/); 
        check_item.addEventListener('click', handleCheckBox, false);
          
        if (check_item.checked){
          filters[parts[0]].push(1*parts[1]);
        }
      }
      var ae = anchorElement.nextElementSibling;
      anchorElement = ae;
    }
  }
}

function makeChemFilterText(chemFilter){
  if (chemFilter.isExact){
    return "Exact "+chemFilter.stringType+": " +chemFilter.stringText;
  }
  return chemFilter.stringType+" contains: " +chemFilter.stringText;
}

function handleCheckBox(event){
  var ce = event.target;
  var parts = ce.name.split(/_/); 
  if (ce.checked) {
    // add this to appropriate filters array
    filters[parts[0]].push(1*parts[1]);
  } else {
    // remove this from appropriate filters array
    filters[parts[0]].splice(filters[parts[0]].indexOf(1*parts[1]),1);
  }
  updateActiveModels();
  fixPageNum();
  drawChemRows();
  update_filterRow_text();
  updateHeaderBox();
}

function clearFilterDiv(){
  var filterRow = document.getElementById("filterRow");
  var toClear = filterRow.firstChild;
  while (toClear != null){
    filterRow.removeChild(toClear);
    toClear = filterRow.firstChild;
  }
}

function removeFilter(event){
  var parts = event.target.id.split(/_/);
  var type = parts[0];
  var index = 1*parts[1];
  if (parts[0] == "xChem"){
    filters.chemFilters.splice(index,1);
  } else if (parts[0] == "xS"){
    filters.species.splice(filters.species.indexOf(index),1);
  } else if (parts[0] == "xR"){
    filters.routes.splice(filters.routes.indexOf(index),1);
  } else if (parts[0] == "xG"){
    filters.genders.splice(filters.genders.indexOf(index),1);
    if (index == 0){document.getElementById("unspecified_anchor").checked=false;}
    else if (index == 1){document.getElementById("female_anchor").checked=false;}
    else if (index == 2){document.getElementById("male_anchor").checked=false;}
  } else if (parts[0] == "xL"){
    filters.stages.splice(filters.stages.indexOf(index),1);
  } else if (parts[0] == "xComp"){
    filters.compartments.splice(filters.compartments.indexOf(index),1);
  }
  updateActiveModels();
  drawChemRows();
  update_filterRow_text();
  updateHeaderBox();
}

function update_filterRow_text(){
  clearFilterDiv();
  var filterRow = document.getElementById("filterRow");
  if ((filters.chemFilters.length + filters.genders.length + filters.species.length + filters.routes.length + filters.stages.length + filters.compartments.length) == 0){
    return;
  }

  var th=document.createElement("th");

  if (filters.chemFilters.length > 0){
    if (filters.chemFilters.length == 2){
      th.appendChild(document.createTextNode("(Either)"));
      th.appendChild(document.createElement("br"));
    }
    else if (filters.chemFilters.length > 2){
      th.appendChild(document.createTextNode("(Any of)"));
      th.appendChild(document.createElement("br"));
    }
    for (var i = 0; i < filters.chemFilters.length; i++){
      boxDiv = document.createElement("div");
      boxDiv.style.cursor="pointer";
      boxDiv.style.float="left";
      xDiv = document.createElement("div");
      xDiv.style.color="#f00";
      xDiv.style.float="left";
      xDiv.addEventListener('click', removeFilter, false);
      xDiv.id = "xChem_"+i;
      xDiv.appendChild(document.createTextNode("x"));
      boxDiv.appendChild(xDiv);
      boxDiv.appendChild(document.createTextNode(makeChemFilterText(filters.chemFilters[i])+" "));
      th.appendChild(boxDiv);
    }
  }
  filterRow.appendChild(th); // Chemical column

  updateHeaderBox();
  th=document.createElement("th");
  filterRow.appendChild(th); // Model / Ref column

  th=document.createElement("th");
  var boxDiv;
  var xDiv; 
  if (filters.species.length > 0){
    if (filters.species.length == 2){
      th.appendChild(document.createTextNode("(Either)"));
      th.appendChild(document.createElement("br"));
    }
    else if (filters.species.length > 2){
      th.appendChild(document.createTextNode("(Any of)"));
      th.appendChild(document.createElement("br"));
    }
    for (var i = 0; i < filters.species.length; i++){
      boxDiv = document.createElement("div");
      boxDiv.style.cursor="pointer";
      boxDiv.style.float="left";
      xDiv = document.createElement("div");
      xDiv.style.color="#f00";
      xDiv.style.float="left";
      xDiv.addEventListener('click', removeFilter, false);
      xDiv.id = "xS_"+filters.species[i];
      xDiv.appendChild(document.createTextNode("x"));
      boxDiv.appendChild(xDiv);
      boxDiv.appendChild(document.createTextNode(species_full[filters.species[i]]+" "));
      th.appendChild(boxDiv);
    }
  }
  filterRow.appendChild(th); // Species column

  th=document.createElement("th");
  var boxDiv;
  var xDiv; 
  if (filters.routes.length > 0){
    if (filters.routes.length == 2){
      th.appendChild(document.createTextNode("(Either)"));
      th.appendChild(document.createElement("br"));
    }
    else if (filters.routes.length > 2){
      th.appendChild(document.createTextNode("(Any of)"));
      th.appendChild(document.createElement("br"));
    }
    for (var i = 0; i < filters.routes.length; i++){
      boxDiv = document.createElement("div");
      boxDiv.style.cursor="pointer";
      boxDiv.style.float="left";
      xDiv = document.createElement("div");
      xDiv.style.color="#f00";
      xDiv.style.float="left";
      xDiv.addEventListener('click', removeFilter, false);
      xDiv.id = "xR_"+filters.routes[i];
      xDiv.appendChild(document.createTextNode("x"));
      boxDiv.appendChild(xDiv);
      boxDiv.appendChild(document.createTextNode(routes[filters.routes[i]]+" "));
      th.appendChild(boxDiv);
    }
  }
  filterRow.appendChild(th); // Routes column

  th=document.createElement("th");
  if (filters.genders.length == 1){
    boxDiv = document.createElement("div");
    boxDiv.style.cursor="pointer";
    boxDiv.style.float="left";
    xDiv = document.createElement("div");
    xDiv.style.color="#f00";
    xDiv.style.float="left";
    xDiv.addEventListener('click', removeFilter, false);
    xDiv.id = "xG_"+filters.genders[0];
    xDiv.appendChild(document.createTextNode("x"));
    boxDiv.appendChild(xDiv);
    boxDiv.appendChild(document.createTextNode(genders[filters.genders[0]]+" "));
    th.appendChild(boxDiv);
  } else if (filters.genders.length == 2){
    th.appendChild(document.createTextNode("(Either)"));
    boxDiv = document.createElement("div");
    boxDiv.style.cursor="pointer";
    boxDiv.style.float="left";
    xDiv = document.createElement("div");
    xDiv.style.color="#f00";
    xDiv.style.float="left";
    xDiv.addEventListener('click', removeFilter, false);
    //xDiv.id = "xG_1";
    xDiv.id = "xG_"+filters.genders[0];
    xDiv.appendChild(document.createTextNode("x"));
    boxDiv.appendChild(xDiv);
    boxDiv.style.float="left";
    boxDiv.appendChild(document.createTextNode(genders[filters.genders[0]]+" "));
    th.appendChild(boxDiv);
    boxDiv = document.createElement("div");
    boxDiv.style.cursor="pointer";
    boxDiv.style.float="left";
    xDiv = document.createElement("div");
    xDiv.style.color="#f00";
    xDiv.style.float="left";
    xDiv.addEventListener('click', removeFilter, false);
    xDiv.id = "xG_"+filters.genders[1];
    xDiv.appendChild(document.createTextNode("x"));
    boxDiv.appendChild(xDiv);
    boxDiv.appendChild(document.createTextNode(genders[filters.genders[1]]+" "))
    th.appendChild(boxDiv);
  } else if (filters.genders.length == 3){
    th.appendChild(document.createTextNode("(Either)"));
    boxDiv = document.createElement("div");
    boxDiv.style.cursor="pointer";
    boxDiv.style.float="left";
    xDiv = document.createElement("div");
    xDiv.style.color="#f00";
    xDiv.style.float="left";
    xDiv.addEventListener('click', removeFilter, false);
    xDiv.id = "xG_"+filters.genders[0];
    xDiv.appendChild(document.createTextNode("x"));
    boxDiv.appendChild(xDiv);
    boxDiv.style.float="left";
    boxDiv.appendChild(document.createTextNode(genders[filters.genders[0]]+" "));
    th.appendChild(boxDiv);
    boxDiv = document.createElement("div");
    boxDiv.style.cursor="pointer";
    boxDiv.style.float="left";
    xDiv = document.createElement("div");
    xDiv.style.color="#f00";
    xDiv.style.float="left";
    xDiv.addEventListener('click', removeFilter, false);
    xDiv.id = "xG_"+filters.genders[1];
    xDiv.appendChild(document.createTextNode("x"));
    boxDiv.appendChild(xDiv);
    boxDiv.appendChild(document.createTextNode(genders[filters.genders[1]]+" "))
    th.appendChild(boxDiv);
    boxDiv = document.createElement("div");
    boxDiv.style.cursor="pointer";
    boxDiv.style.float="left";
    xDiv = document.createElement("div");
    xDiv.style.color="#f00";
    xDiv.style.float="left";
    xDiv.addEventListener('click', removeFilter, false);
    xDiv.id = "xG_"+filters.genders[2];
    xDiv.appendChild(document.createTextNode("x"));
    boxDiv.appendChild(xDiv);
    boxDiv.appendChild(document.createTextNode(genders[filters.genders[2]]+" "))
    th.appendChild(boxDiv);
  }
  filterRow.appendChild(th); // Genders column

  th=document.createElement("th");
  var textString = "";
  if (filters.stages.length > 0){
    if (filters.stages.length == 2){
      var topDiv = document.createElement("div");
      topDiv.style.marginTop="0";
      topDiv.appendChild(document.createTextNode("(Either)"));
      th.appendChild(topDiv);
    }
    else if (filters.stages.length > 2){
      var topDiv = document.createElement("div");
      topDiv.style.marginTop="0";
      topDiv.appendChild(document.createTextNode("(Any of)"));
      th.appendChild(topDiv);
    }
    for (var i = 0; i < filters.stages.length; i++){
      boxDiv = document.createElement("div");
      boxDiv.style.cursor="pointer";
      boxDiv.style.float="left";
      xDiv = document.createElement("div");
      xDiv.style.color="#f00";
      xDiv.style.float="left";
      xDiv.addEventListener('click', removeFilter, false);
      xDiv.id = "xL_"+filters.stages[i];
      xDiv.appendChild(document.createTextNode("x"));
      boxDiv.appendChild(xDiv);
      boxDiv.appendChild(document.createTextNode(stages[filters.stages[i]]+" "));
      th.appendChild(boxDiv);
    }
  }
  filterRow.appendChild(th); // Stages column

  th=document.createElement("th");
  textString = "";
  if (filters.compartments.length > 0){
    if (filters.compartments.length == 2){
      th.appendChild(document.createTextNode("(Either)"));
      th.appendChild(document.createElement("br"));
    }
    else if (filters.compartments.length > 2){
      th.appendChild(document.createTextNode("(Any of)"));
      th.appendChild(document.createElement("br"));
    }
    for (var i = 0; i < filters.compartments.length; i++){
      boxDiv = document.createElement("div");
      boxDiv.style.cursor="pointer";
      boxDiv.style.float="left";
      xDiv = document.createElement("div");
      xDiv.style.color="#f00";
      xDiv.style.float="left";
      xDiv.addEventListener('click', removeFilter, false);
      xDiv.id = "xComp_"+filters.compartments[i];
      xDiv.appendChild(document.createTextNode("x"));
      boxDiv.appendChild(xDiv);
      boxDiv.appendChild(document.createTextNode(compartments[filters.compartments[i]]+" "));
      th.appendChild(boxDiv);
    }
  }
  filterRow.appendChild(th); // Compartments column
  setOtherColWidths();
  setChemTableHeight();
}

function updateHeaderBox(){
  var headerBox = document.getElementById("model_refs");
  clearHeaderBox();
  headerBox.appendChild(document.createTextNode(activeModels.length+" Model(s)"));
  headerBox.appendChild(document.createElement("br"));
  headerBox.appendChild(document.createTextNode(activeRefsCount+" Ref(s)"));
}

function clearHeaderBox(){
  var headerBox = document.getElementById("model_refs");
  var c = headerBox.firstElementChild;
  while (c != null){
    headerBox.removeChild(c);
    c = headerBox.firstElementChild;
  }
  var c = headerBox.firstChild;
  while (c != null){
    headerBox.removeChild(c);
    c = headerBox.firstChild;
  }
}

function setHeaderColWidths(){
  if (activeModels.length ==0){return;}
  var tbody = document.getElementById("chem_table_body");
  var colSource = tbody.firstElementChild.nextElementSibling.firstElementChild;
  var colDest = document.getElementById("headCol1");
  for (var i = 0; i < 7; i++){
    colDest.style.width = colSource.offsetWidth+"px";
    colSource = colSource.nextElementSibling;
    colDest = colDest.nextElementSibling;
  }
}

function setOtherColWidths(){
  if (activeModels.length == 0){return;}
  var tbody = document.getElementById("chem_table_body");
  var colSource = document.getElementById("headCol1");
  var colDest = tbody.firstElementChild.nextElementSibling.firstElementChild;
  for (var i = 0; i < 7; i++){
    colDest.style.width = colSource.offsetWidth+"px";
    colSource = colSource.nextElementSibling;
    colDest = colDest.nextElementSibling;
  }
}

function drawChemRows(){
  clearChemRows();
  var page = 1*document.getElementById("page_num").innerText.substring(5);
  var rowsPerPageSelector = document.getElementById("num_per_row");
  var rowsPerPage = 1*rowsPerPageSelector.options[rowsPerPageSelector.selectedIndex].innerHTML;

  var rowStart = (page - 1) * rowsPerPage;
  var rowEnd = rowStart+rowsPerPage;
  if (rowEnd>activeChems.length){rowEnd=activeChems.length;}
  for (var i=rowStart;i<rowEnd;i++){
    add_collapsed_chem_row(activeChems[i]);
  }
  rowStart++; // for display purposes
  updateStatusText(rowStart, rowEnd);
  setHeaderColWidths();
}

function fixPageNum(){
  var firstRowNum = getFirstRowNum();
  var rowsPerPageSelector = document.getElementById("num_per_row");
  var rowsPerPage = 1*rowsPerPageSelector.options[rowsPerPageSelector.selectedIndex].innerHTML;

  if (firstRowNum > activeChems.length){firstRowNum = activeChems.length - rowsPerPage +1;}
  if (firstRowNum < 1){firstRowNum = 1;}

  var newPage = 1+(Math.floor((firstRowNum - 1)/rowsPerPage));
  document.getElementById("page_num").innerText = "Page: "+newPage;
  drawChemRows();
}

function searchName(){
  var exact = document.getElementById("exact_chem_only").checked;
  var searchString = document.getElementById("chem_input").value;
  if (searchString.trim() == ""){return;}
  var cf = new ChemFilter(exact, "Name", searchString);

  filters.chemFilters.push(cf);
  updateActiveModels();
  fixPageNum();
  drawChemRows();
  update_filterRow_text();
  document.getElementById("chem_input").value="";
}

function searchCas(){
  var exact = document.getElementById("exact_chem_only").checked;
  var searchString = document.getElementById("chem_input").value;
  if (searchString.trim() == ""){return;}
  if (searchString.match("[^0-9-]")){
    alert("CAS RN numbers only contain digits and dashes");
    return;
  }
  var cf = new ChemFilter(exact, "CAS RN", searchString);

  filters.chemFilters.push(cf);
  updateActiveModels();
  fixPageNum();
  drawChemRows();
  update_filterRow_text();
  document.getElementById("chem_input").value="";
}

function searchFormula(){
  alert("Formula search is not implemented yet");
  return;
  var exact = document.getElementById("exact_chem_only").checked;
  var searchString = document.getElementById("chem_input").value;
  var cf = new ChemFilter(exact, "Formula", searchString);

  filters.chemFilters.push(cf);
  updateActiveModels();
  fixPageNum();
  drawChemRows();
  update_filterRow_text();
  document.getElementById("chem_input").value="";
}

function updateActiveChems(){
  activeChems = new Array();
  
  if (filters.chemFilters.length == 0){
    for(var i in chemicals){activeChems.push(i*1);}
    return;
  }
  for (var i in chemicals){ 
    var chem = chemicals[i];
    var iInt =1*i;
    var cName = chem.name;
    var cCAS1 = chem.cas1;
    var cCAS2 = chem.cas2;
    for(var j=0;j<filters.chemFilters.length;j++){
      var cf = filters.chemFilters[j];
      var cfExact = cf.isExact;
      var cfType = cf.stringType;
      var cfText = cf.stringText;
      if (cfType == "Name"){
        if ((cfExact && cName == cfText) || (!cfExact && cName.indexOf(cfText) >= 0)){
          if (activeChems.indexOf(iInt)<0){activeChems.push(iInt);}
        }
      }
      else if (cfType == "CAS RN"){
        if ((cfExact && cCAS1 == cfText) || (!cfExact && cCAS1.indexOf(cfText) >= 0)){
          if (activeChems.indexOf(iInt)<0){activeChems.push(iInt);}
        }
      }
      else if (cfType == "Formula"){
        continue;
      }
    }
  }
}

function formulaCompare(){
  return;
}

function clearChemRows(){
  var tbody = document.getElementById("chem_table_body");
  var row = tbody.firstElementChild;
  while (row != null){
    tbody.removeChild(row);
    row = tbody.firstElementChild;
  }
}

function reorderActiveChems(){
  drawChemRows();
}

function updateActiveModels(){
  updateActiveChems(); // This just does the filters.  The set may be reduced at the end of the method!
  var newActiveChems = new Array();
  var foundRefIds = new Array();
  activeModels = new Array(); // clear contents
  modelCount.species = new Array(species.length);
  modelCount.species.fill(0);
  modelCount.routes = new Array(routes.length);
  modelCount.routes.fill(0);
  modelCount.genders = new Array(genders.length); // 0=unspecified  1=female 2=male
  modelCount.genders.fill(0);
  modelCount.stages = new Array(stages.length);
  modelCount.stages.fill(0);
  modelCount.compartments = new Array(compartments.length);
  modelCount.compartments.fill(0);
  // Big loop to see check each model to see if it will be included
  for (var i in models){ 
    var iInt = 1*i; // Beware that i is a string, so make iInt a copy that is an int
    var mod = models[i]; // Apparently the argument can be a string or an int ?!?
  if(mod != null){
    var goodChem = true;
    var goodSpecies = true;
    var goodRoute = true;
    var goodGender = true;
    var goodStage = true;
    var goodCompartments = true;

    // check the chemical first
    if(activeChems.indexOf(mod.chem_id)<0){
      goodChem = false;
    }

    // now check the route
    if (filters.routes.length > 0){
      goodRoute = false;
      for (var j = 0; j < filters.routes.length; j++){
        var route_id = filters.routes[j];
        if (mod.route_id == route_id){
          goodRoute = true;
          continue; // it only takes one "true" to proove the model is o.k.
        }
      }
    }

    // now check the three parts of the population
    var pop = populations[mod.population_id];

    // now check the gender
    if (filters.genders.length > 0){
      goodGender = false;
      for (var j = 0; j < filters.genders.length; j++){
        var gender_id = filters.genders[j];
        if (pop.gender_id == gender_id){
          goodGender = true;
          continue;
        } // it only takes one "true" to proove the model is o.k.
      }
    }

    // now check the species
    if (filters.species.length > 0){
      goodSpecies = false;
      for (var j = 0; j < filters.species.length; j++){
        var species_id = filters.species[j];
        if (pop.species_id == species_id){
          goodSpecies = true;
          continue;
        } // it only takes one "true" to proove the model is o.k.
      }
    }

    // now check the stage
    if (filters.stages.length > 0){
      goodStage = false;
      for (var j = 0; j < filters.stages.length; j++){
        var stage_id = filters.stages[j];
        if (pop.stage_id == stage_id){
          goodStage = true;
          continue;
        } // it only takes one "true" to proove the model is o.k.
      }
    }

    // now check the compartment(s) -- changing this to OR on 1/16/2022
    if (filters.compartments.length > 0){
      goodCompartments = false;
      for (var j = 0; j < filters.compartments.length; j++){
        var compartment_id = filters.compartments[j];
        if (mod.compartmentsList.indexOf(compartment_id) >= 0){ // This model has this compartment
          goodCompartments = true;
          continue;
        }
      }
    }

    if (goodChem && goodRoute && goodGender && goodSpecies && goodStage && goodCompartments){
      activeModels.push(iInt) ;
      if (newActiveChems.indexOf(mod.chem_id) < 0){newActiveChems.push(mod.chem_id);}
      if (foundRefIds.indexOf(mod.refId) < 0){foundRefIds.push(mod.refId);}
    }
    if ((goodRoute == false || filters.routes.length == 0) && goodChem && goodGender && goodSpecies && goodStage && goodCompartments){ // this model's route is filtered out [or there were no filters]
      modelCount.routes[mod.route_id]++; // increment the count of models that would be included if you DID include that route
    }
    if ((goodGender == false || filters.genders.length == 0) && goodChem && goodRoute && goodSpecies && goodStage && goodCompartments){ // this model's gender is filtered out [or there were no filters]
      modelCount.genders[pop.gender_id]++; // increment the count of models that would be included if you DID include that gender
    }
    if ((goodSpecies== false || filters.species.length == 0) && goodChem && goodRoute && goodGender && goodStage && goodCompartments){ // this model's species is filtered out [or there were no filters]
      modelCount.species[pop.species_id]++; // increment the count of models that would be included if you DID include that species
    }
    if ((goodStage == false || filters.stages.length == 0) && goodChem && goodRoute && goodGender && goodSpecies && goodCompartments){ // this model's species is filtered out [or there were no filters]
      modelCount.stages[pop.stage_id]++; // increment the count of models that would be included if you DID include that stage
    }
    if ((goodCompartments == false || filters.compartments.length == 0) && goodChem && goodRoute && goodGender && goodSpecies && goodStage) { // this model's compartmentlist is filtered out [or there were no filters]
      for(var j = 0; j<mod.compartmentsList.length;j++){
        modelCount.compartments[mod.compartmentsList[j]]++; // increment the count of compartments that would be included if you DID include that compartment
      }
    }
  }
  }

  // OK - now... for each filter, set the number of models in the filterCount to the number of activeModels!
  for(var i=0;i<filters.species.length;i++){ modelCount.species[filters.species[i]] = activeModels.length; }
  for(var i=0;i<filters.routes.length;i++){ modelCount.routes[filters.routes[i]] = activeModels.length; }
  for(var i=0;i<filters.genders.length;i++){ modelCount.genders[filters.genders[i]] = activeModels.length; }
  for(var i=0;i<filters.stages.length;i++){ modelCount.stages[filters.stages[i]] = activeModels.length; }
  for(var i=0;i<filters.compartments.length;i++){ modelCount.compartments[filters.compartments[i]] = activeModels.length; }
  activeChems = newActiveChems; // This is the update to only include chems with at least one model

  var page = 1*document.getElementById("page_num").innerText.substring(5);
  var rowsPerPageSelector = document.getElementById("num_per_row");
  var rowsPerPage = 1*rowsPerPageSelector.options[rowsPerPageSelector.selectedIndex].innerHTML;

  if (((page-1) * rowsPerPage) > activeChems.length){
    page = 1+Math.floor((activeChems.length-1)/rowsPerPage);
  }

  activeRefsCount = foundRefIds.length;

  var rowStart = 1 + ((page - 1) * rowsPerPage);
  var rowEnd = rowStart + rowsPerPage - 1;
  updateStatusText(rowStart, rowEnd);
  rebuildSpeciesPulldown();
  rebuildRoutesPulldown();
  rebuildGendersPulldown();
  rebuildStagesPulldown();
  rebuildCompartmentsPulldown();
  setChemTableHeight();
}

function firstPage(){
  var page = 1*document.getElementById("page_num").innerText.substring(5);
  if (page == 1){return;}
  page = 1;
  document.getElementById("page_num").innerText = "Page: "+page;
  drawChemRows();
}

function prevPage(){
  var page = 1*document.getElementById("page_num").innerText.substring(5);
  if (page == 1){return;}
  page--;
  document.getElementById("page_num").innerText = "Page: "+page;
  drawChemRows();
}

function nextPage(){
  var page = 1*document.getElementById("page_num").innerText.substring(5);
  var rowsPerPageSelector = document.getElementById("num_per_row");
  var rowsPerPage = 1*rowsPerPageSelector.options[rowsPerPageSelector.selectedIndex].innerHTML;
  if ((page * rowsPerPage) >= activeChems.length){return;}
  page++;
  document.getElementById("page_num").innerText = "Page: "+page;
  drawChemRows();
}

function lastPage(){
  var page = 1*document.getElementById("page_num").innerText.substring(5);
  var rowsPerPageSelector = document.getElementById("num_per_row");
  var rowsPerPage = 1*rowsPerPageSelector.options[rowsPerPageSelector.selectedIndex].innerHTML;
  page = 1+Math.floor((activeChems.length-1)/rowsPerPage);
  if (((page-1) * rowsPerPage) > activeChems.length){return;}
  document.getElementById("page_num").innerText = "Page: "+page;
  drawChemRows();
}

function setChemTableHeight(){
  var part0 = 100;
  var part1 = document.getElementById("top_stuff").offsetHeight;
  var part2 = document.getElementById("paging_table").offsetHeight;
  var part3 = document.getElementById("chem_table_header").offsetHeight;
  var tweak = 15;

  var windowHeight = window.innerHeight;
  var newSideBarHeight = windowHeight - part0;
  if (newSideBarHeight < 150){newSideBarHeight = 150;}
  document.getElementById("sidebar").style.height = newSideBarHeight +"px";

  var newChemBodyHeight = windowHeight - (part0 + part1 + part2 + part3) + tweak;
  if (newChemBodyHeight < 100){newChemBodyHeight = 100;}
  document.getElementById("chem_table_body").style.height = newChemBodyHeight +"px";
}
 
function updateStatusText(rowStart,rowEnd){
  var statusTextDiv = document.getElementById("status-text");
  statusTextDiv.innerHTML = "Rows "+rowStart+" to "+rowEnd+" of "+activeChems.length;
  var colDest = document.getElementById("headCol1");
  if (activeChems.length == 1){colDest.innerHTML = "1 Chemical";}
  else {colDest.innerHTML = activeChems.length + "<br>Chemicals";}
}

function getFirstRowNum(){
  var statusText = document.getElementById("status-text").innerHTML;
  return 1*statusText.substring(4,statusText.indexOf(" ",6));
}
function searchChems(caller){
  var chem_num = caller.value*1;
  if (chem_num > 0){console.log(chem_num);}
  var count = 0;
  for (var i in models){
    var model = models[i];
    if (model.chem_id == chem_num){
      count++;
    }
  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function confirmLoaded(){
  console.log("loaded");
}

function casCheck(cas){
  var stripped = "";
  for(var i=0;i<cas.length;i++){
    var num = cas.substring(i,i+1);
    if (num >= 0 && num <=9){
      stripped+=num;
    }
  }
  var sum = 0-stripped.substring(stripped.length-1,stripped.length);
  var coeff = 0;
  for (var l=stripped.length-2;l>=0;l--){
    coeff++;
    sum+=coeff*stripped.substring(l,l+1);
  }
  if (sum%10){return false;}
  return true;
}

function saveData(){
  var a = document.createElement('a');
  var allData = buildData(); // One giant string
  a.href = "data:csv/plain;charset=utf-8,"+encodeURIComponent(allData);
  a.setAttribute('download',"pbk_model_explorer_data.csv");
  var rDiv = document.getElementById("sidebar");
  rDiv.appendChild(a);
  a.click();
  rDiv.removeChild(a);
}

function newModelButtonAction(){
  console.log("Create new model");
}

function buildData(){
  var allData = buildModelHeaderRow();
  for (var i=0; i<activeModels.length; i++){
    allData+=buildOneModelRow(activeModels[i]);
  }
  return allData;
}

function buildModelHeaderRow(){
  return "ID,Chemical Name,CAS RN,Additional Information on Chemical,Species,Sex,Lifestage,Administration Route,Journal,Authors,Year,Volume,Page(s),PubMed ID,DOI,Availability of Equations in Paper,Simulation Software,Compartments or related information,Notes\n";
}

function buildOneModelRow(model_id){
  var mod = models[model_id];
  var chem = chemicals[mod.chem_id];
  var pop = populations[mod.population_id];
  mod.compartmentsList;

  var result = model_id+',';
  result+= '"'+chem.name+'",';
  result+= chem.cas1+',"';
  result+= mod.chem_plus+'",';
  result+= species_full[pop.species_id]+',';
  result+= genders[pop.gender_id]+',';
  result+= stages[pop.stage_id]+',';
  result+= routes[mod.route_id]+',';
  var ref = refs[mod.refId];
  result+= ref.journal+',"';
  result+= ref.author+'",';
  result+= ref.year+',';
  result+= ref.vol+',';
  result+= ref.pages+',';
  result+= '"=HYPERLINK(""https://pubmed.ncbi.nlm.nih.gov/'+ref.pubmed_id+'"",""'+ref.pubmed_id+'"")",';
  result+= '"=HYPERLINK(""https://doi.org/'+ref.doi+'"",""'+ref.doi+'"")","';

  result+= equation[mod.equation_id]+'","'; // availability and simulation software
  result+= software[mod.software_id]+'",'; // availability and simulation software
  var c = '';
  for(var i=0;i<mod.compartmentsList.length;i++){
    c += compartments[mod.compartmentsList[i]] + "; ";
  }
  result+= c.substring(0,c.length-2); // remove the trailing semi-colon space
  result+= ',"'+mod.notes+'"\n';
  return result;
}
