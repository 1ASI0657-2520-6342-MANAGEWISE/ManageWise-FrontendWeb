<script>
import PostListHome from "@/components/home/post-list-home.component.vue";
import { PostApiService } from "@/services/post.service.js";
import PostEntity from "@/models/post.entity.js";

export default {
  name: "home-content",
  components: { PostListHome },
  data() {
    return {
      posts: [],
      hasError: false,
      hasLoading: false,
      errorMsg: "",
      postApi: new PostApiService(),
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser && newUser.companyId) {
          this.fetchNewPosts();
        }
      }
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    },

    buildPostListFromResponseData(payload) {
      console.log("Building post list from response data", payload);

      const list = Array.isArray(payload)
          ? payload
          : (payload?.data ?? []);

      if (!Array.isArray(list)) return [];

      return list.map((item) => {
        const dateToUse = item.postTime || item.createdAt || new Date().toISOString();
        const formattedDate = this.formatDate(dateToUse);

        return new PostEntity(
            item.id,
            item.title,
            item.subject,
            item.description,
            item.email,
            item.userId,
            item.userName,
            item.userImage,
            item.companyId,
            formattedDate,
            item.rating ?? 0,
            Array.isArray(item.images) ? item.images : [],
            Array.isArray(item.commentsList) ? item.commentsList : []
        );
      });
    },

    async fetchNewPosts() {
      if (!this.user?.companyId) return;

      try {
        this.hasLoading = true;
        this.hasError = false;

        const items = await this.postApi.getAllPostsByCompanyId(this.user.companyId, 5);

        this.posts = this.buildPostListFromResponseData(items);
        console.log("posts acquired:", this.posts.length);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          console.log("No posts found (404).");
          this.posts = []; // Lista vacía
          this.hasError = false; // No mostramos error
        } else {
          this.hasError = true;
          this.errorMsg = e?.response?.data?.title || "Error cargando publicaciones";
          console.error("No se pudieron obtener posts", e?.response?.data || e);
          this.posts = [];
        }
      } finally {
        this.hasLoading = false;
      }
    },
  },
};
</script>

<template>
  <section class="flex h-full flex-column lg:pb-5 p-4 lg:p-5">
    <div class="flex home-hero-container border-round-xl">
      <img class="home-hero-image border-round-xl" src="../../assets/home-hero.png"/>
    </div>
    <h2 class="home-title text-xl font-normal my-4">New posts:</h2>

    <div v-if="hasLoading" class="flex justify-content-center p-5">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
    </div>

    <p v-else-if="hasError" class="error-text">{{ errorMsg }}</p>

    <!-- Caso 1: Hay posts -->
    <post-list-home v-else-if="posts.length > 0" :posts="posts"></post-list-home>

    <!-- Caso 2: No hay posts -->
    <div v-else class="empty-state flex flex-column align-items-center justify-content-center gap-3 mt-3 p-5 border-round-xl surface-50">
      <div class="icon-circle bg-white p-3 border-round-circle shadow-1">
        <i class="pi pi-inbox text-4xl text-gray-400"></i>
      </div>
      <div class="text-center">
        <h3 class="text-xl font-medium text-gray-600 m-0">No posts yet</h3>
        <p class="text-gray-500 mt-2 text-sm">It seems there are no publications for your company yet.</p>
      </div>
    </div>

  </section>
</template>

<style scoped>
section {
  background-color: #FFF;
}

.home-title {
  font-family: 'Poppins', serif;
  font-weight: 500 !important;
}

.home-hero-container {
  position: relative;
}

.home-hero-container::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
  border-radius: 15px;
}

.home-hero-image {
  width: 100%;
  height: 18rem;
  object-fit: cover;
}

.error-text {
  color: #e11d48;
  font-weight: 500;
}

.empty-state {
  border: 2px dashed #e5e7eb;
  min-height: 200px;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}
</style>