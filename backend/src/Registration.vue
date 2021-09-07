<template>

  <div id="registration">

    <div id="nav-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
<!--        <el-menu-item>-->
<!--          <el-image id="logo-image"-->
<!--                    :src="logoImage" alt="logo"></el-image>-->
<!--        </el-menu-item>-->
        <el-menu-item class="nav-bar-item" index="1" @click="toEvents">Events</el-menu-item>
        <el-menu-item class="nav-bar-item" index="2" @click="toMyEvents">My Events</el-menu-item>
        <el-menu-item class="nav-bar-item" index="3" @click="toProfile">Profile</el-menu-item>
        <el-menu-item class="nav-bar-item" index="4" @click="toLogin">Login</el-menu-item>
        <el-menu-item class="nav-bar-item" index="5" @click="logOut">Logout</el-menu-item>
      </el-menu>
      <div class="line"></div>
    </div>

    <el-header id="card-header" style="font-size: 40px; margin-top: 30px">Register User</el-header>

    <div class="register-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="register-form">
        <el-form-item label="First Name" prop="firstName" class="title-styling">
          <el-input v-model="ruleForm.firstName" placeholder="First name..."></el-input>
        </el-form-item>
        <el-form-item label="Last Name" prop="lastName" class="title-styling">
          <el-input v-model="ruleForm.lastName" placeholder="Last name..."></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email" class="title-styling">
          <el-input v-model="ruleForm.email" placeholder="Email..."></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password" class="title-styling">
          <el-input v-model="ruleForm.password" show-password placeholder="Password..."></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword" class="title-styling">
          <el-input v-model="ruleForm.confirmPassword" show-password placeholder="Confirm password..."></el-input>
        </el-form-item>
        <el-form-item label="Profile Image" prop="image" class="title-styling">
          <input type="file"
                 accept="image/jpeg, image/png, image/gif"
                 ref="userImageFile"
                 @change="processImage($event)"
          >
        </el-form-item>

        <el-form-item>
          <el-button class="link-button" @click="toLogin">Back To Login</el-button>
          <el-button class="link-button" @click="registerUser('ruleForm')">Confirm</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import {isLoggedIn} from './authUtils'
import Cookies from "js-cookie";
import axios from "axios";

