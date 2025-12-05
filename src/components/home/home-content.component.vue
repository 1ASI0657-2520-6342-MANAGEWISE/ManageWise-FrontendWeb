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
  // CORRECCIÓN 1: Quitamos created() porque dispara la petición demasiado rápido (cuando user es null)
  /*
  async created() {
    await this.fetchNewPosts();
  },
  */

  // CORRECCIÓN 2: Usamos watch para disparar la petición SOLO cuando tengamos datos del usuario
  watch: {
    user: {
      immediate: true, // Intenta ejecutar al inicio
      handler(newUser) {
        // Solo llamamos a la API si el usuario y el companyId existen
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
        // Manejamos PostTime o CreatedAt por si acaso
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
      // Guard de seguridad extra
      if (!this.user?.companyId) return;

      try {
        this.hasLoading = true;
        this.hasError = false;

        const items = await this.postApi.getAllPostsByCompanyId(this.user.companyId, 5);

        this.posts = this.buildPostListFromResponseData(items);
        console.log("posts acquired:", this.posts.length);
      } catch (e) {
        this.hasError = true;
        this.errorMsg = e?.response?.data?.title || "Error cargando publicaciones";
        console.error("No se pudieron obtener posts", e?.response?.data || e);
        this.posts = [];
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

    <p v-if="hasLoading">Cargando publicaciones…</p>
    <p v-else-if="hasError">{{ errorMsg }}</p>
    <post-list-home v-else :posts="posts"></post-list-home>
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
</style>