function update_dropdown_after_submission() {
  var form = FormApp.getActiveForm();
  const setupv = get_setup_values();
  const day_index = setupv.day_index;
  const time_index = setupv.time_index;
  const event_days = setupv.event_days;
  const start = setupv.start, end = setupv.end, slot_dur = setupv.slot_dur;
  const max_limit = setupv.max_limit;

  const selected_day_item = form.getItems()[day_index];
  var day_choices = selected_day_item.asMultipleChoiceItem().getChoices();

  if (day_choices[0].getValue() == 'I wish to be added to the waitlist') {
    Logger.log("User selected 'I wish to be added to the waitlist'.");
    return;
  }

  const time_slot_choices = create_time_slots(start, end, slot_dur, event_days.length);
  var available = [];
  
  for (var i = 0; i < event_days.length; i++) {
    available.push(new Array(time_slot_choices[0].length).fill(max_limit));
  }

  const selected_time_item = [];
  for (var i = 0; i < event_days.length; i++) {
    selected_time_item[i] = form.getItems()[time_index[i]];
  }
  
  var formResponses = form.getResponses();

  for (var formResponse of formResponses) {
    const DayResponse = formResponse.getResponseForItem(selected_day_item);
    var selected_day = DayResponse.getResponse();
    var day = 0;
    
    for (var i = 0; i < event_days.length; i++) {
      if (selected_day == event_days[i]) {
        day = i;
      }
    }
    
    var TimeResponse = formResponse.getResponseForItem(selected_time_item[day]);
    var selected_time = TimeResponse.getResponse();
    
    var ind = time_slot_choices[day].indexOf(selected_time.substring(0, 8));
    available[day][ind]--;
    
    if (available[day][ind] <= 0) {
      Logger.log("No more available slots for this user. Sending email reminder...");
      remove_time_choices(time_slot_choices, available, day, form, day_index, time_index, event_days);
    }
  }
  // Send email reminder to the parent
    var mostRecentFormResponse = formResponses[formResponses.length - 1];
    sendReminderEmails(mostRecentFormResponse, selected_time, selected_day);
    
}


function sendReminderEmails(mostRecentFormResponse, selected_time, selected_day) {
  var parentEmail = mostRecentFormResponse.getRespondentEmail();
  const responseData = mostRecentFormResponse.getItemResponses();

  let numChild = '';

  for (const response of responseData) {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();

    // Check if this is a date and time question
    if (question.startsWith('Number of children for whom you are registering')) {
      numChild += `${answer}`;
    }
  }

  // Send an email reminder to the volunteer
  const subject = 'Token of Love Registration Reminder';
  const message = `Hello,\n\nThank you for registering at WoMen of Connection Ministry!\n\nYou have registered for ${numChild} children on: ${selected_day} at ${selected_time}.\nPlease arrive on time at our address: 101 Cowardin Ave, Richmond, VA 23224. Please don't bring Children with.\n\nBest regards,\nWoMen of Connection Ministry`;
  
  // Send the email using MailApp or GmailApp
  MailApp.sendEmail(parentEmail, subject, message);
}

function secondEmailReminder(formResponse){
  const responseData = formResponse.getItemResponses();

  // Extract relevant information from the form response
  const email = formResponse.getRespondentEmail();

  let numChild = '';
  let selected_time = '';
  let selected_day = '';

  for (const response of responseData) {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();

    if (question.startsWith('Number of children for whom you are registering')) {
      numChild += `${answer}`;
    }
    if (question.startsWith('On which day would you like to attend the event?')) {
      selected_day += `${answer}`;
    }
    if (question.startsWith(`What time on ${selected_day} would you like to attend the event?`)) {
      selected_time += `${answer}`;
    }
  }

  // Send an email reminder to the volunteer
  const subject = 'Volunteer Time Slot Reminder';
  const message = `Hello,\n\nThank you for registering at WoMen of Connection Ministry!\n\nYou have registered for ${numChild} children on: ${selected_day} at ${selected_time}.\nPlease arrive on time at our address: 101 Cowardin Ave, Richmond, VA 23224. Please don't bring Children with.\n\nBest regards,\nWoMen of Connection Ministry`;
  
  // Send the email using MailApp or GmailApp
  MailApp.sendEmail(email, subject, message);
}

//trigger this function to send the second email
function triggerSecondEmail() {
  const form = FormApp.openById('1OltxzneJgAisSI-chRSRwmL1w5Y6Hsf_bwj51n2utM4');
  const formResponses = form.getResponses();
  for (const formResponse of formResponses) { 
    sendReminderEmails(formResponse);
  }
}


