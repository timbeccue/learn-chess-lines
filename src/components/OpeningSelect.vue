<template>
  <div>
    <b-field>
      <b-select v-model="selectedName">
        <option v-for="opening in openingNames" :value="opening" :key="opening">
          {{ opening }}
        </option>
      </b-select>
      <p class="control">
        <button class="button" @click="selectOpening">Start Training</button>
      </p>
    </b-field>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OpeningSelect",
  data() {
    return {
      selectedName: "",
    };
  },
  mounted() {
    this.selectedName = this.openingNames[0];
  },
  methods: {
    selectOpening() {
      let selection = this.openingFromName(this.selectedName);
      this.$emit("openingSelected", selection);
    },
  },
  computed: {
    ...mapGetters("openings", ["openingNames", "openingFromName"]),
  },
};
</script>