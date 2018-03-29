<template>
  <auth-layout pageClass="login-page">
    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-lg-4 col-md-6 col-sm-8">
          <!--You can specify transitions on initial render. The `card-hidden` class will be present initially and then it will be removed-->
          <fade-render-transition>
            <card>
              <div slot="header">
                <h3 class="card-title text-center">Login</h3>
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
                <button @click="signIn" class="btn btn-fill btn-warning btn-wd">Admin Login</button>
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
        model: {
          email: '',
          password: ''
        }
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      signIn () {
        this.$store.dispatch('signIn', {email: this.model.email, password: this.model.password})
      },
      signOut () {
        this.$store.dispatch('signOut')
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
