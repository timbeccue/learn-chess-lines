
<template>
  <div>
    <b-field label="Data: ">
      <b-radio-button v-model="whatDataToDisplay" native-value="examples">
        examples
      </b-radio-button>
      <b-radio-button v-model="whatDataToDisplay" native-value="user">
        my data
      </b-radio-button>
      <b-radio-button v-model="whatDataToDisplay" native-value="both">
        both
      </b-radio-button>
    </b-field>
    <b-table
      :data="tableData"
      :mobile-cards="false"
      :checked-rows.sync="selectedRows"
      checkable
      detailed
      detail-key="name"
      :show-detail-icon="false"
      :centered="false"
    >
      <b-table-column field="name" label="Name" v-slot="props">
        <a @click="props.toggleDetails(props.row)">
          {{ props.row.name }}
        </a>
      </b-table-column>
      <template slot="detail" slot-scope="props">
        <article class="media">
          <p class="media-left">moves</p>
          <div class="media-content">
            <div class="content">
              <p>{{ props.row.sequence }}</p>
            </div>
          </div>
        </article>
      </template>
      <template slot="footer">
        <div class="has-text-right">
          <b-button @click="deleteSelectedOpenings" class="is-danger"
            >Delete Selected</b-button
          >
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "OpeningTable",
  data() {
    return {
      selectedRows: [],
      whatDataToDisplay: "examples",
    };
  },
  methods: {
    clickHandler(opening) {
      console.log("you clicked ", opening);
    },
    deleteSelectedOpenings() {
      console.log(this.selectedRows);
      this.selectedRows.forEach((o) =>
        this.$store.dispatch("openings/removeOpening", o)
      );
    },
  },
  mounted() {
    this.$store.dispatch("openings/getUserOpenings");
  },
  computed: {
    ...mapGetters("openings", ["openingNames", "openingFromName"]),
    ...mapState("openings", ["openings", "userOpenings"]),

    tableData() {
      let toDisplay = [];
      if (this.whatDataToDisplay == "examples") {
        return this.openings;
      }
      if (this.whatDataToDisplay == "user") {
        return this.userOpenings;
      }
      if (this.whatDataToDisplay == "both") {
        return [...this.openings, ...this.userOpenings];
      }
    },
  },
};
</script>