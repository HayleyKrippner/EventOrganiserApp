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
          <div class="col"></div>
          <h3 class="card-name">{{ firstName }} {{ lastName }}</h3>
          <p></p>
          <h3 class="card-role">Role: {{ role }}</h3>


        </el-container>
      </div>

    </div>
  </div>

</template>

<script>

import defaultImage from "../../public/default-profile-image.png";

export default {
  name: "AttendeeStatusCard",
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

</style>
