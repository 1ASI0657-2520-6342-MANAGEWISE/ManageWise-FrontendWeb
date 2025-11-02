<script>
import PostCardHome from "@/components/home/post-card-home.component.vue";

export default {
  name: "post-list-home",
  components: {PostCardHome},
  props: ['posts']
}
</script>

<template>
  <div class="card-container flex flex-column gap-5">
    <div v-for="post in posts" :key="post.id">
      <post-card-home :post="post"></post-card-home>
    </div>
  </div>
</template>

<style scoped>

</style>