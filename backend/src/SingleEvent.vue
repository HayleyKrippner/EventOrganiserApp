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

    <el-card class="box-card">

      <el-container>
        <el-header id="card-header">{{ eventTitle }}</el-header>
        <el-divider></el-divider>
        <el-container>

          <el-aside width="200px" id="side-container">
<!--              <img class="card-img" :src="eventImage" id="event-image" width="200px">-->
            <el-image id="event-image"
                :src="eventImage"></el-image>

            <div id="attendance-status">
              <div v-if="attendanceStatus === 'accepted'">
                <h4 id="attending-label" class="text-font">Attending</h4>
              </div>
              <div v-else-if="attendanceStatus === 'pending'">
                <h4 id="pending-label" class="text-font">Pending</h4>
              </div>
              <div v-else-if="attendanceStatus === 'rejected'">
                <h4 id="rejected-label" class="text-font">Rejected</h4>
              </div>
              <div v-else>
                <h4 id="not-requested-label" class="text-font">Not Requested</h4>
              </div>
            </div>

            <div v-if="isEventOrganizer()" id="att-control-btn-container">
              <el-button @click="manageAttendees" id="att-control-btn" class="link-button">Manage Attendees</el-button>
            </div>
          </el-aside>

          <el-container>
            <el-main>

              <div v-if="eventCapacity - numAcceptedAttendees === 0 && Number.isInteger(eventCapacity)">
                <h4 id="full-label" class="text-font">Full</h4>
              </div>

              <div v-if="hasEventPassed()">
                <h4 id="date-passed-label" class="text-font">Event Ended</h4>
              </div>

              <div>
                <span class="info-line title-styling">Date: </span><span>{{styledEventDate}}</span>
              </div>
              <div>
                <span class="info-line title-styling">Time: </span><span>{{styledEventTime}}</span>
              </div>
              <div>
                <span class="info-line title-styling">Organizer: </span><span>{{eventOrganizerFName}} {{eventOrganizerLName}}</span>
              </div>
              <div>
                <img class="card-img" :src="organizerImage" id="organizer-image">
              </div>

              <div>
                <span class="info-line title-styling">Categories: </span><span>{{getAllCategoriesOfEvent(eventCategoryIds).join(", ")}}</span>
              </div>
              <div>
                <span class="info-line title-styling">Description: </span><span>{{eventDescription}}</span>
              </div>
              <div v-if="eventCapacity !== null">
                <span class="info-line title-styling">Capacity:  </span><span>{{eventCapacity}}</span>
              </div>
              <div v-else>
                <span class="info-line title-styling">Capacity:  </span><span>Unlimited</span>
              </div>

              <div v-if="numAcceptedAttendees === null">
                <span class="info-line title-styling">No attendees</span>
              </div>
              <div v-else>
              <span class="info-line title-styling">Number of Attendees:  </span><span>{{numAcceptedAttendees}}</span>
              </div>

              <div v-if="Number.isInteger(eventCapacity)">
                <span class="info-line title-styling">Seats available:  </span><span>{{eventCapacity - numAcceptedAttendees}}</span>
              </div>
              <div v-else>
                <span class="info-line title-styling">Seats available:  </span><span>Unlimited</span>
              </div>

              <div>
                <span class="info-line title-styling">Online:  </span><span>{{convertEventIsOnline()}}</span>
              </div>

              <div v-if="eventUrl !== null">
                <span class="info-line title-styling">Event URL:  </span><span>{{eventUrl}}</span>
              </div>
              <div v-else>
                <span class="info-line title-styling">Event URL:  </span><span>N/A</span>
              </div>
              <div v-if="eventVenue !== null">
                <span class="info-line title-styling">Venue:  </span><span>{{eventVenue}}</span>
              </div>
              <div v-else>
                <span class="info-line title-styling">Venue:  </span><span>N/A</span>
              </div>

              <div v-if="isEventFree">
                <span class="info-line title-styling">Cost:  </span><span>Free</span>
              </div>
              <div v-else>
                <span class="info-line title-styling">Cost:  </span><span>${{ eventFee }}</span>
              </div>

            </el-main>

            <el-footer>
              <div class="event-card-bottom">
                <div v-if="isEventOrganizer()">

                  <el-button @click="openEditEventModal" id="edit-event-btn" class="link-button">Edit Event</el-button>

                  <el-popconfirm
                      confirmButtonText='OK'
                      confirm-button-type="danger"
                      cancelButtonText='No, Thanks'
                      icon="el-icon-info"
                      iconColor="red"
                      title="Are you sure you want to delete this event?"
                      @confirm="deleteEvent($route.params.eventId)">
                    <template #reference>
                      <el-button class="link-button">Delete Event</el-button>
                    </template>
                  </el-popconfirm>
                </div>
                <div>
                  <el-button @click="attendEvent" id="attend-event-btn" class="link-button">Attend Event</el-button>
                </div>

                <div>

                  <el-popconfirm
                      confirmButtonText='OK'
                      confirm-button-type="danger"
                      cancelButtonText='No, Thanks'
                      icon="el-icon-info"
                      iconColor="red"
                      title="Are you sure to revoke your attendance of this event?"
                      @confirm="cancelAttendanceReq($route.params.eventId)">
                    <template #reference>
                      <el-button id="cancel-attendance-btn" class="link-button">Cancel Attendance</el-button>
                    </template>
                  </el-popconfirm>


