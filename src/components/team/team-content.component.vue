<script>
import UserIcon from "@/assets/user-icon.svg";
import MessageIcon from "@/assets/message-icon.svg";
import TeamMembersService from "@/services/team-members.service.js";
import Toast from 'primevue/toast';

export default {
  name: "team-content",
  components: {
    UserIcon,
    MessageIcon,
    Toast
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
      teamMemberService: new TeamMembersService(),
      showKickConfirm: false,

      selectedMemberIds: [],
      isSelectionMode: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user || {};
    },
    currentUserId() {
      return this.user.id;
    },
    isManager() {
      const role = String(this.user.role || '').toLowerCase().trim();
      return role === '0' || role === 'manager' || role === 'director';
    },
    selectedCount() {
      return this.selectedMemberIds.length;
    }
  },
  async mounted() {
    await this.getTeamMembers();
  },
  methods: {
    async getTeamMembers() {
      try {
        const companyId = this.user.companyId;
        if (!companyId) return;

        const members = await this.teamMemberService.getMembers(companyId);

        const membersList = Array.isArray(members) ? members : (members?.data || []);

        if (Array.isArray(membersList)) {
          this.members = membersList.filter(
              (m) => m.companyId === companyId
          );

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
      }
    },

    // --- GESTIÓN DE MODOS DE SELECCIÓN ---
    startSelectionMode() {
      this.isSelectionMode = true;
      this.selectedMemberIds = [];
      this.$toast.add({ severity: 'info', summary: 'Meeting Mode', detail: 'Select members to meet with', life: 3000 });
    },

    cancelSelectionMode() {
      this.isSelectionMode = false;
      this.selectedMemberIds = [];
    },

    toggleSelection(memberId) {
      if (!this.isSelectionMode || memberId === this.currentUserId) return;

      if (this.selectedMemberIds.includes(memberId)) {
        this.selectedMemberIds = this.selectedMemberIds.filter(id => id !== memberId);
      } else {
        this.selectedMemberIds.push(memberId);
      }
    },
    // -------------------------------------

    togglePopUp(id, popUpDetail) {
      if (this.isSelectionMode) {
        this.toggleSelection(id);
        return;
      }

      this.popUpDetail = popUpDetail;
      this.popUp = !this.popUp;
      this.showKickConfirm = false;
      if (this.popUp) {
        this.userSelected = this.members.find((m) => m.id === id) || null;
      } else {
        this.userSelected = null;
      }
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
        userIdSender: this.currentUserId
      };

      const result = await this.teamMemberService.newMessage(body);
      if (!result) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to send message', life: 3000 });
      } else {
        this.$toast.add({ severity: 'success', summary: 'Sent', detail: 'Message sent successfully', life: 3000 });
      }

      this.popUp = false;
      this.messageSent = true;
      this.message = "";
    },

    initiateKick() {
      this.showKickConfirm = true;
    },

    async confirmKick() {
      if (!this.userSelected) return;
      const idMember = this.userSelected.id;

      try {
        await this.teamMemberService.kickMember(idMember);

        this.members = this.members.filter((m) => m.id !== idMember);

        this.selectedMemberIds = this.selectedMemberIds.filter(id => id !== idMember);

        this.showKickConfirm = false;
        this.popUp = false;
        this.userSelected = null;

        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Member removed successfully', life: 3000 });
      } catch (e) {
        console.error(e);
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Could not remove member', life: 3000 });
      }
    },

    openTeamsMeeting() {
      if (!this.userSelected || !this.userSelected.email) {
        this.$toast.add({ severity: 'warn', summary: 'No Email', detail: 'This user does not have an email address.', life: 3000 });
        return;
      }
      const subject = encodeURIComponent(`Meeting: ${this.brandName} - ${this.userSelected.name}`);
      const attendees = this.userSelected.email;
      const teamsUrl = `https://teams.microsoft.com/l/meeting/new?subject=${subject}&attendees=${attendees}`;
      window.open(teamsUrl, '_blank');
    },

    openGroupTeamsMeeting() {
      const selectedUsers = this.members.filter(m => this.selectedMemberIds.includes(m.id));

      const emails = selectedUsers
          .map(u => u.email)
          .filter(email => email && email.trim() !== "");

      if (emails.length === 0) {
        this.$toast.add({ severity: 'warn', summary: 'No Emails', detail: 'Selected users do not have valid emails.', life: 3000 });
        return;
      }

      const attendees = emails.join(',');
      const subject = encodeURIComponent(`Group Meeting: ${this.brandName}`);
      const teamsUrl = `https://teams.microsoft.com/l/meeting/new?subject=${subject}&attendees=${attendees}`;

      window.open(teamsUrl, '_blank');

      this.cancelSelectionMode();
    },
  }
};
</script>

