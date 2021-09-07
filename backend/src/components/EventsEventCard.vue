<template>
  <div id="card">
    <div class="row no-gutters">

      <!--image-->
      <div id="image" class="col">
        <div class="ratio ratio-1x1">
          <img class="card-img" :src="eventImage" id="event-image" style="width: 200px; border-radius: 10px">
<!--          <el-image id="event-image"-->
<!--                    :src="eventImage"></el-image>-->
        </div>
      </div>

      <div class="col">
        <div class="card-body px-3 py-3">

          <!--Event info-->
          <h3 class="card-title">{{ title }}</h3>
          <h6 class="card-text">
            Categories: {{ categoryNames }}
          </h6>
          <h6 class="card-text">
            Host: {{ host }}
          </h6>

          <div id="organizer-image-container">
<!--            <el-image id="organizer-image"-->
<!--                      :src="organizerImage"></el-image>-->

            <img class="card-img" :src="organizerImage" id="organizer-image" style="width: 60px; border-radius: 50px">
          </div>

          <h6 class="card-text" align="right">
            Number of Attendees: {{ numberOfAttendees }}
          </h6>

        </div>
      </div>

    </div>
    <div>

      <div id="date-container">
        <!--date-->
        <hr id="lineBreak">
        <div class="row">
          <div class="col-md text-center" v-if="dateAndTime != null">
            <span id="date">{{ eventDate }}, </span><span id="time">{{ eventTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <div id="buttons">
      <router-link class="link-button" :to="{name: 'event', params: {eventId: eventId}}">View Event Details</router-link>
    </div>

  </div>

</template>

<script>

import defaultImage from "../../public/default-profile-image.png";
import {formatDate, formatTime} from '../dateUtils.js';

export default {
  name: "EventsEventCard",
  props: {
    eventId: {
      type: Number,
      default: -1,
      required: true
    },
    eventImage: {
      type: String,
      default: defaultImage,
      required: false
    },
    organizerImage: {
      type: String,
      default: defaultImage,
      required: false
    },
    dateAndTime: {
      type: String,
      default: "None",
      required: true
    },
    title: {
      type: String,
      default: "None",
      required: true
    },
    categoryNames: {
      type: String,
      // default: [],
      required: true
    },
    host: {
      type: String,
      default: "None",
      required: true
    },
    numberOfAttendees: {
      type: Number,
      default: 0,
      required: false
    },
  },

  data() {
    return {
      eventTime: "",
      eventDate: "",

    }
  },
  mounted() {
    this.formatDateAndTime()
  },
  methods: {

    formatDateAndTime() {
      this.eventDate = formatDate(this.dateAndTime);
      this.eventTime= formatTime(this.dateAndTime);
    }
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
#lineBreak {
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
}

h6 {
  margin: 0;
}

.card-img {
  width: 20px;
  height: auto;
}

#card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-bottom: 30px;
  border-radius: 25px;
  padding: 20px 20px 20px 20px;
}

/*Can change the event image styling here*/
#image {
  object-fit: cover;
  /*width: 60%;;*/
}

#date-container {
  margin-bottom: 30px;
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