<!--                  <el-button @click=""  class="link-button"></el-button>-->
                </div>

              </div>
            </el-footer>

          </el-container>
        </el-container>

        <el-divider></el-divider>

      <!------------------------------------------- attendees container ----------------------------------------------->
        <el-container id="attendees-container">
          <div>
          <el-collapse>
            <el-collapse-item title="View Attendees" id="attendees-collapse">
              <div v-for="currAttendee in acceptedAttendeesList"
                   :id="'attendee-card-' + currAttendee.index"
                   v-bind:key="currAttendee.index">
                  <event-attendee-card
                      v-bind:userIdVal="currAttendee.attendeeId"
                      v-bind:firstName="currAttendee.firstName"
                      v-bind:lastName="currAttendee.lastName"
                      v-bind:role="getRole(currAttendee.attendeeId)"
                      v-bind:attendeeImage="attendeesImagesMap.get(currAttendee.attendeeId)"
                  />
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-container>

        <!------------------------------------ similar events container ----------------------------------------------->

        <el-container id="similar-events-container">
          <div>
            <el-collapse>
              <el-collapse-item title="View Similar Events"

                                @click="getSimilarEvents($route.params.eventId)"
                                id="similar-events-collapse">
                <div v-for="similarEvent in similarEvents"
                     :id="'similar-event-card-' + similarEvent.index"
                     v-bind:key="similarEvent.index">
                  <similar-event-card
                      v-bind:title="similarEvent.title"
                      v-bind:eventId="similarEvent.eventId"
                      v-bind:eventImage="similarEventsImagesMap.get(similarEvent.eventId)"
                      v-bind:description="similarEvent.description"
                  />
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-container>

      </el-container>

    </el-card>

  </div>

</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import defaultImage from "../public/default-profile-image.png";
import {formatDate, formatTime} from './dateUtils.js';
import {isLoggedIn} from "./authUtils";
import EventAttendeeCard from "./components/EventAttendeeCard";
import SimilarEventCard from "./components/SimilarEventCard";

