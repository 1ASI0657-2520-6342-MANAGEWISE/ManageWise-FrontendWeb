<script>
import UserIcon from "@/assets/user-icon.svg";
import MessageIcon from "@/assets/message-icon.svg";
import TeamMembersService from "@/services/team-members.service.js";

export default {
  name: "team-content",
  components: {
    UserIcon,
    MessageIcon
  },
  data() {
    return {
      brandName: "",
      popUp: false,
      popUpDetail: "",
      userSelected: null,
      members: [],
      message: "",
      messageSent: true,
      roleUser: this.$store.state.user.role,
      userId: this.$store.state.user.id,
      teamMemberService: new TeamMembersService()
    };
  },
  async mounted() {
    await this.getTeamMembers();
  },
  methods: {
    async getTeamMembers() {
      try {
        const companyId = this.$store.state.user.companyId;
        const members = await this.teamMemberService.getMembers(companyId);

        console.log("members en componente", members);

        if (Array.isArray(members)) {
          this.members = members.filter(
              (m) => m.companyId === companyId
          );

          // nombre de la empresa (de cualquiera del array)
          if (this.members.length > 0 && this.members[0].companyName) {
            const name = this.members[0].companyName;
            this.brandName = name.charAt(0).toUpperCase() + name.slice(1);
          } else {
            this.brandName = "";
          }
        } else {
          this.members = [];
          this.brandName = "";
        }
      } catch (e) {
        console.error("Error en getTeamMembers()", e);
        this.members = [];
        this.brandName = "";
      }
    },

    togglePopUp(id, popUpDetail) {
      this.popUpDetail = popUpDetail;
      this.popUp = !this.popUp;
      this.userSelected = this.members.find((m) => m.id === id) || null;
      this.messageSent = true;
    },

    async sendMessage(idMember) {
      if (!this.message) {
        this.messageSent = false;
        return;
      }

      if (!this.userSelected) return;

      const body = {
        date: new Date(),
        message: this.message,
        userIdReceiver: Number(this.userSelected.id),
        userIdSender: this.$store.state.user.id
      };

      const result = await this.teamMemberService.newMessage(body);
      if (!result) {
        console.error("Failed to send message");
      } else {
        console.log("Message sent");
        window.alert("Message sent");
      }

      this.popUp = false;
      this.messageSent = true;
      this.message = "";
    },

    async kickMember(idMember) {
      try {
        const r = await this.teamMemberService.kickMember(idMember);
        if (r) {
          this.members = this.members.filter((m) => m.id !== idMember);
          this.popUp = false;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<template>
  <div class="team__content relative p-4 lg:p-5">
    <div
        class="team__content-banner flex justify-content-center align-items-center"
        role="heading"
    >
      <h1
          aria-label="title"
          class="font-italic team__content-title text-6xl md:text-7xl xl:text-8xl"
      >
        {{ brandName }}'s Team
      </h1>
    </div>

    <div class="container-cards">
      <div
          class="card__wrapper flex flex-wrap justify-content-between"
          v-for="m in members"
          :key="m.id"
      >
        <div
            class="card__content-user flex justify-content-center align-items-center gap-3 lg:gap-5"
        >
          <img
              :src="
              m.profileImg ||
              'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
            "
              alt="User Avatar"
              role="img"
              width="50px"
              class="border-circle"
          />
          <span class="text-lg lg:text-xl">{{ m.name }}</span>
        </div>

        <div
            class="card__content-info flex flex-wrap justify-content-start lg:justify-content-center align-items-center gap-4 lg:gap-4"
        >
          <p class="card__info-email text-lg lg:text-xl">
            {{ m.email }}
          </p>
          <UserIcon
              class="card__info-icon cursor-pointer transition-ease-in-out"
              @click="togglePopUp(m.id, 'contact')"
          />
          <MessageIcon
              class="card__info-icon cursor-pointer transition-ease-in-out"
              @click="togglePopUp(m.id, 'message')"
          />
        </div>
      </div>
    </div>

    <div class="popup absolute top-50 left-50" v-if="popUp && userSelected">
      <div
          class="popup__content bg-white shadow-1 border-round-2xl flex flex-column justify-content-center align-items-center p-6 relative"
          role="contentinfo"
      >
        <i class="" @click="togglePopUp(userSelected.id)"></i>

        <div
            class="popup__content-contentinfo"
            v-if="popUpDetail === 'contact'"
        >
          <div class="popup__content-img">
            <img
                :src="
                userSelected.profileImg ||
                'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
              "
                alt="Photo Profile User"
                role="img"
                width="210px"
            />
          </div>
          <h2 class="popup__content-title" aria-label="title">
            {{ userSelected.name }}
          </h2>

          <div
              aria-roledescription="content"
              class="popup__content-description"
          >
            <span class="popup__member-email" aria-label="email">
              {{ userSelected.email }}
            </span>
            <p
                class="popup__member-description"
                aria-label="description"
            >
              {{ userSelected.description }}
            </p>
          </div>

          <pv-button
              class="justify-content-center p-2 bg-red-500"
              @click="kickMember(userSelected.id)"
              v-if="roleUser === 'director' && userId !== userSelected.id"
          >
            KICK
          </pv-button>
        </div>

        <div
            class="popup__content-contentinfo"
            v-if="popUpDetail === 'message'"
        >
          <h2 class="popup__content-title" aria-label="title">
            {{ userSelected.name }}
          </h2>
          <p class="popup__member-email" aria-label="email">
            {{ userSelected.email }}
          </p>

          <div
              class="popup__member-description"
              aria-label="description"
          >
            <textarea
                class="border-round-2xl w-full h-40"
                placeholder="Can you leave your message here..."
                v-model="message"
            ></textarea>

            <p v-if="!messageSent" class="message-empty">
              The message should not be empty
            </p>
          </div>
          <div
              class="button bg-primary text-white border-round-2xl p-2 mt-4 cursor-pointer"
              @click="sendMessage(userSelected.id)"
          >
            Send
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: "Poppins", sans-serif;
}

.container-cards {
  flex: 1;
}

.card__wrapper {
  margin: 2rem 0 0 0;
}

.team__content-banner {
  background-color: #98cfd7;
  padding: 6.5rem 0;
  border-radius: 1rem;
}

.team__content-title {
  font-family: "Qwitcher Grypen", cursive;
  color: #fff;
  font-weight: 300;
}

.card__content-user,
.card__content-info {
  width: max-content;
  padding: 1rem;
}

.card__info-email {
  color: #74a38f;
}

.card__info-icon:hover {
  opacity: 0.8;
}

.popup {
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.popup__content {
  max-width: 50%;
}

.popup__content i {
  font-size: 2rem;
  cursor: pointer;
  top: 0;
  right: 0;
  padding: 1rem;
  transition: all 0.3s ease-in-out;
}

.popup__content i:hover {
  opacity: 0.7;
}

.popup__member-description {
  margin-top: 2rem;
}

.popup__member-description textarea {
  resize: none;
  height: 100px;
  padding: 1rem;
}

.button {
  transition: all 0.3s ease-in;
  text-transform: uppercase;
}

.button:hover {
  opacity: 0.9;
}

.popup__content-img img {
  border-radius: 10px;
  margin-bottom: 1rem;
}

.message-empty {
  font-size: 0.8rem;
  font-style: italic;
  color: red;
}

@media screen and (max-width: 730px) {
  .popup__content-img img {
    width: 150px;
  }

  .popup__content i {
    top: 0;
  }
}
</style>