<template>
  <div class="team__content relative p-4 lg:p-5">
    <Toast />

    <div
        class="team__content-banner flex justify-content-center align-items-center flex-column gap-3"
        role="heading"
    >
      <h1
          aria-label="title"
          class="font-italic team__content-title text-6xl md:text-7xl xl:text-8xl m-0"
      >
        {{ brandName }}'s Team
      </h1>

      <!-- BOTÓN PARA ACTIVAR MODO REUNIÓN -->
      <div class="action-toolbar mt-2">
        <transition name="fade" mode="out-in">
          <pv-button
              v-if="!isSelectionMode"
              class="plan-meeting-btn"
              @click="startSelectionMode"
          >
            <i class="pi pi-calendar-plus mr-2"></i>
            Plan Group Meeting
          </pv-button>

          <pv-button
              v-else
              class="cancel-meeting-btn"
              @click="cancelSelectionMode"
          >
            <i class="pi pi-times mr-2"></i>
            Cancel Selection
          </pv-button>
        </transition>
      </div>
    </div>

    <div class="container-cards">
      <div
          class="card__wrapper flex flex-wrap justify-content-between relative"
          v-for="m in members"
          :key="m.id"
          :class="{ 'selected-card': selectedMemberIds.includes(m.id), 'selection-enabled': isSelectionMode && m.id !== currentUserId }"
      >
        <div
            v-if="isSelectionMode && m.id !== currentUserId"
            class="absolute top-0 left-0 mt-3 ml-3 z-2"
        >
          <div class="field-checkbox">
            <input
                type="checkbox"
                :id="'chk-' + m.id"
                :value="m.id"
                v-model="selectedMemberIds"
                class="custom-checkbox"
            >
          </div>
        </div>

        <div
            class="card__content-user flex justify-content-center align-items-center gap-3 lg:gap-5"
            :class="{ 'cursor-pointer': isSelectionMode && m.id !== currentUserId }"
            @click="toggleSelection(m.id)"
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
          <div class="flex flex-column">
            <span class="text-lg lg:text-xl">{{ m.name }}</span>
            <span v-if="m.id === currentUserId" class="text-xs text-gray-500 font-italic">(You)</span>
          </div>
        </div>

        <div
            class="card__content-info flex flex-wrap justify-content-start lg:justify-content-center align-items-center gap-4 lg:gap-4"
        >
          <p class="card__info-email text-lg lg:text-xl">
            {{ m.email }}
          </p>

          <UserIcon
              class="card__info-icon cursor-pointer transition-ease-in-out z-2"
              @click.stop="togglePopUp(m.id, 'contact')"
          />
          <MessageIcon
              class="card__info-icon cursor-pointer transition-ease-in-out z-2"
              @click.stop="togglePopUp(m.id, 'message')"
          />
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="isSelectionMode && selectedCount > 0" class="floating-action-bar">
        <span class="selection-text">{{ selectedCount }} selected</span>
        <button class="group-meet-btn" @click="openGroupTeamsMeeting">
          <i class="pi pi-video mr-2"></i>
          Meet with Selected
        </button>
      </div>
    </transition>

    <div class="popup" v-if="popUp && userSelected">
      <div
          class="popup__content bg-white shadow-1 border-round-2xl flex flex-column justify-content-center align-items-center p-6 relative"
          role="contentinfo"
      >
        <i class="pi pi-times absolute cursor-pointer text-xl" style="top: 1rem; right: 1rem;" @click="togglePopUp(userSelected.id)"></i>

        <div class="popup__content-contentinfo w-full" v-if="popUpDetail === 'contact'">
          <div class="popup__content-img">
            <img :src="userSelected.profileImg || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'" alt="Photo Profile User" role="img" width="210px"/>
          </div>
          <h2 class="popup__content-title" aria-label="title">{{ userSelected.name }}</h2>
          <div aria-roledescription="content" class="popup__content-description">
            <span class="popup__member-email" aria-label="email">{{ userSelected.email }}</span>
            <p class="popup__member-description" aria-label="description">{{ userSelected.description }}</p>
          </div>

          <div class="mt-3 w-full">
            <pv-button
                class="teams-btn justify-content-center p-2 border-none w-full text-white font-bold transition-colors transition-duration-200 mb-2"
                @click="openTeamsMeeting"
            >
              <i class="pi pi-video mr-2" style="font-size: 1.1rem;"></i>
              Schedule Individual Meeting
            </pv-button>
          </div>

          <div v-if="isManager && currentUserId !== userSelected.id" class="w-full">
            <pv-button
                v-if="!showKickConfirm"
                class="justify-content-center p-2 bg-red-500 hover:bg-red-600 border-none w-full text-white font-bold transition-colors transition-duration-200"
                @click="initiateKick"
            >
              KICK MEMBER
            </pv-button>

            <div v-else class="flex flex-column align-items-center gap-2 fade-in-animation">
              <p class="text-red-600 font-semibold m-0 text-sm">Are you sure?</p>
              <div class="flex gap-2 w-full">
                <pv-button class="flex-1 justify-content-center p-2 bg-gray-400 hover:bg-gray-500 border-none text-white font-bold transition-colors" @click="showKickConfirm = false">CANCEL</pv-button>
                <pv-button class="flex-1 justify-content-center p-2 bg-red-700 hover:bg-red-800 border-none text-white font-bold transition-colors" @click="confirmKick">YES, REMOVE</pv-button>
              </div>
            </div>
          </div>
        </div>

        <div class="popup__content-contentinfo" v-if="popUpDetail === 'message'">
          <h2 class="popup__content-title" aria-label="title">{{ userSelected.name }}</h2>
          <p class="popup__member-email" aria-label="email">{{ userSelected.email }}</p>
          <div class="popup__member-description" aria-label="description">
            <textarea class="border-round-2xl w-full h-40" placeholder="Can you leave your message here..." v-model="message"></textarea>
            <p v-if="!messageSent" class="message-empty">The message should not be empty</p>
          </div>
          <div class="button bg-primary text-white border-round-2xl p-2 mt-4 cursor-pointer" @click="sendMessage(userSelected.id)">Send</div>
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
  padding-bottom: 80px;
}

