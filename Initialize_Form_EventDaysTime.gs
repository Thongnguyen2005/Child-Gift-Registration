  //  Execute this script to reset the form with initial event days and time
  //  Make sure to set the conditional transition to sections for date fields //Plan to automate this as well
class setup_values{
  constructor(day_index, time_index, event_days, start, end, slot_dur, max_limit){
    this.day_index = day_index;
    this.time_index = time_index;
    this.event_days = event_days;
    this .start = start;
    this.end = end;
    this.slot_dur = slot_dur;
    this.max_limit = max_limit;
  }
}  

function initiate_lists(){
  var form = FormApp.getActiveForm();
  
  const setupv = get_setup_values();

  const day_index = setupv.day_index; //Field item in the form
  const time_index = setupv.time_index;
  const event_days = setupv.event_days;
  const start = setupv.start, end = setupv.end, slot_dur = setupv.slot_dur;
  const max_limit = setupv.max_limit;

  //-------------------------------------Create the "Pick a date" field------------------------------------------------//
  form.getItems()[day_index - 1].setTitle('Pick a day to attend the event!');
  const selected_day_item = form.getItems()[day_index];
  const day_item = selected_day_item.asMultipleChoiceItem();
  day_item.setChoiceValues(event_days);
  day_item.setTitle('On which day would you like to attend the event?');

  //-------------------------------- Set the conditional navigation based on the selected date---------------------------//
  var choice_list = [], page = [];
  for (var i = 0; i < event_days.length; i++){
    page[i] = form.getItems()[time_index[i]-1].asPageBreakItem();
    choice_list.push(day_item.createChoice(event_days[i], page[i]));
  }
  day_item.setChoices(choice_list);

  // -------------------------------------Create time slots for each day-------------------------------//
  const time_slot_choices = create_time_slots(start, end, slot_dur, event_days.length);
  
  const selected_time_item = [];
  for (var i = 0; i < event_days.length; i++){
    selected_time_item[i] = form.getItems()[time_index[i]].asListItem();
    t = 'What time on ' + event_days[i] + ' would you like to attend the event?';
    selected_time_item[i].setTitle('What time on ' + event_days[i] + ' would you like to attend the event?').setChoiceValues(time_slot_choices[i]);
  }
}

function create_time_slots(start, end, slot_dur, days){

  const slots = (end - start) * (60/slot_dur);
  var time_slot_choices = new Array(days).fill(new Array(slots).fill('00'));
  time_slot_choices[0][0] = String(start)+':00 AM';

  t = start;
  m = 0;
  
  for (var i = 1; i < slots; i++){
    m = m + slot_dur;
    if (m%60 == 0){
      t = t+1;
      m = 0
    }
    var str1 = String(t);
    var str2 = ':' + String(m)
    var ampm = ' AM';
    if (t < 10) {
      str1 = String(t); // For easy sorting purpose in google sheet, it should be 1:00 AM instead of 01:00 AM
    }
    else if (t >= 12){
        ampm = ' PM';
        if (t > 12) {
          str1 = String(t - 12) // For easy sorting purpose in google sheet, it should be 9:00 AM instead of 09:00 PM
        }
    }
      
    if (m == 0){
      str2 = ':00';
    }
    time_slot_choices[0][i] =  str1 + str2 + ampm;
  }
  
  for (var i = 1; i < days; i++){
    for (var j = 0; j < slots; j++){
      time_slot_choices[i][j] = time_slot_choices[0][j];
    }
  }
  return time_slot_choices;
}