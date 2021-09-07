<template>

  <div id="create-event-outer-container">

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

    <el-header id="card-header" style="font-size: 40px; margin-top: 30px">Create Event</el-header>

    <div class="create-event-container">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="register-form">
        <el-form-item label="Title" prop="title" class="title-styling">
          <el-input
              type="textarea"
              placeholder="Title..."
              v-model="ruleForm.title"
              maxlength="128"
              show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="Categories" prop="categories" class="title-styling">

              <el-checkbox v-model="ruleForm.category1">Outdoors & Adventure</el-checkbox>
              <el-checkbox v-model="ruleForm.category2">Tech</el-checkbox>
              <el-checkbox v-model="ruleForm.category3">Family</el-checkbox>
              <el-checkbox v-model="ruleForm.category4">Health & Wellness</el-checkbox>
              <el-checkbox v-model="ruleForm.category5">Sports & Fitness</el-checkbox>
              <el-checkbox v-model="ruleForm.category6">Learning</el-checkbox>
              <el-checkbox v-model="ruleForm.category7">Photography</el-checkbox>
              <el-checkbox v-model="ruleForm.category8">Food & Drink</el-checkbox>
              <el-checkbox v-model="ruleForm.category9">Writing</el-checkbox>
              <el-checkbox v-model="ruleForm.category10">Language & Culture</el-checkbox>
              <el-checkbox v-model="ruleForm.category11">Music</el-checkbox>
              <el-checkbox v-model="ruleForm.category12">Movements</el-checkbox>
              <el-checkbox v-model="ruleForm.category13">LGBTQ</el-checkbox>
              <el-checkbox v-model="ruleForm.category14">Film</el-checkbox>
              <el-checkbox v-model="ruleForm.category15">Sci-Fi & Games</el-checkbox>
              <el-checkbox v-model="ruleForm.category16">Beliefs</el-checkbox>
              <el-checkbox v-model="ruleForm.category17">Arts</el-checkbox>
              <el-checkbox v-model="ruleForm.category18">Book Clubs</el-checkbox>
              <el-checkbox v-model="ruleForm.category19">Dance</el-checkbox>
              <el-checkbox v-model="ruleForm.category20">Pets</el-checkbox>
              <el-checkbox v-model="ruleForm.category21">Hobbies & Crafts</el-checkbox>
              <el-checkbox v-model="ruleForm.category22">Fashion & Beauty</el-checkbox>
              <el-checkbox v-model="ruleForm.category23">Social</el-checkbox>
              <el-checkbox v-model="ruleForm.category24">Career & Business</el-checkbox>

        </el-form-item>
        <el-form-item label="Date and Time" prop="date" class="title-styling">
          <el-date-picker
              v-model="ruleForm.date"
              type="datetime"
              placeholder="Select date and time"
              format="YYYY-MM-DD HH:mm:ss">
          </el-date-picker>
        </el-form-item>

<!--        format="D MMM YYYY h:mm a">-->


        <el-form-item label="Description" prop="description" class="title-styling">
          <div style="margin: 20px 0;"></div>
          <el-input
              type="textarea"
              placeholder="Description..."
              v-model="ruleForm.description"
              maxlength="2048"
              show-word-limit
          >
          </el-input>
        </el-form-item>

        <el-form-item label="Maximum Capacity" prop="maxCapacity" class="title-styling">
          <el-checkbox v-model="capacityNotApplicable">Not Applicable</el-checkbox>
          <div v-if="capacityNotApplicable">
            <el-input-number disabled v-model="ruleForm.maxCapacity" controls-position="right" :min="1" :max="1000000"></el-input-number>
          </div>
          <div v-else>
            <el-input-number v-model="ruleForm.maxCapacity" controls-position="right" :min="0" :max="1000000"></el-input-number>
          </div>
        </el-form-item>

        <el-form-item label="Online" prop="isOnline" class="title-styling">
          <el-radio v-model="ruleForm.isOnline" label="true">Online</el-radio>
          <el-radio v-model="ruleForm.isOnline" label="false">In Person</el-radio>
        </el-form-item>

        <el-form-item label="URL" prop="url" class="title-styling">
          <el-input
              type="textarea"
              placeholder="URL..."
              v-model="ruleForm.url"
              maxlength="128"
              show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="Venue" prop="venue" class="title-styling">
          <el-input
              type="textarea"
              placeholder="Venue..."
              v-model="ruleForm.venue"
              maxlength="512"
              show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="Is attendance control required?" prop="requiresAttendanceControl" class="title-styling">
          <el-radio v-model="ruleForm.requiresAttendanceControl" label="true">Yes</el-radio>
          <el-radio v-model="ruleForm.requiresAttendanceControl" label="false">No</el-radio>
        </el-form-item>

        <el-form-item label="Fee $" prop="fee" class="title-styling">
          <el-input-number v-model="ruleForm.fee" controls-position="right" :min="0" :max="1000000" :precision="2"></el-input-number>
        </el-form-item>

        <input type="file"
               accept="image/png, image/gif, image/jpeg, image/jpg"
               @change="processImage($event)"  class="title-styling"/>

        <el-form-item>
          <el-button class="link-button" @click="toEvents">Back To Events</el-button>
          <el-button class="link-button" @click="createEvent()">Create Event</el-button>
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";
import {format} from "date-fns";
import {isLoggedIn} from "./authUtils";

