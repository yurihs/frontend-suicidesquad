const userMixin = {
  computed: {
    user () {
      return this.$store.getters.usuario
    },
    userIsPublicador () {
      return this.user && this.pet ? this.user.id === this.pet.usuario_id : false
    }
  }
}

export default userMixin
