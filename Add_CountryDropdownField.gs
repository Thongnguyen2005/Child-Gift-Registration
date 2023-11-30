//Use this script to create a country dropdown field in Google form

function create_Country_dropdown() {
  const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1sS5isvoyDaqVlJTwO6lxsrjcn32eSzBuKuoRZwevTOs/edit#gid=0');

  const sheet2 = ss.getSheetByName('Country_List');
  const range = sheet2.getDataRange();
  var list_countries = range.getValues();
  
  var form = FormApp.getActiveForm();
  
  var country_item = form.addListItem();
  country_item.setTitle('Country Of Origin').setChoiceValues(list_countries);
}