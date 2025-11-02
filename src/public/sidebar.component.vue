<script>
import HomeIcon from '../assets/home-icon.svg';
import ProjectIcon from '../assets/project-icon.svg';
import AnalyticsIcon from '../assets/analytics-icon.svg';
import CalendarIcon from '../assets/calendar-icon.svg';
import TeamIcon from '../assets/team-icon.svg';
import PostIcon from '../assets/post-icon.svg'
import {mapState} from "vuex";

export default {
  name: "sidebar",
  components: {
    HomeIcon,
    ProjectIcon,
    AnalyticsIcon,
    CalendarIcon,
    TeamIcon,
    PostIcon,
  },
  data() {
    return {
      selectedCountry: {name: 'English', code: 'en', flag: 'https://m.media-amazon.com/images/S/aplus-seller-content-images-us-east-1/ATVPDKIKX0DER/A2CS421R6PZ7VX/62606ba4-5d5c-4b79-b31c-1de7719d6bf5._CR574,184,1266,1266_PT0_SX300__.jpg'},
      countries: [
        {name: 'Spanish', code: 'es', flag: 'https://ih1.redbubble.net/image.3267488605.3818/raf,360x360,075,t,fafafa:ca443f4786.jpg'},
        {name: 'English', code: 'en', flag: 'https://m.media-amazon.com/images/S/aplus-seller-content-images-us-east-1/ATVPDKIKX0DER/A2CS421R6PZ7VX/62606ba4-5d5c-4b79-b31c-1de7719d6bf5._CR574,184,1266,1266_PT0_SX300__.jpg'},
      ]
    };
  },
  props: {
    sidebarVisible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    navigateToHome() {
      this.$router.push('/home');
    },
    navigateToProjects() {
      this.$router.push('/projects');
    },
    navigateToAnalytics() {
      this.$router.push('/analytics');
    },
    navigateToCalendar() {
      this.$router.push('/calendar');
    },
    navigateToTeam() {
      this.$router.push('/team');
    },
    navigateToLogin() {
      this.$store.commit('removeUser');
      this.$store.commit('removeToken');
      this.$router.push('/login');
    },
    navigateToCreatePost() {
      this.$router.push('/new-post');
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
    }
  }
}
</script>

<template>
  <transition name="slide">
    <aside v-show="sidebarVisible">
      <div class="py-5 pl-3 h-full flex flex-column justify-content-between relative">
        <ul class="flex flex-column gap-3">
          <li class="flex flex-row gap-3 align-items-center py-3 pl-4 border-round-md"
              @click="navigateToHome"
              :class="{ active: $route.path === '/home' }">
            <HomeIcon></HomeIcon>
            <p class="font-medium text-base" v-t="'sidebar.home'">Home</p>
          </li>
          <li class="flex flex-row gap-3 align-items-center py-3 pl-4 border-round-md"
              @click="navigateToProjects"
              :class="{ active: $route.path === '/projects' }">
            <ProjectIcon></ProjectIcon>
            <p class="font-medium text-base" v-t="'sidebar.projects'">Projects</p>
          </li>
          <li class="flex flex-row gap-3 align-items-center py-3 pl-4 border-round-md"
              @click="navigateToAnalytics"
              :class="{ active: $route.path === '/analytics' }">
            <AnalyticsIcon></AnalyticsIcon>
            <p class="font-medium text-base" v-t="'sidebar.analytics'">Analytics</p>
          </li>
          <li class="flex flex-row gap-3 align-items-center py-3 pl-4 border-round-md"
              @click="navigateToCalendar"
              :class="{ active: $route.path === '/calendar' }">
            <CalendarIcon></CalendarIcon>
            <p class="font-medium text-base " v-t="'sidebar.calendar'">Calendar</p>
          </li>
          <li class="flex flex-row gap-3 align-items-center py-3 pl-4 border-round-md"
              @click="navigateToCreatePost"
              :class="{ active: $route.path === '/new-post' }"
              v-if="user && user.role && user.role.toLowerCase() === 'manager'">
            <PostIcon></PostIcon>
            <p class="font-medium text-base" v-t="'sidebar.createpost'">Create Post</p>
          </li>
          <li class="flex flex-row gap-3 align-items-center py-3 pl-4 border-round-md"
              @click="navigateToTeam"
              :class="{ active: $route.path === '/team' }"
              v-else>
            <TeamIcon></TeamIcon>
            <p class="font-medium text-base">Team</p>
          </li>
        </ul>
        <div class="pr-5">
          <div class="relative flex flex-row border-top-1 border-gray-500 gap-3 align-items-center pt-5 pl-3">
            <div @click="navigateToLogin()" class="inline-flex cursor-pointer align-items-center" style="gap: 11.5px">
              <i class="pi pi-sign-out text-gray-700" style="font-size: 1.5rem;"></i>
              <p class="font-medium text-gray-700" style="margin-bottom: 2px" v-t="'sidebar.logout'">Log out</p>
            </div>
            <div class="card flex right-0 justify-center absolute">
              <pv-dropdown v-model="selectedCountry" :options="countries" optionLabel="name" placeholder="Language"
                           class="w-full md:w-56 py-0" style="padding-left: 10px"
                            @change="changeLanguage(selectedCountry.code)">
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center py-2 gap-2">
                    <img :alt="slotProps.value.label"
                         :src="slotProps.value.flag"
                         :class="`dropdown-image border-1 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px"/>
                    <div>{{ slotProps.value.name }}</div>
                  </div>
                  <span v-else> {{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center py-2 gap-2 pl-2">
                    <img :alt="slotProps.option.label"
                         :src="slotProps.option.flag"
                         :class="`flag flag-${slotProps.option.code.toLowerCase()} dropdown-item-image`"
                         style="width: 18px"/>
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
              </pv-dropdown>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>

.dropdown-image {
  height: 19px;
  width: 20px !important;
  margin-top: 3px
}

.dropdown-item-image {
  margin-top: 3px;
  height: 18px;
}

aside {
  border-right: 2px solid #BABABA;
}

.inline-flex:hover i,
.inline-flex:hover p {
  color: red !important;
  transition: all 0.3s;
  transition-timing-function: ease;
}

li > p {
  letter-spacing: .5px;
  color: #02513D;
}

li {
  cursor: pointer;
}

.active {
  background-color: #E6EEEC;
}

li:not(.active):hover {
  transition: all 0.2s ease;
  background-color: #ececec;
}

aside {
  position: fixed;
  margin-top: 0px;
  bottom: 0;
  top: 0;
  width: 300px;
  z-index: 99;
  background-color: #f8f8f8;
}

/*esta clases son de la etiqueta "transition"*/

.slide-enter {
  transform: translateX(-120%);
}

.slide-enter-active {
  transform: translateX(0);
  transition: transform 0.4s ease-out;
}

.slide-leave {
  transform: translateX(0);
}

.slide-leave-active {
  transform: translateX(-120%);
  transition: transform 0.4s ease-out;
}


@media (min-width: 1024px) {
  aside {
    position: relative;
    margin-top: 0;
    height: 100%;
    width: 350px;
  }
}


</style>