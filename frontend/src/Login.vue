<template>

  <div id="login">

    <div id="nav-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
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

    <!--------------------------------------------------- login ------------------------------------------------------->
    <el-image id="logo-image"
              :src="logoImage" alt="logo" style="margin-top: 10px; margin-bottom: -20px"></el-image>
    <div id="login-title">
      <label style="font-size: 40px; margin-top: 30px">Login</label>
    </div>

    <!-- login form -->
    <el-form status-icon id="login-form" ref="loginForm" label-width="120px">

      <el-form-item label="Email" class="text-purple">
        <el-input v-model="email" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="Password" class="text-purple">
        <el-input v-model="password" show-password autocomplete="off"></el-input>
      </el-form-item>

    </el-form>

    <el-form-item id="login-form-btns">
      <el-button @click="toRegisterPage" class="link-button">Register</el-button>
      <el-button @click="login" class="link-button">Login</el-button>
    </el-form-item>

    <!------------------------ non-logged in user trying to access logged in access content --------------------------->
    <!--    TODO-->


  </div>

</template>

<script>

import Cookies from 'js-cookie'
import axios from 'axios'
import {isLoggedIn} from "./authUtils";

export default {
  name: "Login",

  data() {
    return {
      error: "",
      errorFlag: "",
      email: "",
      password: "",
      logoImage: "../logo.png",
    }
  },
  mounted() {
    if (isLoggedIn()) {
      this.toEvents()
    }
  },
  methods: {
    login() {
      axios.post('http://localhost:4941/api/v1/users/login', {
        "email": this.email,
        "password": this.password
      }).then((response) => {
        Cookies.set('authToken', response.data.token);
        Cookies.set('userId', response.data.userId);
        this.$router.push({name: 'events'});
      }).catch((err) => {
        this.error.value = err;
        this.errorFlag.value = true;
      })
    },

    /**
     * Take the user to the registration page.
     */
    toRegisterPage() {
      this.$router.push('/users/register');
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
        message: "Please log in to access your events",
        type: 'error'
      });
    },

    /**
     * Prevent the user from accessing their profile as they are not logged in.
     */
    toProfile() {
      this.$message({
        message: "Please log in to access your profile",
        type: 'error'
      });
    },

    /**
     * Prevent the user from accessing their events as they are not logged in.
     */
    toLogin() {
      this.$message({
        message: "You are already on the login page",
      });
    },

    /**
     * Prevent the user from accessing their events as they are not logged in.
     */
    logOut() {
      this.$message({
        message: "You cannot log out as you are not logged in",
        type: 'error'
      });
    }

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
#login-form {
  width: 60%;
  margin: auto;
}

#login-form-btns {
  margin: auto;
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

#login-title {
  margin: 2% 2% 2% 2%;
  font-size: 20px;
}

#logo-image {
  margin-right: 30%;
}

</style>