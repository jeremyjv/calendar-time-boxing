// make a function here that adds event to calender 
// pass the content of a 'task' into that function
import React, {ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from "react-google-calendar-api";

const config = {
  "clientId": "595165491330-i1blk9j26agpbbs1e7c8cbplbbqmlomc.apps.googleusercontent.com",
  "apiKey": "AIzaSyArW-06J-PrhKzHLQN2lGqm9MjPWHsRF2U",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);