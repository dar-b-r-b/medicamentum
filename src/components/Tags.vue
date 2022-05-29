<template>
  <q-card class="my-card q-my-md">
    <q-expansion-item :label="title">
      <q-card-section>
        <q-select
          v-model="model"
          multiple
          use-input
          input-debounce="0"
          hide-selected
          :options="options"
          option-label="name"
          @filter="filter"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="row">
        <div
          v-for="(tag, index) in model"
          :key="tag.id"
          class="q-mx-md q-mb-md"
        >
          <q-expansion-item
            header-class="bg-primary text-white"
            class="shadow-1 overflow-hidden"
            style="border-radius: 30px"
            switch-toggle-side
            :expand-icon-class="{
              'text-white': true,
              hidden: !withEditor,
            }"
            expand-icon-toggle
          >
            <template #header>
              <q-item-section> {{ tag.name }} </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  color="white"
                  icon="close"
                  @click="removeTag(index)"
                  size="xs"
                />
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <slot name="editor" :tag="tag" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      model: [],
      options: this.tags,
      fullOptions: this.tags,
    };
  },
  props: ["tags", "title", "withEditor"],
  mounted() {},
  methods: {
    filter(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.fullOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.fullOptions.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    removeTag(tagIndex) {
      this.model.splice(tagIndex, 1);
    },
    mapOptions(mapModel, reference) {
      reference.forEach((r) => {
        r.is_chronic ??= false;
        r.is_active ??= false;
      });

      mapModel.forEach((m) => {
        m.is_chronic ??= false;
        m.is_active ??= false;

        const tag = reference.find((x) => x.id === m.id);
        if (tag) {
          m.name = tag.name;

          Object.assign(tag, m);
          this.model.push(m);
        }
      });

      this.fullOptions = reference;
      this.options = this.fullOptions;
    },
  },
};
</script>

<style>
.q-item--active {
  background-color: #e1f5fe;
}
</style>
