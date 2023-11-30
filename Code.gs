//sort by date then time slot
function sort() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Form Responses 1");

  //get current # of columns
  var number = sheet.getMaxRows().toString();
  //console.log(number);
  var number = number.replace(".0","");
  const range = sheet.getRange(`A2:CW${number}`);
  range.sort([6, 7, 8, 9]);


  //sort column 6 then 7, 8, and 9 in ascending order
}

function addTotalChild(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Form Responses 1");

  //get current # of columns
  var number = sheet.getMaxRows().toString();
  var number = number.replace(".0","");
  totalChild = 0;
  childCol = 10;  
  totalCol = 11;
  for(let i=2; i<=number; i++){
    totalChild += parseInt(sheet.getRange(i, childCol).getValue());
  }
  sheet.getRange(2,totalCol).setValue(totalChild);

}

//color the the cell based on its value
function color(){
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Form Responses 1");
  //const numCol = ss.getLastColumn();
  const numRow = ss.getLastRow();

  //color the date
  const columnColor1 = 6; // the column that needs to be colored

  //target on the column of date
  var range1 = sheet.getRange(1,columnColor1,numRow);

  var cellRange1 = range1.getValues();

  //cellRange.length is # columns
  for(i = 1; i<cellRange1.length; i++){
    if(cellRange1[i] == "December 14th 2023")
     {
       sheet.getRange(i+1, columnColor1).setBackground("green");
     } 
     else if (cellRange1[i] == "December 15th 2023")
     {
       sheet.getRange(i+1,columnColor1).setBackground("red");
     } 
     else if (cellRange1[i] == "December 16th 2023")
     {
       sheet.getRange(i+1,columnColor1).setBackground("yellow");
     } 
  }

  //color the mobile number

  const columnColor2 = 5;
  var range2 = sheet.getRange(1,columnColor2,numRow);

  var cellRange2 = range2.getValues();

  //cellRange.length is # columns
  for(i = 1; i<cellRange2.length; i++){
    sheet.getRange(i+1, columnColor2).setBackground("orange");
  }

  //color the email address

  const columnColor3 = 4;
  var range3 = sheet.getRange(1,columnColor3,numRow);

  var cellRange3 = range3.getValues();
  Logger.log(cellRange3.length);

  //cellRange.length is # columns
  for(i = 1; i<cellRange3.length; i++){
    sheet.getRange(i+1, columnColor3).setBackground("blue");
  }

   //color the name 

  const columnColor4 = 3;
  var range4 = sheet.getRange(1, columnColor4, numRow);

  var cellRange4 = range4.getValues();
  Logger.log(cellRange4.length);

  //cellRange.length is # columns
  for(i = 2; i<cellRange4.length - 1; i++){
    sheet.getRange(i, 2, columnColor4, 2).setBackground("grey");
  }


}

//run this function to randomize the data in sheets for testing purpose
function randomize(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Form Responses 1");
  var number = sheet.getMaxRows().toString();
  var number = number.replace(".0","");
  Logger.log(number);
  const range = sheet.getRange(`A2:CV${number}`);
  range.randomize();
}
