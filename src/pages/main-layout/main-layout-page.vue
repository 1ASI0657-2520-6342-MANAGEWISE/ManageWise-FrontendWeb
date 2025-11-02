<script>
import Home from "@/pages/home.component.vue";
import Toolbar from "@/public/toolbar.component.vue";
import Sidebar from "@/public/sidebar.component.vue";

export default {
  name: "main-layout-page",
  components: { Home, Toolbar, Sidebar },
  data() {
    return {
      sidebarVisible: true,
    }
  },
  methods: {

    toggleNav() {
      console.log(this.sidebarVisible);
      this.sidebarVisible = !this.sidebarVisible;
    },

    updateSidebarVisible() {
      this.sidebarVisible = window.innerWidth > 1023;
    }
  },
  mounted() {
    this.updateSidebarVisible();
    window.addEventListener('resize', this.updateSidebarVisible);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateSidebarVisible);
  }
}
</script>

<template>
  <div class="app-container">
    <toolbar :toggleNav="toggleNav" class="toolbar w-full"></toolbar>
    <div class="content-wrapper">
      <div class="sidebar-container">
        <sidebar :sidebarVisible="sidebarVisible" class="sidebar"></sidebar>
      </div>
      <main class="main-container">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>

/*para testing no borrar, estos estilos son gloables*/
.border {
  border: 1px solid blue;
}

.app-container {

  .content-wrapper {
    display: flex;

    .sidebar-container {
      .sidebar {
        position: fixed;
        height: calc(100vh - 112px);
        top: 112px;
        z-index: 9;
      }
      @media (min-width: 1024px) {
        width: 349px;
        margin-top: 0;
      }
    }

    .main-container {
      width: calc(100% - 349px);
      height: 100%;
      min-height: calc(100vh - 112px);
      position: relative;
    }
    @media(max-width: 1024px) {
      .main-container {
        width: 100%;
      }
    }
  }
}

/*para el style del scroll owo*/

::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar
{
  width: 12px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #BABABA;
}

</style>