export default {
  name: "Registration",
  data() {
    return {
      logoImage: "../logo.png",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmedPassword: "",
      userImage: null,
      userImageType: "",

      isFirstNameValid: true,
      isLastNameValid: true,
      isEmailSyntaxValid: true,
      isPasswordValid: true,
      isConfirmedPasswordValid: true,
      isImageValid: true,
      isEmailInUse: true,
      isValid: true,

      firstNameErrorMsg: "First name must be at least 1 character in length.",
      lastNameErrorMsg: "Last name must be at least 1 character in length.",
      emailErrorMsg: "Email must contain @.",
      passwordErrorMsg: "Password must be at least 8 characters in length.",
      confirmPasswordErrorMsg: "Password and confirmed password must match.",
      imageErrorMsg: "Image type must be PNG, JPEG or GIF only.",
      emailInUseMsg: "Email is already in use.",

      ruleForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: ''
      },
      rules: {
        firstName: [
          { required: true, message: 'Please provide first name', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: 'Please provide last name', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please provide email', trigger: 'blur' }, // TODO: check matches regex
        ],
        password: [
          { required: true, message: 'Please provide password', trigger: 'blur' },
          { min: 8, message: 'Length should be at least 8', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Please confirm password', trigger: 'blur' } // TODO: check matches password
        ],
        image: [
          { type: 'image', required: false}
        ]
      }
    };
  },
  mounted() {
    if (isLoggedIn()) {
      this.toEvents()
    }
  },
  methods: {

    /**
     * Process the image
     */
    processImage(eventGiven) {
      this.userImage = eventGiven.target.files[0];
      this.userImageType = eventGiven.target.files[0].type;
    },

    /**
     * Checks the type of the image and sees if it is a JPEG, PNG or GIF
     * Returns true if is one of these types, otherwise false
     */
    checkIfImageValid() {
      return (this.userImageType === "image/jpeg" || this.userImageType === "image/png" || this.userImageType === "image/gif")
    },

    /**
     * Register the user
     * @param formName
     */
    registerUser() {

      this.validateUserDetails();

      if (this.isValid) {
        this.axios.post('http://localhost:4941/api/v1/users/register', {
          "firstName": this.ruleForm.firstName,
          "lastName": this.ruleForm.lastName,
          "email": this.ruleForm.email,
          "password": this.ruleForm.password,
        }).then((response) => {

          const userId = response.data.userId;

          axios.post('http://localhost:4941/api/v1/users/login', {
            "email": this.ruleForm.email,
            "password": this.ruleForm.password
          }).then((response) => {
            Cookies.set('authToken', response.data.token);
            Cookies.set('userId', response.data.userId);

            console.log("login section")
            console.log(Cookies.get('authToken'))

            // Image exists
            if (this.userImage !== null) {
              this.axios.put(
                  `http://localhost:4941/api/v1/users/${userId}/image`,
                  this.userImage,
                  { headers: { 'X-Authorization': Cookies.get('authToken'), 'Content-Type': this.userImageType}}
              ).then(() => {
                //TODO: is this needed?
                console.log("image uploaded")
              }).catch((error) => {
                console.log(error)
              })
            }
            this.$router.push({name: 'events'});

          }).catch((err) => {
            this.error.value = err;
            this.errorFlag.value = true;
          })
        }).catch((err) => {
          if (err.response.status === 400) {
            // TODO: display message
            this.emailInUseMsg = "Email is already in use."
            // this.error = this.emailInUseMsg;
            this.$message({
              message: this.emailInUseMsg,
              type: 'error'
            });
          }
        })
        // invalid form data
      } else {
        this.error = this.buildErrorMessage()
        this.$message({
          message: this.error,
          type: 'error'
        });
      }
    },

    login() {
      axios.post('http://localhost:4941/api/v1/users/login', {
        "email": this.ruleForm.email,
        "password": this.ruleForm.password
      }).then((response) => {
        Cookies.set('authToken', response.data.token);
        Cookies.set('userId', response.data.userId);

        console.log("login section")
        console.log(Cookies.get('authToken'))

      }).catch((err) => {
        this.error.value = err;
        this.errorFlag.value = true;
      })
    },

    /**
     * Reset the form
     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**
     * Check the registration form for validity
     */
    validateUserDetails() {

      console.log("help")
      console.log(this.ruleForm.firstName.length < 1)

      if (this.ruleForm.firstName.length < 1) {
        this.isFirstNameValid = false;
        this.isValid = false;
      }

      console.log("last name")
      console.log(this.ruleForm.lastName.length)
      if (this.ruleForm.lastName.length < 1) {
        this.isLastNameValid = false;
        this.isValid = false;
        console.log(this.lastName.length)
      }

      // const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+$/

      const emailRegex = /\S+@\S+/


      console.log(this.ruleForm.email)
      console.log(this.ruleForm.password)
      console.log(this.ruleForm.confirmPassword)

      console.log("email")
      console.log(!emailRegex.test(this.ruleForm.email))

      if (!emailRegex.test(this.ruleForm.email)) {
        this.isEmailSyntaxValid = false;
        this.isValid = false;
      }

      console.log("isEmailSyntaxValid")
      console.log(this.isEmailSyntaxValid)

      console.log("password")
      console.log(this.ruleForm.password.length < 8)
      if (this.ruleForm.password.length < 8) {
        this.isPasswordValid = false;
        this.isValid = false;
      }
      if (this.ruleForm.password !== this.ruleForm.confirmPassword) {
        this.isConfirmedPasswordValid = false;
        this.isValid = false;
      }

      //TODO validate images
      // image type validation if image provided
      if (this.userImage !== null) {
        if (this.checkIfImageValid(this.userImageType)) {
          this.isImageValid = true;
        } else {
          this.isImageValid = false;
          this.isValid = false;
        }
      }

    },

    buildErrorMessage() {
      let errorMsg = "";

      console.log("lllllllllllllllllllllllllllll")
      console.log(this.isFirstNameValid === false)

      if (this.isFirstNameValid === false) {
        errorMsg += ` ${this.firstNameErrorMsg}`;
      }
      if (this.isLastNameValid === false) {
        errorMsg += ` ${this.lastNameErrorMsg}`;
      }
      if (this.isEmailSyntaxValid === false) {
        errorMsg += ` ${this.emailErrorMsg}`;
      }
      if (this.isPasswordValid  === false) {
        errorMsg += ` ${this.passwordErrorMsg}`;
      }
      if (this.isConfirmedPasswordValid === false) {
        errorMsg += ` ${this.confirmPasswordErrorMsg}`;
      }

      if (!this.isImageValid) {
        errorMsg += ` ${this.imageErrorMsg}`;
      }

      this.resetValidationFlags()
      return errorMsg;
    },

    /**
     * Resets the validation flags
     */
    resetValidationFlags() {
      this.isFirstNameValid = true;
      this.isLastNameValid = true;
      this.isEmailSyntaxValid = true;
      this.isPasswordValid = true;
      this.isConfirmedPasswordValid = true;
      this.isImageValid = true;
      this.isEmailInUse = true;
      this.isValid = true;
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
        message: "Please log in or register to access your events",
        type: 'error'
      });
    },

    /**
     * Prevent the user from accessing their profile as they are not logged in.
     */
    toProfile() {
      this.$message({
        message: "Please log in or register to access your profile",
        type: 'error'
      });
    },

    /**
     * Take the user to the login page
     */
    toLogin() {
      this.$router.push('/users/login');
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

  }
}
</script>

<style>

@import url('https://use.fontawesome.com/releases/v5.15.3/css/all.css');
@import url('https://fonts.googleapis.com/css2?family=Merriweather+Sans&family=Oswald:wght@500&family=Roboto&family=Rochester&display=swap');


/*TODO: add fonts to all pages*/
.text-font, p, h, label, textarea, select, button {
  font-family: 'Roboto', sans-serif;
}

.register-container {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-top: 4%;
  border-radius: 25px;
  padding: 20px 20px 20px 20px;
  width: 800px;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.title-styling {
  font-weight: bold;
}

</style>
