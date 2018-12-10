const userMixin = {
  computed: {
    user () {
      return this.$store.getters.user
    },
    userIsEditor () {
      return this.user ? this.user.isEditor : false
    }
  }
}

export default userMixin
