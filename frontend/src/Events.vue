<template>

  <!-----------------------------------------------------  Events ------------------------------------------------>
  <div id="events-page">

    <div id="nav-bar">
      <el-menu :default-active="activeIndex" id="nav-menu" mode="horizontal" @select="handleSelect">
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

    <div id="events-container">

      <h1 align="center">Events</h1>

      <!--search bar-->
      <div id="events-search-bar">
        <el-input placeholder="Please input" v-model="eventsSearchTerm" class="input-with-select" id="search-bar-input">
          <template #append>
            <el-button icon="el-icon-search" id="search-btn" v-on:click="searchButtonClicked()"></el-button>
          </template>
        </el-input>
      </div>

      <!------------------------------------- order by radio buttons- ----------------------------------------------->

      <div>
        <el-radio v-model="sortByRadioBtn" label="DATE_DESC">Date Most Recent</el-radio>
        <el-radio v-model="sortByRadioBtn" label="DATE_ASC">Date Least Recent</el-radio>
        <el-radio v-model="sortByRadioBtn" label="ATTENDEES_ASC">Attendees Least to Most</el-radio>
        <el-radio v-model="sortByRadioBtn" label="ATTENDEES_DESC">Attendees Most to Least</el-radio>
      </div>

      <!----------------------------------- filter by categories menu------------------------------------------------>

      <div id="filter-by-categories-container">
        <el-collapse>
          <el-collapse-item title="Filter By Categories">
            <el-checkbox v-model="category1">Outdoors & Adventure</el-checkbox>
            <el-checkbox v-model="category2">Tech</el-checkbox>
            <el-checkbox v-model="category3">Family</el-checkbox>
            <el-checkbox v-model="category4">Health & Wellness</el-checkbox>
            <el-checkbox v-model="category5">Sports & Fitness</el-checkbox>
            <el-checkbox v-model="category6">Learning</el-checkbox>
            <el-checkbox v-model="category7">Photography</el-checkbox>
            <el-checkbox v-model="category8">Food & Drink</el-checkbox>
            <el-checkbox v-model="category9">Writing</el-checkbox>
            <el-checkbox v-model="category10">Language & Culture</el-checkbox>
            <el-checkbox v-model="category11">Music</el-checkbox>
            <el-checkbox v-model="category12">Movements</el-checkbox>
            <el-checkbox v-model="category13">LGBTQ</el-checkbox>
            <el-checkbox v-model="category14">Film</el-checkbox>
            <el-checkbox v-model="category15">Sci-Fi & Games</el-checkbox>
            <el-checkbox v-model="category16">Beliefs</el-checkbox>
            <el-checkbox v-model="category17">Arts</el-checkbox>
            <el-checkbox v-model="category18">Book Clubs</el-checkbox>
            <el-checkbox v-model="category19">Dance</el-checkbox>
            <el-checkbox v-model="category20">Pets</el-checkbox>
            <el-checkbox v-model="category21">Hobbies & Crafts</el-checkbox>
            <el-checkbox v-model="category22">Fashion & Beauty</el-checkbox>
            <el-checkbox v-model="category23">Social</el-checkbox>
            <el-checkbox v-model="category24">Career & Business</el-checkbox>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!----------------------------------------    create event button ----------------------------------------------->
      <div id="create-event-btn-container">
        <el-button id="create-event-btn" class="link-button" v-on:click="toCreateEventPage()">Create Event</el-button>
      </div>

      <!----------------------------------------    page info --------------------------------------------------------->

      <div id="page-number-info">
        {{pageNumberInfo}}
      </div>

      <!----------------------------------------    events cards ------------------------------------------------------>
      <div class="col">
        <div class="card card-body">

          <hr/>

          <div v-for="currEvent in events"
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

        </div>

        <!------------------------------------- indicate when it's the last page -------------------------------------->

        <div id="last-page-text" v-if="isLastPage()">
          <label>
            Last page; no more results to show
          </label>
        </div>

      </div>

      <!--------------------------------------------------- pagination ------------------------------------------------>
      <div class="row">
        <div class="col">

          <h4>You are on page {{currentPage}}</h4>

          <!--page number buttons' navigation-->

          <el-row :gutter="12">

            <nav aria-label="user-table-navigation" id="pagination-nav" class="float-end" v-if="maxPage > 1">
              <ul class="pagination" id="pagination-ul">

                <el-col :span="7">
                  <div class="grid-content ">
                    <li class="page-item">
                      <el-link class="pg-link-button" href="#" @click="updatePage($event, 1)">First Page</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li :class="toggleDisableClass('page-item', currentPage-1 <= 0)">
                      <el-link class="pg-link-button" href="#" @click.prevent="previousPage()">Previous</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li class="page-item" v-if="maxPage > 2 && currentPage >= maxPage">
                      <el-link class="pg-link-button" href="#" @click="updatePage($event, currentPage-2)">{{currentPage-2}}</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li class="page-item" v-if="currentPage-1 > 0">
                      <el-link class="pg-link-button" href="#" @click="updatePage($event, currentPage-1)">{{currentPage-1}}</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li class="page-item" aria-current="page">
                      <el-link class="pg-link-button" href="#" @click="(e) => e.preventDefault()">{{currentPage}}</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li class="page-item" v-if="currentPage+1 <= maxPage">
                      <el-link class="pg-link-button" href="#" @click="updatePage($event, currentPage+1)">{{currentPage+1}}</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li class="page-item" v-if="maxPage > 2 && currentPage <= 1">
                      <el-link class="pg-link-button" href="#" @click="updatePage($event, currentPage+2)">{{currentPage+2}}</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li :class="toggleDisableClass('page-item', currentPage+1 > maxPage)" id="next-button">
                      <el-link class="pg-link-button" href="#" @click.prevent="nextPage()">Next</el-link>
                    </li>
                  </div>
                </el-col>

                <el-col :span="7">
                  <div class="grid-content ">
                    <li class="page-item">
                      <el-link class="pg-link-button" href="#" @click="updatePage($event, maxPage)">Last Page</el-link>
                    </li>
                  </div>
                </el-col>

              </ul>
            </nav>
          </el-row>
        </div>
      </div>

      <!--------------------------------------------------------------------------------------------------------------->

    </div>
  </div>

