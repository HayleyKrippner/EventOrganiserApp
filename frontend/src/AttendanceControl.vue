<template>

  <div id="event">

    <div id="nav-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item>
          <el-image id="logo-image"
                    :src="logoImage" alt="logo"></el-image>
        </el-menu-item>
        <el-menu-item class="nav-bar-item" index="1" @click="toEvents">Events</el-menu-item>
        <el-menu-item class="nav-bar-item" index="2" @click="toMyEvents">My Events</el-menu-item>
        <el-menu-item class="nav-bar-item" index="3" @click="toProfile">Profile</el-menu-item>
        <el-menu-item class="nav-bar-item" index="4" @click="toLogin">Login</el-menu-item>
        <el-menu-item class="nav-bar-item" index="5" @click="logOut">Logout</el-menu-item>
      </el-menu>
      <div class="line"></div>
    </div>

    <el-header id="card-header" style="font-size: 40px; margin-top: 30px">Manage Event Attendance</el-header>

    <el-card class="box-card">

      <el-button id="back-to-event-btn" class="link-button" v-on:click="backToEvent()">Back to {{singleEvent.title}}</el-button>

      <el-row>
        <el-col :span="4">
          <h4 class="row">User Id to change status:</h4>
        </el-col>
        <el-col :span="3">
          <el-input-number class="row" v-model="toUpdateId" :min="1"  placeholder="User id"></el-input-number>
        </el-col>
        <el-col :span="2">
          <el-button id="accept-btn" v-on:click="updateStatus('accepted')">Accepted</el-button>
        </el-col>
        <el-col :span="2">
          <el-button id="pending-btn" v-on:click="updateStatus('pending')">Pending</el-button>
        </el-col>
        <el-col :span="2">
          <el-button id="reject-btn" v-on:click="updateStatus('rejected')">Rejected</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <el-label style="font-weight: bold">Capacity:</el-label><el-label>{{eventCapacity}}</el-label>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <el-label style="font-weight: bold">Accepted Attendees:</el-label><el-label>{{numAcceptedAttendees}}</el-label>
        </el-col>
      </el-row>


      <div id="attendees-req-table">
          <el-table :data="eventAttendees"
                    :default-sort = "{prop: 'date', order: 'ascending'}">
            <el-table-column prop="attendeeId" label="Attendee ID">
            </el-table-column>
            <el-table-column prop="firstName" label="First Name">
            </el-table-column>
            <el-table-column prop="lastName" label="Last Name">
            </el-table-column>
            <el-table-column prop="status" label="Current Status">
            </el-table-column>
            <el-table-column prop="dateOfInterest" label="Date of Interest" sortable>
            </el-table-column>
          </el-table>
        </div>

    </el-card>

  </div>

</template>

<script>

import axios from "axios";
import Cookies from "js-cookie";
import defaultImage from "../public/default-profile-image.png";
import {formatDate, formatTime} from './dateUtils.js';
import {isLoggedIn} from "./authUtils";

