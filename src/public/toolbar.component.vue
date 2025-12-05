<script>
import TeamMembersService from "@/services/team-members.service.js";

export default {
  name: "toolbar",
  data() {
    return {
      members: 0,
      teamMemberService: new TeamMembersService()
    }
  },
  props: {
    toggleNav: {
      type: Function,
      required: true
    }
  },
  computed: {
    user() {
      return this.$store.state.user || {};
    },
    // CORRECCIÓN 1: Transformar el '0' en un texto legible
    roleLabel() {
      const role = this.user.role;
      if (role === 0 || role === '0') return 'Manager';
      return role || '';
    }
  },
  methods: {
    handleToggle() {
      this.toggleNav();
    },
    navigateToProfile() {
      if (this.user && this.user.id) {
        this.$router.push(`/profile/${this.user.id}`);
      }
    },
    // Método separado para buscar miembros
    async fetchMembers(companyId) {
      if (!companyId) {
        this.members = 0;
        return;
      }
      try {
        const response = await this.teamMemberService.getMembers(companyId);
        if (response && response.data) {
          this.members = response.data.length;
        } else {
          this.members = 0;
        }
      } catch (error) {
        console.error("Error obteniendo miembros:", error);
        this.members = 0;
      }
    }
  },
  // CORRECCIÓN 2: Usar watch para esperar a que el companyId cargue en el store
  watch: {
    'user.companyId': {
      immediate: true,
      handler(newId) {
        this.fetchMembers(newId);
      }
    }
  }
}
</script>

<template>
  <pv-toolbar class="header h-7rem px-4 w-full">
    <template #start>
      <div class=" flex flex-row align-items-center gap-4">
        <i class="pi pi-bars" @click="handleToggle" style="color: slateblue; font-size: 1.5rem; cursor: pointer"></i>
        <div class="flex flex-row align-items-center gap-3">
          <img class="block h-2rem w-3rem" src="../assets/ManageWise_logo.png" alt="ManageWise"/>
          <div class="title-container flex flex-column justify-content-center line-height-2" style="gap: 2px">
            <p class="title font-semibold " style="letter-spacing: 1px;">ManageWise</p>
            <!-- Usamos roleLabel en vez de user.role -->
            <span class="text-sm capitalize" style="letter-spacing: .8px;">{{ roleLabel }}</span>
          </div>
        </div>
      </div>
    </template>
    <template #end>
      <div class="flex flex-row gap-3">
        <pv-avatar aria-label="yesifoto"
                   class="w-3rem h-3rem align-self-center user-img"
                   :image="user.profileImg  || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'"
                   shape="circle"
                   @click="navigateToProfile"
                   :class="{ active: $route.path === '/profile' }"/>
        <div class="flex flex-column justify-content-center gap-1">
          <p class="font-medium user-name"
             @click="navigateToProfile"
             :class="{ active: $route.path === '/profile' }">
            {{ user.name }}</p>
          <div class="flex flex-row align-items-center gap-3">
            <p class="text-sm text-green-600 font-normal">{{ user?.companyName }}</p>
            <div class="members-quantity">
              <i class="pi pi-user mr-2" style="font-size: .8rem; color: #FA8224"></i><span class="text-sm">{{members}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </pv-toolbar>
</template>

<style scoped>

.header {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.title-container {
  margin-top: 2px;
}

.title {
  letter-spacing: 1px;
  font-size: 1rem;
}

.pi-bars {
  display: none;
}

.members-quantity span {
  color: #FA8224;
}
.user-img, .user-name {
  cursor: pointer;
}
@media (max-width: 1024px) {

  .pi-bars {
    display: block;
  }
}

</style>