</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import EventsEventCard from "./components/EventsEventCard";
import defaultImage from "../public/default-profile-image.png";
import { isLoggedIn } from "./authUtils";

export default {
  name: 'Events',
  components: {
    EventsEventCard
  },
  data() {
    return {

      logoImage: "../logo.png",

      sortByRadioBtn: 'DATE_ASC',

      category1: false,
      category2: false,
      category3: false,
      category4: false,
      category5: false,
      category6: false,
      category7: false,
      category8: false,
      category9: false,
      category10: false,
      category11: false,
      category12: false,
      category13: false,
      category14: false,
      category15: false,
      category16: false,
      category17: false,
      category18 : false,
      category19: false,
      category20: false,
      category21: false,
      category22: false,
      category23: false,
      category24 : false,

      userImage: defaultImage,

      activeIndex: '1',
      error: "",
      errorFlag: "",
      events: [],
      totalEvents: "",
      eventsSearchTerm: "",
      categories: [], // ids, not names
      organizerId: "",
      sortByDefault: "DATE_DESC",
      sortBy: '', // the value that will be sent to the backend
      sortByTypes: [{
        sortByTypeValue: 'ALPHABETICAL',
        sortByTypeLabel: 'Title'
      }, {
        sortByTypeValue: 'DATE',
        sortByTypeLabel: 'Date'
      }, {
        sortByTypeValue: 'ATTENDEES',
        sortByTypeLabel: 'Number of Attendees'
      }, {
        sortByTypeValue: 'CAPACITY',
        sortByTypeLabel: 'Capacity'
      }],
      sortByTypeValue: '',
      sortByDirections: [{
        sortByDirectionValue: 'ASC',
        sortByDirectionLabel: 'Ascending'
      }, {
        sortByDirectionValue: 'DESC',
        sortByDirectionLabel: 'Descending'
      }],
      sortByDirectionValue: '',
      categoriesInfo: "",

      eventOrganizerId: "",

      startIndex: 0, //page number
      count: 10, // events per page

      maxPage: 1, // total number of pages needed
      currentPage: 1, // 0 based
      totalRows: 0,

      pageNumberInfo: "",
    }
  },

  /**
   *
   */
  mounted() {
    this.getEvents();
    this.getEventCategoryInfo();
  },

  methods: {

    /**
     * Toggles the disabling of pagination buttons.
     * @param baseClasses Base classes to add
     * @param condition Given condition for toggling
     * @returns {array} A list classes to apply
     */
    toggleDisableClass(baseClasses, condition) {
      const classList = [baseClasses]
      if (condition) {
        classList.push('disabled')
      }
      return classList
    },

    /**
     * Goes to the previous page and updates the rows.
     */
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.getEvents()
      }
    },

    /**
     * Goes to the next page and updates the rows.
     */
    nextPage() {
      if (this.currentPage < this.maxPage) {
        this.currentPage += 1;
        this.getEvents();
      }
    },

    //TODO: fix me
    /**
     * Updates the display to show the new page when a user clicks to move to a different page.
     * @param event The click event
     * @param newPageNum The page to move to
     */
    updatePage(event, newPageNum) {
      event.preventDefault();
      this.currentPage = newPageNum;
      this.getEvents();
    },

    /**
     * Create and save an event
     */
    toCreateEventPage() {
      if (isLoggedIn()) {
        this.$router.push({name: 'createEvent'});
      } else {
        this.$message({
          message: "Please log in to create an event.",
          type: 'error'
        });
      }
    },

    /**
     * Builds the query params string that will be used for getEvents().
     * e.g.  q=the&categoryIds=6&categoryIds=11&organizerId=3&sortBy=DATE_ASC&count=5&startIndex=0
     */
    eventsQueryBuilder(forGetEvents=true) {
      const queryTerms = [];
      const categoryElements = [this.category1, this.category2, this.category3, this.category4,
        this.category5, this.category6, this.category7, this.category8,
        this.category9, this.category10, this.category11,this.category12,
        this.category13, this.category14, this.category15, this.category16,
        this.category17, this.category18, this.category19, this.category20,
        this.category21, this.category22, this.category23, this.category24
      ];

      if (this.eventsSearchTerm.length > 0) {
        queryTerms.push(`q=${this.eventsSearchTerm}`)
      }

      for (let i = 0; i < categoryElements.length; i++) {
        if (categoryElements[i] === true) {
          queryTerms.push(`categoryIds=${i + 1}`)
        }
      }

      queryTerms.push(`sortBy=${this.sortByRadioBtn}`)

      if (forGetEvents) {
        queryTerms.push(`count=${this.count}`)
        queryTerms.push(`startIndex=${(this.currentPage - 1) * this.count}`)
      }
      const eventsQueryParamsStr = queryTerms.join("&");
      return eventsQueryParamsStr;
    },

    /**
     * Calculates the total number of events, after doing filtering and sorting
     */
    async determineTotalEvents() {
      const eventsQueryParamsStr = this.eventsQueryBuilder(false)

      console.log("params, det. total events")
      console.log(eventsQueryParamsStr)


      const totalEventCount = await axios.get(`http://localhost:4941/api/v1/events?${eventsQueryParamsStr}`)
          .then((response) => {

            const eventsList = [...response.data];
            console.log("total events")
            console.log(eventsList.length)

            return eventsList.length;
          }).catch((err) => {
            this.error = err;
            this.errorFlag = true;
          });
      return totalEventCount;
    },

    /**
     * Builds the page number information string in the format of "Showing 1-10 of 11 results"
     */
    buildPageNumInfoStr() {
      let startVal = "";
      let endVal = "";
      let totalVal = this.totalRows;

      if (this.totalRows === 0) {
        startVal = 0;
        endVal = 0;
      }

      // First page is the last page
      else if ((this.currentPage === 1) && (this.count > this.totalRows)) {
        startVal = 1;
        endVal = this.totalRows;
      } else if (this.currentPage === 1) { // First page is full
        startVal = 1;
        endVal = this.count;
      } else if (this.currentPage === this.maxPage) { // Last page
        startVal = ((this.currentPage - 1) * this.count) + 1;
        endVal = this.totalRows
      } else { // Middle page
        startVal = ((this.currentPage - 1) * this.count) + 1;
        endVal = (this.currentPage * this.count);
      }
      this.pageNumberInfo =`Showing ${startVal}-${endVal} of ${totalVal} results`
    },

    /**
     * Checks if it's the last page
     */
    isLastPage() {

      console.log("is last page?")
      console.log(this.currentPage)
      console.log(this.maxPage)

      return this.currentPage === this.maxPage
    },

    /**
     * Retrieve all the events, given the parameters for search term, filtering, ordering and pagination.
     * Also get the image for the event and organiser for each event
     * TODO: filtering, ordering and pagination
     */

    async getEvents() {

      const totalEventCount = await this.determineTotalEvents()

      console.log("total count")
      console.log(totalEventCount)

      if (totalEventCount <= 0) {
        this.currentPage = 1;
        this.maxPage = 1;
        this.totalRows = 0; // TODO: not sure if needed
      } else {
        this.maxPage = Math.ceil(totalEventCount / this.count)
        this.totalRows = totalEventCount;
      }

      this.buildPageNumInfoStr()
      const eventsQueryParamsStr = this.eventsQueryBuilder()

      axios.get(`http://localhost:4941/api/v1/events?${eventsQueryParamsStr}`)
          .then((response) => {
            this.events = response.data;
            const searchTerm = this.eventsSearchTerm;
            const matchingEvents = []; // array of events that contain the search term in their title

            // For each event, get the event and organiser image, and determine if the title of the return events
            // contains the search term/phrase
            this.events.forEach(function (event) {
              let organizerId = "";

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
              //---------------------------- check if title contains search term(s) ------------------------------------

              if ((event.title.toLowerCase()).includes(searchTerm.toLowerCase()) || (event.description.toLowerCase()).includes(searchTerm.toLowerCase())) {
                matchingEvents.push(event);
              }

            });

            this.events = matchingEvents;
            //--------------------------------------------------------------------------------------------------------

          }, (err) => {
            this.error = err;
            this.errorFlag = true;
          });
    },

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

    /**
     *
     */
    searchButtonClicked() {
      this.getEvents();
    },

    //-------------------------------------------------- nav bar -------------------------------------------------------

    /**
     * Take the user to the events page.
     */
    toEvents() {
      this.$message({
        message: "You are already on the events page",
      });
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
          // error.value = err;
          // errorFlag.value = true;
        })
      } else {
        this.$message({
          message: "You cannot log out as you are not logged in",
          type: 'error'
        });
      }
    },

    //------------------------------------------------------------------------------------------------------------------

  },

}

