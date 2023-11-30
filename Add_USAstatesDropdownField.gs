//Use this script to create a dropdown field for the states in USA in a Google Form
function create_USA_states_dropdown() {
  const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1sS5isvoyDaqVlJTwO6lxsrjcn32eSzBuKuoRZwevTOs/edit#gid=412762480');
  const sheet1 = ss.getSheetByName('States_in_USA');
  const usa_state_range = sheet1.getDataRange();
  var list_states = usa_state_range.getValues();
  
  var form = FormApp.getActiveForm();
  
  var usa_state_item = form.addListItem();
  usa_state_item.setTitle('State').setChoiceValues(list_states);
}