.card__wrapper {
  margin: 1.5rem 0 0 0;
  position: relative;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  border-radius: 12px;
}

.card__wrapper.selected-card {
  background-color: rgba(250, 130, 36, 0.1);
  border-color: #FA8224;
}

.card__wrapper.selection-enabled:hover {
  background-color: rgba(250, 130, 36, 0.03);
  cursor: pointer;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  accent-color: #FA8224;
  cursor: pointer;
}

.team__content-banner {
  background-color: #98cfd7;
  padding: 4rem 0;
  border-radius: 1rem;
}

.team__content-title {
  font-family: "Qwitcher Grypen", cursive;
  color: #fff;
  font-weight: 300;
}

/* Botones de Modo */
.plan-meeting-btn {
  background-color: #FA8224;
  border: none;
  padding: 0.6rem 1.5rem;
  color: white;
  font-weight: 600;
  border-radius: 25px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s, background-color 0.2s;
}
.plan-meeting-btn:hover {
  background-color: #e0721b;
  transform: translateY(-2px);
}

.cancel-meeting-btn {
  background-color: #e74c3c;
  border: none;
  padding: 0.6rem 1.5rem;
  color: white;
  font-weight: 600;
  border-radius: 25px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
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
  transform: scale(1.1);
}

/* Floating Action Bar */
.floating-action-bar {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 900;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.selection-text {
  font-weight: 600;
  color: #555;
}

.group-meet-btn {
  background-color: #464775;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.group-meet-btn:hover {
  background-color: #6264a7;
}

/* Popup Styles */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1000;
  transform: none;
}

.popup__content {
  max-width: 90%;
  width: 400px;
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

.fade-in-animation {
  animation: fadeIn 0.3s ease-in-out;
}

.teams-btn {
  background-color: #464775;
  color: white;
}
.teams-btn:hover {
  background-color: #6264a7;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@media screen and (max-width: 730px) {
  .popup__content-img img {
    width: 150px;
  }
  .floating-action-bar {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    justify-content: space-between;
  }
}
</style>