export default {
  name: "CreateEvent",
  data() {
    return {

      logoImage: "../logo.png",
      capacityNotApplicable: false,

      isValid: true,
      categories: [],

      titleErrorMsg: "Event title must be at least 1 character.",
      categoriesErrorMsg: "At least one category must be selected.",
      dateErrorMsg: "",
      imageErrorMsg: "Event image must be either a JPEG, PNG or GIF.",
      descriptionErrorMsg: "Event description must be at least 1 character.",
      capacityErrorMsg: "Event capacity is either not applicable or needs to be at least 1.",
      isOnlineErrorMsg: "",
      urlErrorMsg: "",
      attendanceControlErrorMsg: "Please specify if attendance control is required.",
      feeErrorMsg: "Please specify if the event is free ($0) or has a fee.",
      venueErrorMsg: "",

      isTitleValid: true,
      areCategoriesValid: true,
      isDateValid: true,
      isImageValid: true,
      isDescriptionValid: true,
      isCapacityValid: true,
      isIsOnlineValid: true,
      isURLValid: true,
      isVenueValid: true,
      isAttendanceControlValid: true,
      isFeeValid: true,

      eventImage: null,
      eventImageType: "",
      ISODate: null,

      canRouteToEvents: true,

      ruleForm: {
        title: '',
        date: '',
        description: '',
        maxCapacity: '',
        isOnline: null,
        url: '',
        venue: '',
        requiresAttendanceControl: '',
        fee: '',
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

      },
      rules: {
        title: [
          { required: true, message: 'Please provide event title', trigger: 'blur' }
        ],
        categories: [
          { required: true, message: 'Please provide at least one category', trigger: 'blur' }
        ],
        date: [
          { required: true, message: 'Please provide a date. It must be in the future', trigger: 'blur' },
        ],
        description: [
          { required: true, message: 'Please provide an event description', trigger: 'blur' }
        ],
        maxCapacity: [
          { required: true}
        ],
        isOnline: [
          { required: true, message: 'Please indicate whether the event is online or in-person', trigger: 'blur' }
        ],
        url: [
          { required: true, message: 'A URL is required for an online event, otherwise it is optional', trigger: 'blur' }
        ],
        venue: [
          { required: true, message: 'A venue is required for an in-person event, otherwise it is not required', trigger: 'blur' }
        ],
        requiresAttendanceControl: [
          { required: true, message: 'Please indicate if the event requires attendance control', trigger: 'blur' }
        ],
        fee: [
          { required: true, message: 'Please indicate if the event is free or has a fee', trigger: 'blur' }
        ]
      }
    };
  },

  onMounted() {
    if (isLoggedIn()) {
      this.categories = [];
    } else {
      this.toEvents()
    }
  },

  methods: {

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },

    /**
     * Database wants format of "YYYY-MM-DD HH:mm:ss"
     */
    convertDateToDBFormat(dateToConvert) {
      return format(dateToConvert, "yyyy-MM-dd hh:mm:ss")
    },

    /**
     * Builds the data object for the create event POST request
     */
    buildCreateEventData() {
      // let data = {
      //   title: this.ruleForm.title,
      //   description: this.ruleForm.description,
      //   categoryIds: this.categories,
      //   date: this.convertDateToDBFormat(this.ruleForm.date),
      //   isOnline: this.getIsOnlineBoolean(),
      //   url: this.ruleForm.url,
      //   requiresAttendanceControl: this.getRequiresAttendanceControlBoolean(),
      //   fee: this.ruleForm.fee
      // }

      // if (!this.ruleForm.isOnline) {
      //   data.venue = this.ruleForm.venue
      // }

      // capacity: (!this.capacityNotApplicable) ? this.ruleForm.maxCapacity : null,

      // if (!this.capacityNotApplicable) {
      //   data.capacity = this.ruleForm.maxCapacity
      // }

      let data = {}

      // online and max cap provided
      if (this.ruleForm.isOnline && !this.capacityNotApplicable) {
        data = {
          "title": this.ruleForm.title,
          "description": this.ruleForm.description,
          "categoryIds": this.categories,
          "date": this.convertDateToDBFormat(this.ruleForm.date),
          "isOnline": this.getIsOnlineBoolean(),
          "url": this.ruleForm.url,
          "capacity": this.ruleForm.maxCapacity,
          "requiresAttendanceControl": this.getRequiresAttendanceControlBoolean(),
          "fee": this.ruleForm.fee
        }
      } else if (this.ruleForm.isOnline && this.capacityNotApplicable) {
        // online and NO max cap provided
        data = {
          "title": this.ruleForm.title,
          "description": this.ruleForm.description,
          "categoryIds": this.categories,
          "date": this.convertDateToDBFormat(this.ruleForm.date),
          "isOnline": this.getIsOnlineBoolean(),
          "url": this.ruleForm.url,
          "requiresAttendanceControl": this.getRequiresAttendanceControlBoolean(),
          "fee": this.ruleForm.fee
        }
      } else if (!this.ruleForm.isOnline && !this.capacityNotApplicable) {
        // in-person and max cap provided
        data = {
          "title": this.ruleForm.title,
          "description": this.ruleForm.description,
          "categoryIds": this.categories,
          "date": this.convertDateToDBFormat(this.ruleForm.date),
          "isOnline": this.getIsOnlineBoolean(),
          "url": this.ruleForm.url,
          "capacity": this.ruleForm.maxCapacity,
          "requiresAttendanceControl": this.getRequiresAttendanceControlBoolean(),
          "fee": this.ruleForm.fee,
          "venue": this.ruleForm.venue
        }
      } else if (this.ruleForm.isOnline && this.capacityNotApplicable) {
        // in-person and NO max cap provided
        data = {
          "title": this.ruleForm.title,
          "description": this.ruleForm.description,
          "categoryIds": this.categories,
          "date": this.convertDateToDBFormat(this.ruleForm.date),
          "isOnline": this.getIsOnlineBoolean(),
          "url": this.ruleForm.url,
          "requiresAttendanceControl": this.getRequiresAttendanceControlBoolean(),
          "fee": this.ruleForm.fee,
          "venue": this.ruleForm.venue
        }
      }

      return data;
    },

    /**
     * Delete the event with the given id from the database
     */
    deleteEvent(eventId) {
      axios.delete(`http://localhost:4941/api/v1/events/${eventId}`,
          {headers: {'X-Authorization': Cookies.get('authToken')}})
          .then(() => {
            console.log("event deleted")
          }, (err) => {
            this.displayErrorMessageUsingCode(err.response.status)
          });
    },

    /**
     * Upload the event image to the database using a PUT request
     * @param eventId, the event id of the event to add the image to
     */
    async putEventImage(eventId) {

      console.log(this.eventImage)
      console.log(this.eventImageType)

      await this.axios.put(`http://localhost:4941/api/v1/events/${eventId}/image`,
          this.eventImage,
          {headers: {"X-Authorization": Cookies.get('authToken'), 'Content-Type': this.eventImageType}})
          .then(() => {

            // TODO: maybe remove as not sure if this will even render in time before the user is rerouted
            this.$message({
              message: "Successful image upload",
              type: 'success',
              duration: 5000
            });

          }).catch((err) => {
            this.$message({
              message: err.response.statusText,
              type: 'error',
              duration: 5000
            });
            this.deleteEvent(eventId);       // delete event since problem with uploading image
            this.canRouteToEvents = false

          })
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
     * Create a valid event
     * User must be logged in
     * All data provided must be valid
     * Date is in the format "2012-04-23 18:25:43.511",
     */
    createEvent() {

      this.getSelectedCategories()
      this.validateEventDetails()

      console.log(this.ruleForm.date)
      console.log(typeof this.ruleForm.date)

      if (this.isValid) {
        const data = this.buildCreateEventData()

        console.log(data)

        this.axios.post('http://localhost:4941/api/v1/events', data, {headers: {"X-Authorization": Cookies.get('authToken')}})
            .then((response) => {
              const eventId = response.data.eventId;

              console.log(eventId)
              console.log(this.eventImage)
              console.log(this.eventImageType)

              if (this.eventImage !== null) {
                this.putEventImage(eventId);
              }

              console.log(this.canRouteToEvents)

              this.$message({
                message: "Event successfully created",
                type: 'success',
                duration: 5000
              });
              console.log("me")
              // // this.$router.push(`/events/${eventId}`); // TODO: consider using but pgn does not load automatically, need to refresh
              this.$router.push(`/events`);

            }).catch((err) => {
                this.displayErrorMessageUsingCode(err.response.status)
        })
      } else {
        this.error = this.buildErrorMessage()
        this.$message({
          message: this.error,
          type: 'error',
          duration: 10000
        });
      }
    },

    /**
     * Reset the form
     * @param formName
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**
     * Determine the boolean value of isOnline
     */
    getIsOnlineBoolean() {
      return (this.ruleForm.isOnline === "true")
    },

    /**
     * Determine the boolean value of requiresAttendanceControl
     */
    getRequiresAttendanceControlBoolean() {
      return (this.ruleForm.requiresAttendanceControl === "true")
    },

    /**
     * Checks which categories have been selected by the user and puts these in a list, "categories".
     * Deletes categories that have been unchecked
     * Add categories that have been checked
     */
    getSelectedCategories() {
      const categoryElements = [this.ruleForm.category1, this.ruleForm.category2, this.ruleForm.category3, this.ruleForm.category4,
        this.ruleForm.category5, this.ruleForm.category6, this.ruleForm.category7, this.ruleForm.category8,
        this.ruleForm.category9, this.ruleForm.category10, this.ruleForm.category11,this.ruleForm.category12,
        this.ruleForm.category13, this.ruleForm.category14, this.ruleForm.category15, this.ruleForm.category16,
        this.ruleForm.category17, this.ruleForm.category18, this.ruleForm.category19, this.ruleForm.category20,
        this.ruleForm.category21, this.ruleForm.category22, this.ruleForm.category23, this.ruleForm.category24
      ];
      for (let i = 0; i < categoryElements.length; i++) {
        if (this.categories.includes(i + 1) && categoryElements[i] === false) {
          const index = this.categories.indexOf(i + 1);
          if (index > -1) {
            this.categories.splice(index, 1);
          }
        }
        if (categoryElements[i] && !this.categories.includes(i + 1)) {
          this.categories.push(i + 1)
        }
      }
    },

    /**
     * Process the image; gets the image and the file type
     */
    processImage(eventGiven) {
      this.eventImage = eventGiven.target.files[0];
      this.eventImageType = eventGiven.target.files[0].type;
    },

    /**
     * Converts the date to an ISO string
     */
    convertDateToISOStr() {
      this.ISODate = this.ruleForm.date.toISOString();
    },

    // TODO: put into a separate JS file
    /**
     * Validate the event details for the event that is wanting to be created.
     */
    validateEventDetails() {

      // title validation
      if (this.ruleForm.title.length >= 1) {
        this.isTitleValid = true;
      } else {
        this.isTitleValid = false;
        this.isValid = false
      }

      // categories validation
      if (this.categories.length > 0) {
        this.areCategoriesValid = true;
      } else {
        this.areCategoriesValid = false;
        this.isValid = false;
      }

      // date validation
      if (this.ruleForm.date === null) {
        this.dateErrorMsg = "Event date must be provided.\n"
        this.isDateValid = false;
        this.isValid = false;
      } else if (this.ruleForm.date.toString().length === 0) {
        this.dateErrorMsg = "Event date must be provided.\n"
        this.isDateValid = false;
        this.isValid = false;
      } else {
        this.convertDateToISOStr()
        if (new Date() < new Date(this.ISODate)) {
          this.isDateValid = true;
        } else {
          this.dateErrorMsg = "Event date must in the future.\n"
          this.isDateValid = false;
          this.isValid = false;
        }
      }

      // image type validation if image provided
      if (this.eventImage !== null) {
        if (!this.checkIfImageValid(this.eventImageType)) {
          this.isImageValid = false;
          this.isValid = false;
        }
      }

      // description validation
      if (this.ruleForm.description.length >= 1) {
        this.isDescriptionValid = true;
      } else {
        this.isDescriptionValid = false;
        this.isValid = false;
      }

      // capacity validation
      // if applicable, then need to check capacity
      if (!this.capacityNotApplicable && this.ruleForm.maxCapacity < 1) {
        this.isCapacityValid = false;
        this.isValid = false;
      }

      // check if is online or in person is selected
      if (this.ruleForm.isOnline === "true" || this.ruleForm.isOnline === "false") {

        // if online, must have URL and no venue
        if (this.getIsOnlineBoolean()) {

          if (this.ruleForm.url.length === 0) {
            this.isURLValid = false;
            this.urlErrorMsg = "Please specify a URL for an online event. ";
            this.isValid = false;
          }
          if (this.ruleForm.venue.length !== 0) {
            this.isVenueValid = false;
            this.venueErrorMsg = "An online event does not have a venue - please remove this. ";
            this.isValid = false;
          }
        } else {
          // if in person, must have venue, don't care about if URL present or not
          if (this.ruleForm.venue.length === 0) {
            this.isVenueValid = false;
            this.venueErrorMsg = "Please specify a venue for an in-person event. ";
            this.isValid = false;
          }
        }

      } else {
        this.isOnlineErrorMsg = "Please specify if the event is online or in-person. "
        this.isIsOnlineValid = false;
        this.isValid = false;
      }

      if (this.ruleForm.requiresAttendanceControl === "") {
        this.isAttendanceControlValid = false;
        this.isValid = false;
      }

      if (this.ruleForm.fee >= 0) {
        this.isFeeValid = true;
      } else {
        this.isFeeValid = false;
        this.isValid = false;
      }
    },

    /**
     * Resets the validation flags
     */
    resetValidationFlags() {
      this.isTitleValid = true;
      this.areCategoriesValid = true;
      this.isDateValid = true;
      this.isImageValid = true;
      this.isDescriptionValid = true;
      this.isCapacityValid = true;
      this.isIsOnlineValid = true;
      this.isURLValid = true;
      this.isVenueValid = true;
      this.isAttendanceControlValid = true;
      this.isFeeValid = true;
      this.isValid = true;
    },

    /**
     * Build the error message for the user based on the validation
     */
    buildErrorMessage() {
      let errorMsg = "";

      if (this.isTitleValid === false) {
        errorMsg += ` ${this.titleErrorMsg}`;
      }
      if (this.areCategoriesValid === false) {
        errorMsg += ` ${this.categoriesErrorMsg}`;
      }
      if (this.isDateValid === false) {
        errorMsg += ` ${this.dateErrorMsg}`;
      }

      if (this.isDescriptionValid === false) {
        errorMsg += ` ${this.descriptionErrorMsg}`;
      }

      if (this.isCapacityValid === false) {
        errorMsg += ` ${this.capacityErrorMsg}`;
      }

      if (this.isIsOnlineValid === false) {
        errorMsg += ` ${this.isOnlineErrorMsg}`;
      }

      if (this.isURLValid === false) {
        errorMsg += ` ${this.urlErrorMsg}`;
      }

      if (this.isVenueValid === false) {
        errorMsg += ` ${this.venueErrorMsg}`;
      }

      if (this.isAttendanceControlValid === false) {
        errorMsg += `${this.attendanceControlErrorMsg}`;
      }

      if (this.isFeeValid === false) {
        errorMsg += `${this.feeErrorMsg}`;
      }

      if (!this.isImageValid) {
        errorMsg += ` ${this.imageErrorMsg}`;
      }

      this.resetValidationFlags()
      console.log(errorMsg)

      return errorMsg;
    },

    /**
     * Checks the type of the image and sees if it is a JPEG, PNG or GIF
     * Returns true if is one of these types, otherwise false
     */
    checkIfImageValid() {
      return (this.eventImageType === "image/jpeg" || this.eventImageType === "image/png" || this.eventImageType === "image/gif")
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

.create-event-container {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-top: 20%;
  margin-padding: 20%;
  border-radius: 25px;
  padding: 60px 60px 60px 60px;
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
/*  line-height: 100px;*/
/*  width: 300px;*/
/*}*/

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

.title-styling {
  font-weight: bold;
}

</style>
