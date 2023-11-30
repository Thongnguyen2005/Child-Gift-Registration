function update_dropdown(){
  var form = FormApp.getActiveForm();
  
  const setupv = get_setup_values();

  const day_index = setupv.day_index; //Field item in the form
  const time_index = setupv.time_index;
  const event_days = setupv.event_days;
  const start = setupv.start, end = setupv.end, slot_dur = setupv.slot_dur;
  const max_limit = setupv.max_limit;

  const selected_day_item = form.getItems()[day_index];
  
    // If all dates and their slots are filled
  var day_choices = selected_day_item.asMultipleChoiceItem().getChoices();

  if (day_choices[0].getValue() == 'I wish to be added to the waitlist'){
       return;
  }

  // If the slots were not full for atleast one date
  const time_slot_choices = create_time_slots(start, end, slot_dur, event_days.length);

  // Initialize the avaialble capacity to amx_limit
  var available = [];
  for (var i = 0; i < event_days.length; i++){
    available.push(new Array(time_slot_choices[0].length).fill(max_limit));
  }

  //Find the time slot item field for each day
  const selected_time_item = [];
  for (var i = 0; i < event_days.length; i++){
    selected_time_item[i] = form.getItems()[time_index[i]];
    // console.log(selected_time_item[i].getTitle());
  }
  var formResponses = form.getResponses();

  // get the index of the selected date field
  for (var formResponse of formResponses){
    const DayResponse = formResponse.getResponseForItem(selected_day_item);
    selected_day = DayResponse.getResponse();
    var day = 0;
    for(var i = 0; i <event_days.length; i++){
      if (selected_day == event_days[i]){
        day = i;
      }
    }
    
    // get the time slot response for the ate selected in the previous step
    var TimeResponse = formResponse.getResponseForItem(selected_time_item[day]);
  
    selected_time = TimeResponse.getResponse();
    
    var ind = time_slot_choices[day].indexOf(selected_time.substring(0, 8));
    available[day][ind]--;
    
    if (available[day][ind] <= 0){
      remove_time_choices(time_slot_choices, available, day, form, day_index, time_index, event_days);
    }
  }

}

// Reset the time slots listed for each day depending on the available capacity------------------------------------//
function remove_time_choices(time_slot_choices, available, day, form, day_index, time_index, event_days){
  selected_time_item = form.getItems()[time_index[day]];
  var time_item = selected_time_item.asListItem();

  available_time_slots = [];

  for (var i=0; i < time_slot_choices[0].length; i++){
    if (available[day][i] > 0){
      available_time_slots.push(String(time_slot_choices[day][i]));
    } 
  }
  if (available_time_slots.length != 0){
    time_item.setChoiceValues(available_time_slots);
  }

  else{
    // remove day if all the time slots for the day is filled.
    remove_day_choices(time_slot_choices, available, form, day_index, time_index, event_days)
  } 
}

function remove_day_choices(time_slot_choices, available, form, day_index, time_index, event_days){
  
  // Select the days with at least one available time slot
  var day_item = form.getItems()[day_index].asMultipleChoiceItem();
  var available_days = [], pageGoTo = [];
  
  for (var i = 0; i < event_days.length; i++){
    var available_time_slots = [];
    for (var j=0; j <time_slot_choices[0].length; j++){
      if (available[i][j] > 0){
        pageGoTo[i] = form.getItems()[time_index[i]-1].asPageBreakItem();
        available_days.push(day_item.createChoice(event_days[i], pageGoTo[i]));
        available_time_slots = update_time_choices(available_time_slots, i, time_slot_choices, available);
        break;
      }
    }
    if (available_time_slots.length != 0){
      var time_item = form.getItems()[time_index[i]].asListItem();
      time_item.setChoiceValues(available_time_slots);
    }
  }
  if (available_days!= 0){
    day_item.setChoices(available_days);
  }
    // if no more slots are available for any day, ad the users to waitlist
  else{ 
      form.getItems()[day_index - 1].asPageBreakItem().setTitle('No more slots available! ');
            
      day_item.setTitle('Select the below option if you wish to be added to the waitlist');
      var page = form.getItems()[time_index[event_days.length-1]+1].asPageBreakItem();
      day_item.setChoices([day_item.createChoice('I wish to be added to the waitlist', page)]) ; 

  }
  return;
}

function update_time_choices(available_time_slots, day, time_slot_choices, available){
  var available_time_slots = [];
  for (var i = 0; i < time_slot_choices[day].length; i++){
    if (available[day][i] > 0){
      available_time_slots.push(time_slot_choices[day][i]);
    }
  }
  return available_time_slots;
}

/*
Thong Nguyen 
This function should run everytime a new response is submitted
Therefore, in your main function, put this:

var mostRecentFormResponse = formResponses[formResponses.length - 1];
sendReminderEmails(mostRecentFormResponse);

*/
