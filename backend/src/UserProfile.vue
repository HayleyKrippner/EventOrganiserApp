<template>

  <div id="user-profile">

    <div id="nav-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item>
          <el-image id="logo-image"
                    :src="logoImage"
                    alt="logo"></el-image>
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


    <el-card class="box-card">

      <el-container>
        <el-header id="card-header">{{ firstName }} {{ lastName }}</el-header>
        <el-divider></el-divider>
        <el-container>

          <el-aside width="200px">
            <el-image id="user-image"
                      :src="userImage"
                      style="border-radius: 20px"></el-image>
          </el-aside>

          <el-container>
            <el-main>

              <div>
                <span class="info-line title-styling">First Name: </span><span>{{firstName}}</span>
              </div>
              <div>
                <span class="info-line title-styling">Last Name: </span><span>{{lastName}}</span>
              </div>
              <div v-if="isAuthorized()">
                <span class="info-line title-styling">Email: </span><span>{{email}}</span>
              </div>
              <div v-else>
                <span class="info-line"></span>
              </div>

            </el-main>

            <el-footer>
              <div class="event-card-bottom" v-if="isAuthorized()">
                <el-button @click="openEditProfileModal" id="edit-profile-btn" class="link-button">Edit Profile</el-button>
              </div>
            </el-footer>

          </el-container>
        </el-container>
      </el-container>

    </el-card>

  </div>

</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import defaultImage from "../public/default-profile-image.png";
import {isLoggedIn, isUserOfUserProfile} from "./authUtils";

export default {
  name: "UserProfile",
  data() {
    return {
      logoImage: "../logo.png",
      activeIndex: '3',
      error: "",
      errorFlag: false,

      firstName: "",
      lastName: "",
      email: "",
      userImage: "",

      firstNameUpdated: "",
      lastNameUpdated: "",
      emailUpdated: "",
      userImageUpdated: "",
    }
  },

  /**
   *
   */
  mounted() {
    if (isLoggedIn() && isUserOfUserProfile(this.$route.params.userId)) {
      this.getUser(this.$route.params.userId)
      this.getUserImage(this.$route.params.userId)
    } else {
      this.toEvents()
    }
  },

  methods: {
    /**
     * Check if the user who is viewing the current profile is this user i.e. they are authenticated as the user of this
     * profile
     */
    isAuthorized() {
      return Cookies.get('userId') === this.$route.params.userId;
    },

    /**
     * Get image of given user
     */
    getUserImage(toGetUserId) {
      axios.get(`http://localhost:4941/api/v1/users/${toGetUserId}/image`, {}).then(() => {
        this.userImage = `http://localhost:4941/api/v1/users/${toGetUserId}/image`;
      }, () => {
        this.userImage = defaultImage
      });
    },

    /**
     * Get the given user's details
     */
    getUser(toGetUserId) {

      console.log(toGetUserId)

      axios.get(`http://localhost:4941/api/v1/users/${toGetUserId}`,
          {headers: {'X-Authorization' : Cookies.get('authToken')}}
          ).then((response) => {
        this.firstName = response.data.firstName
        this.lastName = response.data.lastName
        this.email = response.data.email

        console.log(response.data)

      }, (err) => {
        this.error = err;
        this.errorFlag = true;
      });

      console.log("email")
      console.log(this.email)
    },

    // TODO: test this
    /**
     * Generate the JSON request body for the user info updates the given user wants
     * @return editRequestBodyJson the JSON request body
     */
    getEditRequestBody() {

      let editRequest = {};

      if (this.firstNameUpdated !== "") {
        editRequest.firstName = this.firstNameUpdated
      }
      if (this.lastNameUpdated !== "") {
        editRequest.lastName = this.lastNameUpdated
      }
      if (this.emailUpdated !== "") {
        editRequest.email = this.emailUpdated
      }
      return JSON.stringify(editRequest);
    },

    // TODO: not sure if should be a modal or a page
    /**
     *
     */
    openEditProfileModal() {

    },

    // TODO: implement this
    /**
     * Edits the given user's details
     * Only the actual user can edit their info i.e have to be authenticated via their cookie.
     * @param toEditUserId the id of the user info to edit
     */
    editEvent(toEditUserId) {
      const editRequestBody = this.getEditRequestBody();
      axios.patch(`http://localhost:4941/api/v1/users/${toEditUserId}`,
          editRequestBody,
          {headers: {"X-Authorization":  Cookies.get('authToken')}})
          .then(() => {
            this.$router.push({path: `/events/${toEditUserId}`}) // reload page
          }, (err) => {
            this.error = err;
            this.errorFlag = true;
          });
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
        this.activeIndex = '3';
      }
    },

    /**
     * Take the user to their profile page
     */
    toProfile() {
      this.$message({
        message: "You are already on your profile page",
      });
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
        this.activeIndex = '3';
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
        this.activeIndex = '3';
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
  width: 480px;
  text-align: left;
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

.box-card {
  margin: 4% auto 10%  auto;
  width: 50%;
  padding: 30px;
}

.el-header, .el-footer {
  /*background-color: #B3C0D1;*/
  color: #333;
  text-align: center;
  line-height: 60px;
}

/*.el-aside {*/
/*  background-color: #D3DCE6;*/
/*  color: #333;*/
/*  text-align: center;*/
/*  line-height: 200px;*/
/*}*/

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: left;
  line-height: 60px;
  padding-left: 40px;
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

#user-image {
  border-radius: 50%;
}

.title-styling {
  font-weight: bold;
}

</style>