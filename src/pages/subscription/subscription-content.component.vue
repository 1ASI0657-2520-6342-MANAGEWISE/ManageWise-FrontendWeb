<script>
import CheckIcon from '../../assets/check-icon.svg';

export default {
  name: "subscription-content",
  components: {
    CheckIcon
  },
  mounted() {
    const tempData = localStorage.getItem('temp_register_data');
    if (!tempData) {
      this.$router.push('/signup');
    }
  },
  methods: {
    navigateToPayment() {
      const planDetails = {
        name: 'Annual Plan',
        price: 300.00,
        currency: 'PEN',
        period: 'year'
      };
      localStorage.setItem('selected_plan', JSON.stringify(planDetails));

      this.$router.push('/payment');
    }
  }
}
</script>

<template>
  <div class="subscription-container min-h-screen h-full flex flex-column align-items-center gap-5">
    <div class="subscription-box flex flex-column gap-6 py-5">
      <div class="logo-container flex">
        <img src="../../assets/ManageWise_logo.png" alt="logo" style="width: 100px; height: auto;" />
        <span class="font-bold text-4xl">ManageWise</span>
      </div>
      <div class="card flex">

        <div class="card-header">
          <span class="title font-bold text-3xl" style="color: #FA8224;">S/.300.00</span>
          <p class="subtitle">/year for you & your team</p>
        </div>

        <div class="card-body flex">
          <ul class="subscription-list">
            <li class="flex flex-row gap-2">
              <CheckIcon class="check-icon pb-1"></CheckIcon>
              Gain access to comprehensive analytics and data-driven insights to optimize fundraising strategies and
              maximize impact.
            </li>
            <li class="flex flex-row gap-2">
              <CheckIcon class="check-icon pb-1"></CheckIcon>
              Simplify the management of social assistance activities with intuitive tools for event planning, donor
              management, and volunteer coordination.
            </li>
            <li class="flex flex-row gap-2">
              <CheckIcon class="check-icon pb-1"></CheckIcon>
              Monitor progress, track key performance indicators, and generate customizable reports to demonstrate impact
              and inform decision-making in real-time.
            </li>
            <li class="flex flex-row gap-2">
              <CheckIcon class="check-icon pb-1"></CheckIcon>
              Elevate donor engagement and retention with personalized communication, targeted outreach, and peer-to-peer
              fundraising capabilities.
            </li>
          </ul>
        </div>
      </div>
      <button @click="navigateToPayment()" class="card-footer button p-3" style="color: #fff">Join us</button>
    </div>
  </div>
</template>

<style scoped>
.subscription-container {
  background-color: #F9F5EF;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.subscription-box {
  max-width: 675px;
  width: 90%;
}

.logo-container {
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.card {
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  height: auto;
  text-align: left;
  justify-content: center;
  padding: 40px 80px;
  flex-direction: column;
}


.title {
  margin-bottom: 40px;
}

.card-body {
  margin-top: 30px;
}

li {
  margin-bottom: 20px;
}

.button {
  width: 30%;
  align-self: center;
  background-color: #FA8224;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}

.button:hover {
  background-color: #d16716ff;
}

.subscription-list {
  list-style-type: none;
}

@media screen and (max-width: 500px) {
  .logo-container {
    flex-direction: column;
    text-align: center;
  }
}

@media screen and (max-width: 560px) {
  .button {
    width: 80%;
  }

  .card {
    padding: 40px 30px;
  }
}

</style>