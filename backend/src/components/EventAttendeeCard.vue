<template>
  <div id="card">
    <div class="row no-gutters">

      <div>
        <el-container id="card-content">

          <!--image-->
          <div id="card-img" class="col">
            <div class="ratio ratio-1x1">
              <img class="card-img" :src="attendeeImage" id="attendee-image" width="20px">
<!--              <el-image id="event-image"-->
<!--                        :src="attendeeImage"></el-image>-->
            </div>
          </div>

          <el-row class="col">
            <el-col>
              <span class="card-name title-styling att-text">{{ firstName }} {{ lastName }}</span>
            </el-col>
            <el-col>
              <span class="card-role title-styling att-text">Role: </span><span class="att-text"> {{ role }}</span>
            </el-col>
          </el-row>

        </el-container>
      </div>

    </div>
  </div>

</template>

<!--      <div class="col"> -->
<!--        <div class="card-body px-3 py-3">-->

<!--          <el-container>-->

<!--            <el-aside width="400px">-->
<!--              &lt;!&ndash;image&ndash;&gt;-->
<!--              <div id="card-img" class="col">-->
<!--                <div class="ratio ratio-1x1">-->
<!--                  <el-image id="user-image"-->
<!--                            :src="userImage"></el-image>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-aside>-->

<!--            <el-main>-->
<!--              &lt;!&ndash;User info&ndash;&gt;-->
<!--              <h3 class="card-name">{{ firstName }} {{ lastName }}</h3>-->
<!--              <h3 class="card-role">Role: {{ role }}</h3>-->
<!--            </el-main>-->

<!--            <el-aside>-->
<!--              <div id="buttons">-->
<!--                <router-link class="link-button" :to="{name: 'event', params: {eventId: eventId, categoryNames: categoryNames}}">View Event Details</router-link>-->
<!--              </div>-->
<!--            </el-aside>-->

<!--          </el-container>-->

<!--        </div>-->
<!--      </div>-->

<!--    </div>-->

<!--  </div>-->



<script>

import defaultImage from "../../public/default-profile-image.png";

export default {
  name: "EventAttendeeCard",
  props: {
    userIdVal: {
      type: String,
      default: "",
      required: true
    },
    firstName: {
      type: String,
      default: "",
      required: true
    },
    lastName: {
      type: String,
      default: "",
      required: true
    },
    role: {
      type: String,
      default: "",
      required: true
    },
    attendeeImage: {
      type: String,
      default: defaultImage,
      required: false
    },
  },
  mounted() {
    console.log(this.attendeeImage)
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

/*img {*/
/*  object-fit: cover;*/
/*  width: 20%;*/
/*}*/

#attendee-image {
  width: 50px;
  border-radius: 50px;
  margin-right: 20px;
}

#lineBreak {
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
}

h6 {
  margin: 0;
}

.el-container {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 25px;
  /*max-height: 180px;*/
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

h3 {
  font-weight: normal;
  font-size: 14px;
}

#buttons {
  padding: 0;
  margin: 0;
}

#card {
  margin: 40px;
}

#card-content {
  padding: 20px;
}

.title-styling {
  font-weight: bold;
}
.att-text {
  font-size: 16px;
}
</style>
