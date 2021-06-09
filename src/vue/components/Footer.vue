<template>
  <footer>
    <div class="container">
      <router-link class="logo-font" :to="{ name: 'home', params: {} }">
        conduit
      </router-link>
      <span class="attribution">
        An interactive learning project from
        <a rel="noopener noreferrer" target="blank" href="https://thinkster.io"
          >Thinkster</a
        >. Code &amp; design licensed under MIT.
      </span>
      <vue-cookie-accept-decline
        :ref="'cookie-policy'"
        :elementId="'cookie-policy-panel'"
        :debug="false"
        :position="'bottom-left'"
        :type="'bar'"
        :disableDecline="false"
        :transitionName="'slideFromBottom'"
        :showPostponeButton="false"
        :forceCookies="true"
        @status="cookieStatus"
        @clicked-accept="cookieClickedAccept"
        @clicked-decline="cookieClickedDecline">

        <!-- Optional -->
        <div slot="message">
            We use cookies to ensure you get the best experience on our website. <a href="https://cookiesandyou.com/" target="_blank">Learn More...</a>
        </div>

        <!-- Optional -->
        <div slot="declineContent">
          I decline!
        </div>

        <!-- Optional -->
        <div slot="acceptContent">
            I accept!
        </div>
    </vue-cookie-accept-decline>
    </div>
  </footer>
</template>

<script>
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'
export default {
  name: "Footer",
  components: { VueCookieAcceptDecline }
};
</script>