export default {
  name: "SingleEvent",
  components: {
    EventAttendeeCard,
    SimilarEventCard
    },
  data() {
    return {
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

      acceptedAttendeesList: [],

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
    this.getEvent(this.$route.params.eventId);
    this.getEventCategoryInfo();
    this.getEventAttendees(this.$route.params.eventId)
    this.getAllEvents();
  },

  methods: {

    /**
     * Takes the user to the manage attendee status page, provided they are the organiser
     */
    manageAttendees() {
      console.log(this.eventOrganizerId)

      this.$router.push({path: `/events/${this.$route.params.eventId}/attendanceControl/${this.eventOrganizerId}`}) // reload page
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

    /**
     * Get all events
     */
    getAllEvents() {
      axios.get(`http://localhost:4941/api/v1/events`)
          .then((response) => {
            this.allEvents = response.data;
          }).catch((err) => {
        this.error = err;
        this.errorFlag = true;
      });
    },

    //-------------------------------------------- similar events ------------------------------------------------------

    /**
     * Get the events that have the at least one category in common with the event in question
     */
    getSimilarEvents(eventId) {
      const likeEvents = [];
      let eventObj = ""
      for (let i = 0; i < this.allEvents.length; i++) {
        eventObj = this.allEvents[i]
        for (let j = 0; j < this.eventCategoryIds.length; j++) {
          if (eventObj.categories.includes(this.eventCategoryIds[j])) {
            if (eventObj.eventId !== parseInt(eventId)) {
              likeEvents.push(eventObj);
              break;
            }
          }
        }
      }
      this.similarEvents = likeEvents;
      this.getSimilarEventsImages()

    },

    /**
     * Get all the image for all similar events
     */
    getSimilarEventsImages() {
      for (let i = 0; i < this.similarEvents.length; i++) {
        this.getSimilarEventsImage(this.similarEvents[i].eventId)
      }
    },

    /**
     * Get image of given similar event
     */
    getSimilarEventsImage(eventId) {
      axios.get(`http://localhost:4941/api/v1/events/${eventId}/image`, {}).then(() => {
        this.similarEventsImagesMap.set(eventId, `http://localhost:4941/api/v1/events/${eventId}/image`)
      }).catch(() => {
        this.similarEventsImagesMap.set(eventId, defaultImage)
      });
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
    getEventAttendees(toGetEventId) {
      axios.get(`http://localhost:4941/api/v1/events/${toGetEventId}/attendees`, {headers: {'X-Authorization': Cookies.get('authToken')}})
          .then((response) => {
            this.eventAttendees = response.data;
            this.getEventAttendeesIds();
            this.getAttendeeImages();

            this.attendanceStatus = this.getAttendanceStatus(this.eventAttendees)

            this.getAcceptedAttendees();

          }, (err) => {
            this.error = err;
            this.errorFlag = true;
          });
    },

    /**
     * Determines the role of the attendee and decides if the attendee is an attendee or the organiser of
     * the given event
     */
    getRole(attendeeId) {
      return (attendeeId === this.singleEvent.organizerId) ? "Event Organiser" : "Event Attendee";
    },

    /**
     * Gets the names of the categories that the event is in
     */
    getAllCategoriesOfEvent(categoryIds) {
      let categoryNames = [];
      let categoryName = "";
      let categoryInfoObj = "";

      for (let i = 0; i < this.categoriesInfo.length; i++) {
        categoryInfoObj = this.categoriesInfo[i]
        if (categoryIds.includes(categoryInfoObj.id)) {
          categoryName = categoryInfoObj.name;
          categoryNames.push(categoryName);
        }
      }
      return categoryNames;
    },

    /**
     * Gets the event categories' info
     */
    getEventCategoryInfo() {
      axios.get('http://localhost:4941/api/v1/events/categories')
          .then((response) => {
            this.categoriesInfo = response.data;
            this.getAllCategoriesOfEvent(this.categoryIds)
          }, (err) => {
            this.error = err;
            this.errorFlag = true;
          });
    },

    //------------------------------------------------------------------------------------------------------------------

    /**
     * Checks if event is free
     */
    isEventFree() {
      return (this.eventFee === 0);
    },

    /**
     * Get image of given event
     */
    getEventImage(toGetEventId) {
      axios.get(`http://localhost:4941/api/v1/events/${toGetEventId}/image`).then(() => {
        this.eventImage = `http://localhost:4941/api/v1/events/${toGetEventId}/image`;
      }, () => {
        this.eventImage = defaultImage
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
     * Get the info for a given event
     */
    getEvent(toGetEventId) {
      axios.get(`http://localhost:4941/api/v1/events/${toGetEventId}`).then((response) => {

        this.singleEvent = response.data;
        this.singleEvent = response.data;
        this.eventIdVal = response.data.id;
        this.eventTitle = response.data.title;
        this.eventCategoryIds = response.data.categories;
        this.eventOrganizerFName = response.data.organizerFirstName;
        this.eventOrganizerLName = response.data.organizerLastName;
        this.eventCapacity = response.data.capacity;
        this.numAcceptedAttendees = response.data.attendeeCount
        this.eventDescription = response.data.description;
        this.eventOrganizerId = response.data.organizerId;
        this.eventDate = response.data.date;
        this.styledEventDate = this.getStyledDate(response.data.date);
        this.eventTime = response.data.date;
        this.styledEventTime = this.getStyledTime(response.data.date);
        this.eventIsOnline = response.data.isOnline;
        this.eventUrl = response.data.url;
        this.eventVenue = response.data.venue;
        this.eventRequiresAttendanceControl = response.data.requiresAttendanceControl;
        this.eventFee = response.data.fee;

        this.getEventImage(this.$route.params.eventId)

        //----------------------------------------- get organiser image ------------------------------------------------

        axios.get(`http://localhost:4941/api/v1/users/${this.eventOrganizerId}/image`, {}).then(() => {
          this.organizerImage = `http://localhost:4941/api/v1/users/${this.eventOrganizerId}/image`;
        }, () => {
          this.organizerImage = defaultImage
        })

        //--------------------------------------------------------------------------------------------------------------


      }, (err) => {
        this.error = err;
        this.errorFlag = true;
      });
    },

    // TODO: test this
    /**
     * Generate the JSON request body for the event updates a user wants
     * @return editRequestBodyJson the JSON request body
     */
    getEditRequestBody() {

      let editRequest = {};

      if (this.titleUpdated !== "") {
        editRequest.title = this.titleUpdated
      }
      if (this.descriptionUpdated !== "") {
        editRequest.description = this.descriptionUpdated
      }
      if (this.descriptionUpdated !== "") {
        editRequest.description = this.descriptionUpdated
      }
      if (this.categoryIdsUpdated !== []) {
        editRequest.categoryIds = this.categoryIdsUpdated
      }
      if (this.dateUpdated !== "") {
        editRequest.date = this.dateUpdated
      }
      if (this.isOnlineUpdated !== "") {
        editRequest.isOnline = this.isOnlineUpdated
      }
      if (this.urlUpdated !== "") {
        editRequest.url = this.urlUpdated
      }
      if (this.venueUpdated !== "") {
        editRequest.venue = this.venueUpdated
      }
      if (this.capacityUpdated !== "") {
        editRequest.capacity = this.capacityUpdated
      }
      if (this.requiresAttendanceControlUpdated !== "") { // TODO: not sure if should be "" or just pick current val as default
        editRequest.eventRequiresAttendanceControl = this.requiresAttendanceControlUpdated
      }
      if (this.feeUpdated !== "") {
        editRequest.fee = this.feeUpdated
      }
      return JSON.stringify(editRequest);
    },

    // TODO: implement this
    /**
     * Edits the given event's details
     * Only the organiser can edit an event.
     * @param toEditEventId the id of the event to edit
     */
    editEvent(toEditEventId) {
      const editRequestBody = this.getEditRequestBody();
      axios.patch(`http://localhost:4941/api/v1/events/${toEditEventId}`,
          editRequestBody,
          {headers: {"X-Authorization": Cookies.get('authToken')}})
          .then(() => {
            this.$router.push({path: `/events/${toEditEventId}`}) // reload page
          }, (err) => {
            this.error = err;
            this.errorFlag = true;
          });
    },

    // TODO: implement this
    /**
     * Deletes the given event and takes the user back to the events page.
     * Only the organiser can delete an event.
     * @param toDeleteEventId the id of the event to delete
     */
    deleteEvent(toDeleteEventId) {

      // event has happened i.e. is in the past
      if (this.hasEventPassed()) {
        this.$message({
          message: "You cannot delete an event that has already happened.",
          type: 'error'
        });
      } else {
        // event is in the future so it can be deleted
        axios.delete(`http://localhost:4941/api/v1/events/${toDeleteEventId}`,
            {headers: {'X-Authorization': Cookies.get('authToken')}})
            .then(() => {
              this.$router.push({name: 'events'})
            }, (err) => {
              this.error = err;
              this.errorFlag = true;
            });
      }
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
    isEventOrganizer() {
      return parseInt(Cookies.get('userId')) === this.eventOrganizerId;
    },

    /**
     * Converts the eventIsOnline value from 1 to Yes and 0 to No
     */
    convertEventIsOnline() {
      return (this.eventIsOnline === 1) ? "Yes" : "No"
    },

    /**
     * Gets only the accepted attendees
     */
    getAcceptedAttendees() {
      for (let i = 0; i < this.eventAttendees.length; i++) {

        const attendee = this.eventAttendees[i]

        if (attendee.status === "accepted") {

          let notPresent = true
          for (let j = 0; j < this.acceptedAttendeesList.length; j++) {

            if (this.acceptedAttendeesList[j].attendeeId === attendee.attendeeId) {
              notPresent = false
            }
          }

          if (notPresent) {
            this.acceptedAttendeesList.push(attendee);
            // break;
          }
        }
      }
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
     * Returns true if the user has already requested to attend the event.
     */
    checkIfRequestAlreadySent() {
      this.getEventAttendees(this.eventIdVal)
      const userId = parseInt(Cookies.get('userId'))
      let isAttending = false;
      for (let i = 0; i < this.eventAttendees.length; i++) {
        const attendee = this.eventAttendees[i]
        if (attendee.attendeeId === userId) {
          isAttending = true;
          break;
        }
      }
      return isAttending
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

    /**
     *
     */
    checkIfUserCanAttend() {

      let userCanAttend = true;

      const isLoggedInBoolean = isLoggedIn(); // working
      const isEventInPastBoolean = this.checkIfEventInPast(); // working
      const doesEventRequireAttControl = (this.singleEvent.requiresAttendanceControl === 1) // working
      let isCapacityFull = null;
      if (doesEventRequireAttControl) {
        isCapacityFull = this.checkIfCapacityIsFull()
      }
      const hasSentRequest = this.checkIfRequestAlreadySent()

      if ((isLoggedInBoolean && !isEventInPastBoolean && doesEventRequireAttControl && !isCapacityFull && !hasSentRequest)
          || (isLoggedInBoolean && !isEventInPastBoolean && !doesEventRequireAttControl && !hasSentRequest)) {
        userCanAttend = true;
      } else {

        userCanAttend = false;
        if (isLoggedInBoolean === false) {
          this.$message({
            message: "Please log in or register to attend events.",
            type: 'error'
          });
        } else if (isEventInPastBoolean) {
          this.$message({
            message: "You cannot attend an event that is in the past.",
            type: 'error'
          });

        } else if (hasSentRequest) {

          if (this.attendanceStatus === "pending") {
            this.$message({
              message: "You have already sent a request to attend.",
              type: 'error'
            });
          } else if (this.attendanceStatus === "accepted") {
            this.$message({
              message: "You are already attending this event.",
              type: 'error'
            });
          } else if (this.attendanceStatus === "rejected") {
            this.$message({
              message: "The organiser will not let you attend this event.",
              type: 'error'
            });
          }

        } else if (doesEventRequireAttControl) {
          if (isCapacityFull) {
            this.$message({
              message: "You cannot attend this event as its capacity is full.",
              type: 'error'
            });
          }
        }
      }

      return userCanAttend;
    },

    /**
     * Check if the user can attend the event.
     * If allowed, then the user can send a request to attend
     */
    attendEvent() {
      const eventId = this.eventIdVal

      if (this.checkIfUserCanAttend()) {

        axios.post(`http://localhost:4941/api/v1/events/${eventId}/attendees`, {}, {
          headers: {"X-Authorization": Cookies.get('authToken')}
        })
            .then(() => {
              this.$router.push({path: `/events/${this.eventIdVal}`})
            }).catch((err) => {
          console.log(err)
        })

        if (!this.eventRequiresAttendanceControl) {
          this.numAcceptedAttendees += 1;
          let newFirstName = null;
          let newLastName = null;

          this.getAttendeeImage(Cookies.get('userId'))

          axios.get(`http://localhost:4941/api/v1/users/${Cookies.get('userId')}`,
              {headers: {'X-Authorization': Cookies.get('authToken')}}
          ).then((response) => {
            newFirstName = response.data.firstName
            newLastName = response.data.lastName
          }).catch(() => {
          });

          this.eventAttendees.push({
            "attendeeId": Cookies.get('userId'),
            "firstName": newFirstName,
            "lastName": newLastName,
            "dateOfInterest": new Date(),
            "status": "accepted"
          })

          this.$message({
            message: "Request has been accepted!",
            type: 'success'
          });

        } else {

          this.$message({
            message: "Request has sent!",
            type: 'success'
          });
        }

        this.getEventAttendees(this.eventIdVal)
        this.attendanceStatus = this.getAttendanceStatus();
        // this.$router.push('/events/${eventId}');
      }
    },

    /**
     * Check if the user can cancel their event attendance
     */
    checkIfCanCancelAttendance() {
      const isLoggedInBoolean = isLoggedIn(); // working
      const isEventInPastBoolean = this.checkIfEventInPast(); // working
      let canCancel = false;

      if (!isLoggedInBoolean) {
        this.$message({
          message: "Please log in to cancel your attendance.",
          type: 'error'
        });
      } else if (isEventInPastBoolean) {
        // if event has happened, cannot cancel
        this.$message({
          message: "You cannot cancel attendance of an event that is in the past.",
          type: 'error'
        });
      } else if (isEventInPastBoolean) {
        // if event has happened, cannot cancel
        this.$message({
          message: "You cannot cancel attendance of an event that is in the past.",
          type: 'error'
        });
      } else if (this.attendanceStatus === "rejected") {
        this.$message({
          message: "You cannot cancel attendance of an event when your attendance status is 'rejected'.",
          type: 'error'
        });
      } else if (this.attendanceStatus === "accepted" || this.attendanceStatus === "pending") {
        canCancel = true;
      }
      return canCancel;
    },

    /**
     * Remove the attendee from the accepted event attendees, provided their status is accepted.
     */
    removeAttendeeFromList() {
      const userId = parseInt(Cookies.get('userId'))

      for (let i = 0; i < this.acceptedAttendeesList.length; i++) {
        const attendee = this.acceptedAttendeesList[i]
        if (attendee.attendeeId === userId) {
          this.acceptedAttendeesList.splice(i, 1);
        }
      }
    },

    /**
     * Cancel event attendance.
     * If the user is pending or accepted, they can cancel.
     * If they are rejected, they cannot cancel.
     * If the event has happened, they cannot cancel.
     */
    cancelAttendanceReq() {
      const canCancel = this.checkIfCanCancelAttendance()

      if (canCancel) {

        axios.delete(`http://localhost:4941/api/v1/events/${this.eventIdVal}/attendees`, {
          headers: {"X-Authorization": Cookies.get('authToken')}
        })
            .then(() => {
              this.$router.push({path: `/events/${this.eventIdVal}`})
            }).catch((err) => {
          this.displayErrorMessageUsingCode(err.response.status)
        })

        this.numAcceptedAttendees -= 1;

        if (this.attendanceStatus === "accepted") {
          this.removeAttendeeFromList()
        }

        this.attendanceStatus = null;
        this.getEventAttendees(this.eventIdVal)

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

.title-styling {
  font-weight: bold;
}

</style>