</script>

<style scoped>
@import url('https://use.fontawesome.com/releases/v5.15.3/css/all.css');
@import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans&family=Oswald:wght@500&family=Roboto&family=Rochester&display=swap');

#nav-bar {
  width: 100%;
  margin-right: -70px;
}

/*#logo-image {*/

/*}*/

.pg-link-button {
  margin: 10px 10px 10px 10px;
  border: #03cdc6 10px;
  background: #03cdc6 none repeat scroll 0 0;
  outline: medium none;
  padding: 15px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 18px;
  color: white;
}

.pg-link-button:hover {
  background-color: #b1fff3;
  color: black;
  border: none;
}

#events-search-bar {
  margin: 2% 16% 2% 16%;
}

#search-btn {
  background: #03cdc6 none repeat scroll 0 0;
  color: white;
}

#search-btn:hover {
  background-color: #b1fff3;
  color: black;
}

#events-container {
  margin: 4% 4% 4% 4%;
  padding: 4% 4% 4% 4%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

/*TODO: add fonts to all pages*/
.text-font, p, h, label, textarea, select, button {
  font-family: 'Roboto', sans-serif;
}

.page-item {
  list-style-type: none;
}

#nav-menu {
  margin-top: -3%;
  color: white;
  height: 100px;

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

.link-button:focus, #search-btn:focus {
  background-color: #b1fff3;
  color: black;
  border: none;
}

</style>