export default {
  name: "AttendanceControl",
  components: {

  },
  data() {
    return {

      toUpdateId: null,
      attendeeIds: [],

      logoImage: "../logo.png",
      isUserLoggedIn: isLoggedIn(),
      activeIndex: '1',
      error: "",
      errorFlag: false,
      singleEvent: [],
      eventIdVal: 0,
      eventTitle: "",
      eventCategoryIds: [], // ids from the event get call
      eventOrganizerFName: "",
      eventOrganizerLName: "",
      eventCapacity: 0,
      eventDescription: "",
      eventOrganizerId: 0,
      eventDate: "",
      eventIsOnline: "",
      eventUrl: "",
      eventVenue: "",
      eventRequiresAttendanceControl: false,
      eventFee: "",

      numAcceptedAttendees: 0,

      styledEventDate: "",
      styledEventTime: "",

      categoriesInfo: "", // info from the categories get call
      categoryNames: "", // computed names

      titleUpdated: "",
      descriptionUpdated: "",
      categoryIdsUpdated: [],
      dateUpdated: "",
      isOnlineUpdated: "",
      urlUpdated: "",
      venueUpdated: "",
      capacityUpdated: "",
      requiresAttendanceControlUpdated: "", // TODO: not sure if should be "" or just pick current val as default
      feeUpdated: "",

      eventImage: "",
      organizerImage: "",

      eventAttendees: [],
      eventAttendeesIds: [],

      attendeesList: [],

      allEvents: [],
      similarEvents: [],

      similarEventsImagesMap: new Map(),
      attendeesImagesMap: new Map(),

      // variables for attendance status and requesting attendance
      isEventFull: null,
      isEventInPast: null,
      isAlreadyAttending: null,
      attendanceStatus: null

    }
  },

  /**
   *
   */
  mounted() {

    // console.log(this.$route.params.orgId)

    console.log(this.isEventOrganizerInitial())

    if (isLoggedIn() && this.isEventOrganizerInitial()) {
      this.getEvent();
      this.getAllInterestedUsers(this.$route.params.eventId)
    } else {
      this.backToEvent()
    }
  },

  methods: {

    /**
     * Takes the user to the manage attendee status page, provided they are the organiser
     */
    backToEvent() {
      this.$router.push({path: `/events/${this.$route.params.eventId}`}) // reload page
    },

    getAllInterestedUsers(toGetEventId) {
      axios.get(`http://localhost:4941/api/v1/events/${toGetEventId}/attendees`,
          {headers: {'X-Authorization': Cookies.get('authToken')}})
          .then((response) => {
            this.eventAttendees = response.data;
            this.getEventAttendeesIds();
            this.getAttendeeImages();

            this.eventAttendees.forEach((attendee) => {
              this.attendeeIds.push(attendee.attendeeId)
            });

          }).catch ((err) => {
            console.log(err)
          });
    },

    /**
     * Returns true if the event is in the past, else false.
     */
    checkIfEventInPast() {
      // this.convertDateToISOStr()
      let isDateInPast = null;
      if (new Date() > new Date(this.eventDate)) {
        isDateInPast = true;
      } else {
        isDateInPast = false;
      }
      return isDateInPast
    },

    updateStatus(statusVal) {

      const eventId = this.$route.params.eventId
      const userId = parseInt(this.toUpdateId);

      if (this.isEventOrganizerLoaded() === false) {
        this.$message({
          message: "You must be the event organizer to edit the attendee status.",
          type: 'error'
        });
      } else if (this.numAcceptedAttendees === this.eventCapacity) {
        this.$message({
          message: "The event is at maximum capacity.",
          type: 'error'
        });
      } else if (this.checkIfEventInPast()) {
        this.$message({
          message: "The event has already happened.",
          type: 'error'
        });
      } else if (!isNaN(userId) && this.attendeeIds.includes(userId)) {

        axios.patch(`http://localhost:4941/api/v1/events/${this.$route.params.eventId}/attendees/${userId}`,
            {
              "status": statusVal
            }, {headers: {'X-Authorization': Cookies.get('authToken')}})
            .then((response) => {
              this.eventAttendees = response.data;

              this.getEvent();
              this.getEventAttendees();
              this.$router.push({path: `/events/${eventId}/attendanceControl/${this.$route.params.orgId}`}) // reload page
              this.getEventAttendeesIds();
              this.getAttendeeImages();

              this.$message({
                message: `The status of the user with id ${userId} has been set to ${statusVal}.`,
                type: 'success'
              });

            }).catch((err) => {
              this.displayErrorMessageUsingCode(err.response.status)
        });
      } else {
        this.$message({
          message: "Please enter a user id of a user who has registered their interested. It must be an integer.",
          type: 'error'
        });
      }



      },

    /**
     * Get the info for a given event
     */
    getEvent() {
      axios.get(`http://localhost:4941/api/v1/events/${this.$route.params.eventId}`).then((response) => {

        this.singleEvent = response.data;
        this.eventIdVal = response.data.id;
        this.eventTitle = response.data.title;
        this.eventCapacity = response.data.capacity;
        this.numAcceptedAttendees = response.data.attendeeCount
        this.eventOrganizerId = response.data.organizerId;
        this.eventDate = response.data.date;

      }).catch ((err) => {
        this.displayErrorMessageUsingCode(err.response.status)
      });
    },


  /**
     * Display the error message based on the given error code
     */
    displayErrorMessageUsingCode(code) {
      if (code === 400) {
        this.$message({
          message: "Bad Request",
          type: 'error',
          duration: 5000
        });
      } else if (code === 401) {
        this.$message({
          message: "Unauthorized",
          type: 'error',
          duration: 5000
        });
      } else if (code === 403) {
        this.$message({
          message: "Forbidden",
          type: 'error',
          duration: 5000
        });
      } else if (code === 404) {
        this.$message({
          message: "Not Found",
          type: 'error',
          duration: 5000
        });
      } else if (code === 500) {
        this.$message({
          message: "Internal Server Error",
          type: 'error',
          duration: 5000
        });
      }
    },

    //-------------------------------------------- event attendees -----------------------------------------------------

    /**
     * Gets all the event attendees and returns then in an array
     */
    getEventAttendeesIds() {
      let allEventAttendeesIds = [];
      for (let i = 0; i < this.eventAttendees.length; i++) {
        allEventAttendeesIds.push(this.eventAttendees[i].attendeeId)
      }
      this.eventAttendeesIds = allEventAttendeesIds
    },

    /**
     * Gets the information about the attendees attending the given event
     */
    getEventAttendees() {
      axios.get(`http://localhost:4941/api/v1/events/${this.$route.params.eventId}/attendees`, {headers: {'X-Authorization': Cookies.get('authToken')}})
          .then((response) => {
            this.eventAttendees = response.data;
            this.getEventAttendeesIds();
            this.getAttendeeImages();

            this.attendanceStatus = this.getAttendanceStatus(this.eventAttendees)

            this.getAcceptedAttendees();

          }).catch((err) => {
            this.displayErrorMessageUsingCode(err.response.status)
          });
    },


    /**
     * Get all the image for all attendees
     */
    getAttendeeImages() {
      for (let i = 0; i < this.eventAttendees.length; i++) {
        this.getAttendeeImage(this.eventAttendees[i].attendeeId)
      }
    },

    /**
     * Get image of given user
     */
    getAttendeeImage(userId) {
      axios.get(`http://localhost:4941/api/v1/users/${userId}/image`, {}).then(() => {
        this.attendeesImagesMap.set(userId, `http://localhost:4941/api/v1/users/${userId}/image`);
      }).catch(() => {
        this.attendeesImagesMap.set(userId, defaultImage);
      });
    },

    /**
     * Returns the styled date for displaying
     */
    getStyledDate(dateToStyle) {
      return formatDate(dateToStyle);
    },

    /**
     * Returns the styled date for displaying
     */
    getStyledTime(timeToStyle) {
      return formatTime(timeToStyle);
    },

    /**
     * Converts the date to an ISO string
     */
    convertDateToISOStr() {
      this.ISODate = this.eventDate.toISOString();
    },

    /**
     * Check is the event is in the past.
     * Returns true is the date is in the past, otherwise false
     */
    hasEventPassed() {
      const now = new Date();

      if (this.eventDate !== null) {
        // this.convertDateToISOStr()
        if (now > new Date(this.eventDate)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },

    /**
     * Check if the current user is the event organiser i.e. their authToken matches the organiser's
     */
    isEventOrganizerInitial() {
      return parseInt(Cookies.get('userId')) === parseInt(this.$route.params.orgId);
    },

    /**
     * Check if the current user is the event organiser i.e. their authToken matches the organiser's
     */
    isEventOrganizerLoaded() {
      return parseInt(Cookies.get('userId')) === this.singleEvent.organizerId;
    },

    /**
     * Returns true if the user is attending the given event, else false.
     */
    getAttendanceStatus(attendeesList) {
      const userId = parseInt(Cookies.get('userId'))
      let status = "Not Attending";
      for (let i = 0; i < attendeesList.length; i++) {
        const attendee = attendeesList[i]

        if (attendee.attendeeId === userId) {
          status = attendee.status;
          break;
        }
      }
      return status
    },


    /**
     * Returns true is the event capacity has reached its maximum capacity, else false.
     * I.e. no one else can attend.
     */
    checkIfCapacityIsFull() {
      if (Number.isInteger(this.eventCapacity)) {
        return (this.numAcceptedAttendees === this.eventCapacity)
      } else {
        return false // unlimited capacity so is never full
      }

    },

    //-------------------------------------------------- nav bar -------------------------------------------------------

    /**
     * Take the user to the events page.
     */
    toEvents() {
      this.$router.push('/events');
    },

    /**
     * Prevent the user from accessing their events as they are not logged in.
     */
    toMyEvents() {
      if (isLoggedIn()) {
        this.$router.push({path: `/events/myEvents/${Cookies.get('userId')}`})
      } else {
        this.$message({
          message: "Please log in to access your events",
          type: 'error'
        });
      }
    },

    /**
     * Take the user to their profile page
     */
    toProfile() {
      if (isLoggedIn()) {
        this.$router.push({path: `/users/${Cookies.get('userId')}`});
      } else {
        this.$message({
          message: "Please log in to access your profile",
          type: 'error'
        });
      }
    },

    /**
     * Take the user to the login page
     */
    toLogin() {
      if (isLoggedIn()) {
        this.$message({
          message: "You are already logged in",
          type: 'error'
        });
      } else {
        this.$router.push('/users/login');
      }
    },

    /**
     * Logs the user out of the their account by deleting the cookies of the user, and sending them to
     * the login page.
     * @param event - The button event when it is called from the button press.
     */
    logOut() {

      if (isLoggedIn()) {
        const authToken = Cookies.get('authToken');
        Cookies.remove('userId');
        Cookies.remove('authToken');

        axios.post('http://localhost:4941/api/v1/users/logout', {}, {
          headers: {"X-Authorization": authToken}
        })
            .then(() => {
              this.$router.push({path: '/users/login'})
            }).catch((err) => {
          console.log(err)

        })
      } else {
        this.$message({
          message: "You cannot log out as you are not logged in",
          type: 'error'
        });
      }
    },

    //------------------------------------------------------------------------------------------------------------------

  }
}
</script>

<style scoped>
@import url('https://use.fontawesome.com/releases/v5.15.3/css/all.css');
@import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans&family=Oswald:wght@500&family=Roboto&family=Rochester&display=swap');


/*TODO: add fonts to all pages*/
.text-font, p, h, label, textarea, select, button {
  font-family: 'Roboto', sans-serif;
}

.box-card {
  margin: 4% auto 4% auto;
  width: 80%;
  padding: 20px;
}

.event-title {
  text-align: center;
}

.event-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: inherit!important;
}

.event-card-bottom {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.link-button {
  margin: 10px 10px 10px 10px;
  background: #03cdc6 none repeat scroll 0 0;
  color: white;
  outline: medium none;
  padding: 15px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  border: none;
}

.link-button:hover {
  background-color: #b1fff3;
  color: black;
  border: none;
}

.el-header, .el-footer {
  /*background-color: #B3C0D1;*/
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: left;
  line-height: 30px;
  padding-left: 40px;
  margin-top: 10px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

#card-header {
  font-size: 24px;
}

#organizer-image {
  width: 100px;
  border-radius: 50px;
}

#similar-events-container, #attendees-container {
  width: 100%;
}

#attendees-collapse, #similar-events-collapse {
  width: 800px;
}

#attending-label, #pending-label, #rejected-label , #not-requested-label, #date-passed-label, #full-label {
  padding: 5px;
  border-radius: 10px;
  font-size: 16px;
  color: white;
  font-weight: normal;
  font-style: italic;
  text-align: center;
}

#attending-label {
  background-color: #8cd967;
}

#pending-label {
  background-color: #faa743;
}

#rejected-label, #date-passed-label, #full-label {
  background-color: #fa5959;
}

#not-requested-label {
  background-color: royalblue;
}

#date-passed-label, #full-label {
  text-align: center;
  width: 160px;
  height: 24px;
  padding-bottom: 10px;
}

</style>