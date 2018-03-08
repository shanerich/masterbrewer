<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <div class="copyright">
        &copy; {{ currentYear }} MasterBrewer. All Rights Reserved.
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    data() {
      return {
        currentYear: new Date().getFullYear()
      }
    }
  }

</script>
<style>
.copyright {
  width: 100%;
  text-align: right;
}
</style>
