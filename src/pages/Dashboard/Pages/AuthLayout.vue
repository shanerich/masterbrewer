<template>
  <div>
    <div class="wrapper wrapper-full-page">
      <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute">
        <div class="container">
          <div class="navbar-wrapper">
            <div class="logo">
              <a class="logo-mini"
                href="/">
                <div class="logo-img">
                    <img :src="logo" alt="Master Brewer MB logo">
                </div>
              </a>
              <a href="/" class="simple-text logo-normal">
                <img :src="title" alt="Master Brewer">
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div class="full-page" :data-color="backgroundColor" :class="pageClass">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple | black" -->
        <div class="content">
          <div class="container">
            <slot></slot>
          </div>
        </div>

        <footer class="footer footer-transparent">
          <div
            class="container d-flex flex-lg-row flex-column justify-content-lg-between justify-content-center align-items-center">
            <div class="copyright">
              &copy; 2018 MasterBrewer. All Rights Reserved.
            </div>
          </div>
        </footer>

        <div class="full-page-background"
             style="background-image: url(static/img/full-screen-image-1.jpg) "></div>
        </div>
    </div>
  </div>
</template>
<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

  export default {
    components: {
      [CollapseTransition.name]: CollapseTransition
    },
    props: {
      pageClass: {
        type: String,
        default: 'login-page'
      },
      backgroundColor: {
        type: String,
        default: 'black'
      },
      title: {
        type: String,
        default: 'static/img/master-brewer-logo-text-grad.png'
      },
      logo: {
        type: String,
        default: 'static/img/master-brewer-logo-white.png'
      },
    },
    data () {
      return {
        showMenu: false
      }
    },
    methods: {
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
  .logo-mini { display: inline-block; }
  .navbar-nav .nav-item p {
    line-height: inherit;
    margin-left: 5px;
  }
  .navbar-wrapper{
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  .wrapper-full-page .navbar-toggler,
  .wrapper-full-page .navbar-collapse .navbar-nav{
    margin-right: 30px;
  }
  .navbar-collapse .navbar-nav .nav-link {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .nav-item { min-width: 239px; }
</style>
