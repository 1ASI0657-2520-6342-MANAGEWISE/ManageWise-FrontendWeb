<script>
import image1 from "../../assets/post-comment-image-1.webp";
import image2 from "../../assets/post-comment-image-2.webp";
import image3 from "../../assets/post-comment-image-3.webp";
import image4 from "../../assets/post-comment-image-4.webp";
import image5 from "../../assets/post-comment-image-5.webp";
import image6 from "../../assets/post-comment-image-6.webp";
import image7 from "../../assets/post-comment-image-7.webp";
import image8 from "../../assets/post-comment-image-8.webp";
import image9 from "../../assets/post-comment-image-9.webp";
import image10 from "../../assets/post-comment-image-10.webp";

import {PostApiService} from "@/services/post.service.js";

export default {
  name: "post-card-home",
  props: ['post'],
  data() {
    return {
      hasRate: false,
      hasLiked: false,
      likeCount: this.post.rating || 0,
      postApi: new PostApiService(),
      images: [
        image1, image2, image3, image4, image5, image6, image7, image8, image9, image10
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    onClickLike() {
      if (this.hasLiked) return;
      this.hasLiked = true;
      this.likeCount++;
      this.postApi.updatePostRating(this.post.id, this.user.id)
      if(this.hasLiked) {
        this.hasLiked = true;
      }
    },
    generateRandomImagesForPosts() {
      let selectedImages = [];
      let randomNumbers = new Set();
      while (randomNumbers.size < 3) {
        let randomNumber = Math.floor(Math.random() * 10);
        randomNumbers.add(randomNumber);
      }
      for (let randomNumber of randomNumbers) {
        let image = this.images[randomNumber];
        selectedImages.push(image);
      }
      return selectedImages;
    }
  }
}
</script>

<template>
  <pv-card class="post-card shadow-4 w-full px-0 py-0">
    <template #header>
      <div class="header-row flex flex-row gap-4 justify-content-between flex-wrap align-items-center">
        <div class="flex flex-row gap-3 align-items-center">
          <pv-avatar aria-label="User Avatar"
                     class="profile-avatar"
                     :image="post.userImg || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'"
                     shape="circle"/>
          <div class="user-info flex flex-column justify-content-center">
            <span class="user-name font-semibold text-lg">{{ post.userName || 'Jhon Doe' }}</span>
            <span class="user-email text-green-700 text-sm">{{ post.email }}</span>
          </div>
        </div>
        <div class="align-self-center border-round-2xl like-container">
          <button class="like-btn" :class="{ liked: hasLiked }" @click="onClickLike" :disabled="hasLiked" aria-label="Like post">
            <i :class="['pi', hasLiked ? 'pi-heart-fill' : 'pi-heart', 'like-icon']"></i>
          </button>
          <span class="like-count">{{ likeCount }}</span>
        </div>
      </div>
    </template>
    <template #title>
      <h2 class="post-title mt-2 mb-1">{{ post.title }}</h2>
    </template>
    <template #subtitle>
      <div class="subtitle-row mb-2">
        <span class="subject-label">Subject:</span>
        <span class="subject-value">{{ post.subject }}</span>
      </div>
      <span class="greeting">Dear Hope Haven Team,</span>
    </template>
    <template #content>
      <div class="post-content mb-3">
        <p class="post-comment line-height-3">{{ post.description }}</p>
      </div>
      <div class="card-image-container ">
        <div class="images-post-container">
          <div v-for="image in generateRandomImagesForPosts()" :key="image" class="image-container">
            <img class="post-image" :src="image" alt=""/>
          </div>
        </div>
        <div class="date-container flex-1">
          <div class="flex align-items-center gap-2">
            <i class="text-xl pi pi-clock text-green-800"></i>
            <span class="date-label">{{ post.postTime }}</span>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
  <pv-dialog :style="{margin: '0 10px'}" :visible.sync="hasRate" :modal="true" :closable="false">
    <div class="rating-modal p-5 flex flex-column align-items-center gap-5 text-center">
      <i class="text-7xl pi pi-heart-fill text-pink-500 animate__animated animate__tada"></i>
      <h1 class="modal-title">Like Sent!</h1>
      <p class="modal-desc text-md">Your like for the post has been successfully recorded</p>
      <pv-button class="py-3 px-5 modal-btn" label="OK" @click="hasRate = false"/>
    </div>
  </pv-dialog>
</template>

<style scoped>
.post-card {
  background: linear-gradient(135deg, #f8fafc 80%, #e6f4f1 100%);
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(2,81,61,0.10);
  padding: 0 0 1.5rem 0;
  transition: box-shadow 0.2s;
}
.post-card:hover {
  box-shadow: 0 12px 40px 0 rgba(2,81,61,0.18);
}
.header-row {
  padding: 1.2rem 1.5rem 0.5rem 1.5rem;
}
.profile-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border: 2.5px solid #c7f5e7;
  box-shadow: 0 2px 8px 0 rgba(2,81,61,0.10);
}
.user-info {
  gap: 0.1rem;
}
.user-name {
  color: #02513D;
  font-family: 'Lora', serif;
}
.user-email {
  font-family: 'Lora', serif;
  color: #03795a;
  font-size: 0.98rem;
}
.like-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fce7ef;
  padding: 0.5rem 1.2rem;
  border-radius: 2rem;
  box-shadow: 0 2px 8px 0 rgba(255,0,80,0.07);
}
.like-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  transition: transform 0.15s;
}
.like-btn.liked .like-icon {
  color: #e11d48;
  animation: pop 0.3s;
}
.like-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.like-icon {
  font-size: 1.5rem;
  color: #4b5563;
  transition: color 0.2s;
}
.like-count {
  font-size: 1.1rem;
  font-weight: 600;
  margin-left: 0.2rem;
}
@keyframes pop {
  0% { transform: scale(1); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.post-title {
  font-family: 'Lora', serif;
  color: #02513D;
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0 1.5rem 0.2rem 1.5rem;
  letter-spacing: 0.5px;
}
.subtitle-row {
  margin: 0 1.5rem 0.2rem 1.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.subject-label {
  font-weight: 600;
  color: #03795a;
  font-size: 1rem;
}
.subject-value {
  color: #02513D;
  font-size: 1rem;
  font-weight: 500;
}
.greeting {
  margin-left: 1.5rem;
  color: #4b5563;
  font-size: 1.05rem;
  font-style: italic;
}
.post-content {
  margin: 0 1.5rem;
  font-size: 1.08rem;
  color: #222;
  letter-spacing: -.2px;
}
.card-image-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.5rem;
}
.images-post-container {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  flex-wrap: wrap;
}
.image-container {
  display: flex;
  flex-grow: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(2,81,61,0.10);
  transition: transform 0.18s;
}
.image-container:hover {
  transform: scale(1.04);
}
.post-image {
  flex-grow: 1;
  width: 220px;
  min-height: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  transition: box-shadow 0.18s;
}
.date-container {
  display: flex;
  align-items: end;
  justify-content: end;
  margin-top: 0.5rem;
}
.date-label {
  font-family: 'Lora', serif !important;
  font-weight: 500;
  color: #02513D;
  font-size: 1.05rem;
}
.rating-modal {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(2,81,61,0.18);
}
.modal-title {
  font-family: 'Lora', serif;
  color: #02513D;
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  letter-spacing: 0.5px;
}
.modal-desc {
  color: #4b5563;
  font-size: 1.1rem;
  margin-bottom: 0.7rem;
  font-weight: 400;
}
.modal-btn {
  background-color: #02513D !important;
  color: #fff !important;
  border-radius: 10px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  padding: 0.7rem 2.2rem !important;
  box-shadow: 0 2px 8px 0 rgba(2,81,61,0.10);
  transition: background 0.18s, box-shadow 0.18s;
}
.modal-btn:hover, .modal-btn:focus {
  background: #03795a !important;
  box-shadow: 0 4px 16px 0 rgba(2,81,61,0.13);
}
@media (min-width: 1660px) {
  .card-image-container {
    flex-direction: row;
  }
}
@media (max-width: 640px) {
  .header-row, .post-title, .subtitle-row, .greeting, .post-content, .card-image-container {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .card-image-container {
    flex-direction: column;
  }
  .post-image {
    width: 100%;
    height: 120px;
  }
}
</style>