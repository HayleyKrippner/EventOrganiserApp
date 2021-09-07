<template>

  <!-----------------------------------------------------  Events ------------------------------------------------>
  <div id="events-page">

    <div id="nav-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item>
<!--          <el-image id="logo-image"-->
<!--                    :src="logoImage" alt="logo"></el-image>-->
        </el-menu-item>
        <el-menu-item class="nav-bar-item" index="1" @click="toEvents">Events</el-menu-item>
        <el-menu-item class="nav-bar-item" index="2" @click="toMyEvents">My Events</el-menu-item>
        <el-menu-item class="nav-bar-item" index="3" @click="toProfile">Profile</el-menu-item>
        <el-menu-item class="nav-bar-item" index="4" @click="toLogin">Login</el-menu-item>
        <el-menu-item class="nav-bar-item" index="5" @click="logOut">Logout</el-menu-item>
      </el-menu>
      <div class="line"></div>
    </div>

    <!-- errors -->
    <div v-if="errorFlag">
      <el-alert
          title="Whoops! Something went wrong."
          type="error">
        <span>Error: {{error}}</span>
      </el-alert>
    </div>

    <div id="events-container">

      <div class="col">
        <div class="card card-body">

          <!--     Events I organize     -->
          <h1 align="center">Events I Manage</h1>

          <el-collapse>
            <el-collapse-item title="Events I manage" id="events-managing-container">
              <div v-for="currEvent in eventsIManage"
                   :id="'EventCard' + currEvent.index"
                   :host="`${currEvent.eventOrganizerFName} ${currEvent.eventOrganizerLName}`"
                   v-bind:key="currEvent.index">
                <events-event-card
                    v-bind:eventId="currEvent.eventId"
                    v-bind:eventImage="currEvent.eventImage"
                    v-bind:organizerImage="currEvent.organizerImage"
                    v-bind:date-and-time="currEvent.date"
                    v-bind:title="currEvent.title"
                    v-bind:categoryNames="getAllCategoriesOfEvent(currEvent.categories).join(', ')"
                    v-bind:host="`${currEvent.organizerFirstName} ${currEvent.organizerLastName}`"
                    v-bind:numberOfAttendees="currEvent.numAcceptedAttendees"
                />
              </div>
            </el-collapse-item>
          </el-collapse>

          <hr/>

          <!--     Events I attend     -->
          <h1 align="center">Events I Attend</h1>

          <el-collapse>
            <el-collapse-item title="Events I attend" id="events-attending-container">
              <div v-for="currEvent in eventsIAttend"
                   :id="'EventCard' + currEvent.index"
                   :host="`${currEvent.eventOrganizerFName} ${currEvent.eventOrganizerLName}`"
                   v-bind:key="currEvent.index">
                <events-event-card
                    v-bind:eventId="currEvent.eventId"
                    v-bind:eventImage="currEvent.eventImage"
                    v-bind:organizerImage="currEvent.organizerImage"
                    v-bind:date-and-time="currEvent.date"
                    v-bind:title="currEvent.title"
                    v-bind:categoryNames="getAllCategoriesOfEvent(currEvent.categories).join(', ')"
                    v-bind:host="`${currEvent.organizerFirstName} ${currEvent.organizerLastName}`"
                    v-bind:numberOfAttendees="currEvent.numAcceptedAttendees"
                />
              </div>
            </el-collapse-item>
          </el-collapse>

        </div>
      </div>

    </div>
  </div>

</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import EventsEventCard from "./components/EventsEventCard";
import defaultImage from "../public/default-profile-image.png";
import {isLoggedIn} from "./authUtils";

