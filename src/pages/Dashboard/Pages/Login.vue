<template>
  <auth-layout pageClass="login-page">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-lg-4 col-md-6 col-sm-8">
          <!--You can specify transitions on initial render. The `card-hidden` class will be present initially and then it will be removed-->
          <fade-render-transition>
            <card>
              <div slot="header">
                <h3 class="card-title text-center">Login: {{ userEmail }}</h3>
              </div>
              <div>
                <fg-input label="Email address"
                          placeholder="Enter email"
                          type="email"
                          v-model="model.email">

                </fg-input>
                <fg-input label="passsword"
                          type="password"
                          placeholder="Password"
                          v-model="model.password">
                </fg-input>
              </div>
              <div class="text-center">
                <button @click="signIn" class="btn btn-fill btn-warning btn-wd">Login</button>
                <button @click="signOut" class="btn btn-fill btn-warning btn-wd">Logout</button>
                <button @click="currUser" class="btn btn-fill btn-warning btn-wd">User</button>
                <br>
                <div class="forgot">
                  <router-link to="/register" class="card-category">
                    Forgot your password?
                  </router-link>
                </div>
              </div>
            </card>
          </fade-render-transition>
      </div>
    </div>
  </auth-layout>
</template>
<script>
  import { Checkbox as LCheckbox, FadeRenderTransition } from 'src/components/index'
  import AuthLayout from './AuthLayout.vue'
  import { auth } from 'src/util/firebase'
  export default {
    components: {
      LCheckbox,
      FadeRenderTransition,
      AuthLayout
    },
    data () {
      return {
        userEmail: '',
        model: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      signIn () {
        auth.signInWithEmailAndPassword(this.model.email, this.model.password)
        .then(
          function(user) {
            setTimeout(function() {
                console.log('logged in')
                this.model.email = ''
                this.model.password = ''
            }, 7000);
          },
          function(err) {
            setTimeout(function() {
              console.log(err)
            }, 7000);  
          }
        )
      },
      signOut () {
        auth.signOut().then(function() {
          console.log('Signed Out')
        }, function(error) {
          console.error('Sign Out Error', error)
        })
      },
      currUser () {
        var _this = this
        auth.onAuthStateChanged(function(user) {
          if (user) {
            console.log('logged in')
            _this.userEmail = auth.currentUser.email
          } else {
            console.log('logged out')
          }
        })
      },
      toggleNavbar () {
        document.body.classList.toggle('nav-open')
      },
      closeMenu () {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      }
    },
    beforeDestroy () {
      this.closeMenu()
    }
  }
</script>
<style>
  .navbar-nav .nav-item p{
    line-height: inherit;
    margin-left: 5px;
  }
</style>
