<template>
  <div class="unauthorized-container">
    <h1>403 - Forbidden</h1>
    <p>You don't have permission to access this page.</p>
    <button @click="redirectToDashboard" class="return-btn">
      Return to Dashboard
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToDashboard() {
      const role = this.$store.state.auth.user?.role
      this.$router.push({ name: `${role}-dashboard` })
    }
  }
}
</script>