export default {
  name: 'MyEvents',
  components: {
    EventsEventCard
  },
  data() {
    return {
      logoImage: "../logo.png",
      userImage: defaultImage,
      activeIndex: '2',
      error: "",
      errorFlag: "",
      events: [],
      categories: [], // ids, not names
      eventOrganizerId: "",
      eventsIManage: [],
      eventsIAttend: [],
    }
  },

  /**
   *
   */
  mounted() {
    if (isLoggedIn()) {
      this.getEvents();
      this.getEventCategoryInfo();
    } else {
      this.toEvents()
    }
  },

  methods: {

    /**
     * Get all events
     */
    getEvents() {

      axios.get(`http://localhost:4941/api/v1/events`)
          .then((response) => {
            this.events = response.data;
            this.eventsList = [...response.data];

            let theEventsIManage = [];
            let theEventsIAttend = []; // broken

            this.events.forEach(function (event) {
              let organizerId = ""

              // set organiser id
              axios.get(`http://localhost:4941/api/v1/events/${event.eventId}`).then((response) => {
                const singleEventInfo = response.data

                for (let i = 0; i < this.events.length; i++) {
                  if (this.events[i].eventId === event.eventId) {
                    this.events[i].organizerId = singleEventInfo.organizerId
                    console.log("ppppppppppppppppppppppp")
                    console.log(this.events[i].organizerId)
                  }
                }
              }).catch((error) => {
                console.log(error)
              })





              if (parseInt(Cookies.get('userId')) === event.organizerId) {
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
                theEventsIManage.push(event)
              } else {
                axios.get(`http://localhost:4941/api/v1/events/${event.eventId}`).then((response) => {
                  const attendeesList = response.data;
                  // console.log(attendeesList)

                  for (let i = 0; i < attendeesList.length; i ++) {
                    if (attendeesList[i].attendeeId === parseInt(Cookies.get('userId'))) {
                      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjj")
                      theEventsIAttend.push(event);
                      break;
                    }
                  }

                }).catch((error) => {
                  console.log(error)
                })
              }

              //----------------------------------------- get event image ----------------------------------------------

              axios.get(`http://localhost:4941/api/v1/events/${event.eventId}/image`).then(() => {
                event.eventImage = `http://localhost:4941/api/v1/events/${event.eventId}/image`;
              }, () => {
                event.eventImage = defaultImage
              });

              //----------------------------------------- get organiser id ---------------------------------------------

              axios.get(`http://localhost:4941/api/v1/events/${event.eventId}`).then((response) => {
                organizerId = response.data.organizerId;

                //----------------------------------------- get organiser image ----------------------------------------

                axios.get(`http://localhost:4941/api/v1/users/${organizerId}/image`, {}).then(() => {
                  event.organizerImage = `http://localhost:4941/api/v1/users/${organizerId}/image`;

                  }).catch(() => {
                    event.organizerImage = defaultImage
                })
              }, (err) => {
                this.error = err;
                this.errorFlag = true;
              });
              //--------------------------------------------------------------------------------------------------------

            });

            this.eventsIAttend = theEventsIAttend;
            this.eventsIManage = theEventsIManage;

            console.log("theEventsIAttend")
            console.log(this.eventsIAttend)
            console.log("theEventsIManage")
            console.log(this.eventsIManage)
            console.log("done")

            console.log("org id again")
            console.log(this.events[0].organizerId)

            //--------------------------------------------------------------------------------------------------------

          }, (err) => {
            this.error = err;
            this.errorFlag = true;
          });
    },

    /**
     * Get the organiser id of the given event
     */
    setOrganizerId(eventId) {
      axios.get(`http://localhost:4941/api/v1/events/${eventId}`).then((response) => {
        const singleEventInfo = response.data

        for (let i = 0; i < this.events.length; i++) {
          if (this.events[i].eventId === eventId) {
            this.events[i].organizerId = singleEventInfo.organizerId
          }
        }
        }).catch((error) => {
          console.log(error)
      })
    },

    // /**
    //  * Check if the logged in user is attending the event with the given event id
    //  * @return true if is attending, otherwise false
    //  */
    // isAttending(eventIdToCheck) {
    //
    //   axios.get(`http://localhost:4941/api/v1/events/${eventIdToCheck}`).then((response) => {
    //     const attendeesList = response.data;
    //     console.log(attendeesList)
    //     let isAnAttendee = false;
    //
    //     for (let i = 0; i < attendeesList.length; i ++) {
    //       if (attendeesList[i].attendeeId === parseInt(Cookies.get('userId'))) {
    //         isAnAttendee = true;
    //         break;
    //       }
    //     }
    //     return isAnAttendee;
    //     }).catch((error) => {
    //       console.log(error)
    //   })
    // },

    // /**
    //  *
    //  */
    // determineEventTypes() {
    //
    //   let theEventsIManage = [];
    //   let theEventsIAttend = []; // broken
    //
    //   this.events.forEach(function (event) {
    //
    //     //----------------------------------------- get organiser id ---------------------------------------------
    //
    //     axios.get(`http://localhost:4941/api/v1/events/${event.eventId}`).then((response) => {
    //       event.organizerId = response.data.organizerId;
    //
    //       // check if organiser or attendee
    //       if (parseInt(Cookies.get('userId')) === event.organizerId) {
    //         theEventsIManage.push(event)
    //       } else {
    //         theEventsIAttend.push(event)
    //       }
    //     })
    //   }),
    //
    //   this.eventsIAttend = theEventsIAttend;
    //   this.eventsIManage = theEventsIManage;
    //
    //
    // },

    /**
     *
     */
    getAllCategoriesOfEvent(categoryIds) {
      let categoryNames = [];
      let categoryName = "";
      let categoryInfoObj = "";
      for (let i = 0; i < this.categoriesInfo.length; i ++) {
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
            console.log(this.categoriesInfo)
          }, (err) => {
            this.error = err;
            this.errorFlag = true;
          });
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
      return this.eventImage
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
      this.$message({
        message: "You are already on your events page",
      });
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
        this.activeIndex = '2';
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
        this.activeIndex = '2';
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
          // error.value = err;
          // errorFlag.value = true;
        })
      } else {
        this.$message({
          message: "You cannot log out as you are not logged in",
          type: 'error'
        });
        this.activeIndex = '2';
      }
    },

    //------------------------------------------------------------------------------------------------------------------

  },
}

</script>

<style scoped>

@import url('https://use.fontawesome.com/releases/v5.15.3/css/all.css');
@import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans&family=Oswald:wght@500&family=Roboto&family=Rochester&display=swap');


/*TODO: add fonts to all pages*/
.text-font, p, h, label, textarea, select, button {
  font-family: 'Roboto', sans-serif;
}

#events-pagination-btns {
  margin-top: 4%;
}

#events-search-bar {
  margin: 2% 16% 2% 16%;
}

#search-btn {
  background-image: linear-gradient(to right, #56ab2f 0%, #a8e063  51%, #56ab2f  100%);
  color: white;
}

#events-container {
  margin: 4% 4% 4% 4%;
  padding: 4% 4% 4% 4%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
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

</style>