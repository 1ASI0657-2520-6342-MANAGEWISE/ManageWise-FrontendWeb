<script>
// new-post-content.component.vue (solo el script)
import { PostApiService } from "@/services/post.service.js";

export default {
  name: "new-post-content",
  data() {
    return {
      hasCompleted: false,
      isFieldsEmpty: false,
      formPost: { title: "", subject: "", description: "", images: []},
      postApi: new PostApiService(),
      // files: [] // si luego agregas subida de archivos
    };
  },
  computed: {
    user() { return this.$store.state.user; }
  },
  methods: {
    async onSubmitPost() {
      if (!this.areFieldsFilled()) {
        this.isFieldsEmpty = true;
        return;
      }

      try {
        await this.postApi.createNewPost(this.user.id, this.user.companyId, this.formPost /*, this.files */);
        this.hasCompleted = true; // <-- ahora sí, solo tras éxito
        // opcional: limpiar formulario
        this.formPost = { title: "", subject: "", description: "" };
      } catch (e) {
        const data = e?.response?.data;
        const msg = data?.errors
            ? Object.entries(data.errors).map(([k, v]) => `${k}: ${v.join(" | ")}`).join("\n")
            : (data?.title || data?.message || "Error al crear post");
        console.error("Error creando post:", e?.response?.status, data || e);
        this.$toast?.add?.({ severity: "error", summary: "No se pudo publicar", detail: msg, life: 6000 });
      }
    },
    areFieldsFilled() {
      return Boolean(
          (this.formPost.title || "").trim() &&
          (this.formPost.subject || "").trim() &&
          (this.formPost.description || "").trim()
      );
    }
  }
};

</script>

<template>
  <section class="new-post-container relative flex flex-column p-4 lg:p-5">
    <h1 class="newpost-title text-4xl font-medium mb-3" v-t="'newpost.createpost'"></h1>
    <p class="text-sm text-gray-700" v-t="'newpost.norecentpublications'"></p>
    <div class="post-background h-full flex flex-1 align-items-center mt-5 sm:mt-3">
      <div class="post-container shadow-3 p-4 sm:p-5 flex flex-column gap-4">
        <h2 class="font-medium">Celebrating Team Success: Hope Heaven <br/>International Impact in Action</h2>
        <p class="text-base font-medium -mt-1" v-t="'newpost.dearhopeteam'"> </p>
        <form class="post-form flex flex-column mt-0" @submit.prevent="onSubmitPost()">
          <div class="flex flex-column gap-2">
            <label>Title</label>
            <input class="input-field border-round-md p-2 line-height-3"
                   placeholder="Celebrating Team Success: Hope Haven Impact in Action"
                   type="text" v-model="this.formPost.title">
          </div>
          <div class="flex flex-column gap-2">
            <label>Subject:</label>
            <input class="input-field border-round-md p-2 line-height-3"
                   placeholder="Celebrating Team Success: Hope Haven Impact in Action"
                   type="text" v-model="this.formPost.subject">
          </div>
          <div class="flex flex-column gap-2">
            <label>Description:</label>
            <textarea class="input-textarea border-round-md p-2 line-height-3"
                      placeholder="We are thrilled to share some exciting news and celebrate the collective efforts of our incredible team members! Together, we have achieved significant milestones..."
                      v-model="this.formPost.description"
            ></textarea>
          </div>
          <div class="flex flex-column gap-2">
            <label>Attach files:</label>
            <div class="input-field border-round-md border-1 py-2 flex align-items-center justify-content-between px-2">
              <p class="text-sm flex align-items-center gap-2"><i class="text-md pi pi-image text-black"></i> image1.png
              </p>
              <i class="text-md pi pi-paperclip text-black cursor-pointer"></i>
            </div>
          </div>
          <div class="post-button-container flex flex-column sm:flex-row  justify-content-center gap-3 mt-4">
            <button class="uppercase border-round-3xl border-none text-white py-3 px-6 font-medium" type="submit">
              Publish(23)
            </button>
            <button class="uppercase border-round-3xl border-1 py-3 px-6 font-medium">Edit Visibility</button>
          </div>
        </form>
      </div>
    </div>
  </section>
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="hasCompleted" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-check-circle text-green-700"></i>
      <h1>Publication Successful!</h1>
      <p class="text-md">Your post has been updated successfully.</p>
      <pv-button class="py-3 px-5" label="OK" @click="hasCompleted = false"/>
    </div>
  </pv-dialog>
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="isFieldsEmpty" :modal="true" :closable="false">
    <div class="error-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-times-circle text-red-500"></i>
      <h1>Fill the formulary!</h1>
      <p class="text-md">There is no information to register a user</p>
      <pv-button class="py-3 px-5" label="OK" @click="isFieldsEmpty = false"/>
    </div>
  </pv-dialog>
</template>

<style scoped>

.newpost-title {
  font-family: 'Lora', serif !important;
  font-weight: 600 !important;
  color: #FA8224;
}

.error-modal h1, p {
  font-family: "Poppins", serif !important;
}

.new-post-container {
  min-height: calc(100vh - 112px);
}

.post-form {
  gap: 18px;
}

.post-container {
  width: 750px;
  margin-inline: auto;
}

.post-container input, p, label, h1, h2 {
  font-family: "Lora", serif;
}

.post-container > h2 {
  color: #eca46cff;
}

.post-container input:focus, textarea:focus {
  background-color: #F7F7F7;
}

.input-field {
  border: 1px solid #BDBDBD;
  color: #0009;
}

.input-textarea {
  resize: none;
  border: 1px solid #BDBDBD;
  height: 100px;
}

.post-button-container > button[type="submit"] {
  background-color: #FA8224;
}

.post-button-container > button {
  cursor: pointer;
}

@media (max-width: 528px) {

  .input-textarea {
    height: 160px;
  }

}

</style>