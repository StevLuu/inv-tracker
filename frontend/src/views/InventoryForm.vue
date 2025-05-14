<template>
  <b-container class="py-5">
    <b-card class="p-4 shadow-sm">
      <b-form @submit.prevent="handleSubmit">

        <!-- Category Path Picker -->
        <b-form-group label="Category Path">
          <NestedCategorySelect
            :categories="categoryTree"
            @update="updateCategoryPath"
          />
        </b-form-group>

        <!-- SKU -->
        <b-form-group label="SKU" label-for="sku">
          <b-form-input
            id="sku"
            v-model="form.sku"
            type="text"
            required
          />
        </b-form-group>

        <!-- Price -->
        <b-form-group label="Price" label-for="price">
          <b-input-group prepend="$">
            <b-form-input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </b-input-group>
        </b-form-group>

        <!-- Image Upload -->
        <b-form-group label="Product Image" label-for="image">
          <b-form-file
            id="image"
            accept="image/*"
            @change="handleImageUpload"
          />
        </b-form-group>

        <!-- Tags -->
        <b-form-group label="Tags">
          <Multiselect
            v-model="form.tags"
            :options="availableTags"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
            placeholder="Select or create tags"
          />
        </b-form-group>

        <!-- Quantity -->
        <b-form-group label="Quantity" label-for="quantity">
          <b-form-input
            id="quantity"
            v-model.number="form.quantity"
            type="number"
            min="0"
            required
          />
        </b-form-group>

        <!-- Submit -->
        <b-button type="submit" variant="primary" block>
          Add Item
        </b-button>

      </b-form>
    </b-card>
  </b-container>
</template>


<script setup>
import { ref, reactive } from "vue";
import Multiselect from "vue-multiselect";
import NestedCategorySelect from "../components/NestedCategorySelect.vue";
import "vue-multiselect/dist/vue-multiselect.min.css";

const categoryTree = ref([
  {
    name: "Acrylic",
    children: [
      {
        name: "Charm",
        children: [
          {
            name: "One Piece",
            children: [{ name: "Straw Hat Crew", children: [] }],
          },
        ],
      },
    ],
  },
  {
    name: "Sticker",
    children: [{ name: "Flat", children: [] }],
  },
]);

const availableTags = ref(["online", "cash", "etsy", "restock"]);

const form = reactive({
  categoryPath: [],
  sku: "",
  price: 0,
  image: null,
  tags: [],
  quantity: 0,
});

const updateCategoryPath = (path) => {
  //console.log("⬇️ Received in parent:", path);
  form.categoryPath.splice(0, form.categoryPath.length, ...path);
};

const handleImageUpload = (e) => {
  form.image = e.target.files[0];
};

const addTag = (newTag) => {
  const trimmed = newTag.trim();
  if (trimmed && !availableTags.value.includes(trimmed)) {
    availableTags.value.push(trimmed);
  }
  if (!form.tags.includes(trimmed)) {
    form.tags.push(trimmed);
  }
};

const normalizeTag = (str) => str.trim().toLowerCase().replace(/\s+/g, "-");

const handleSubmit = () => {
  const categoryTags = form.categoryPath.map(normalizeTag);
  const userTags = form.tags.map(normalizeTag);
  const allTags = [...new Set([...userTags, ...categoryTags])];

  const payload = {
    sku: form.sku,
    price: form.price,
    quantity: form.quantity,
    tags: allTags,
    categoryPath: [...form.categoryPath],
    image: form.image?.name || null,
  };

  console.log("Submitted immediately:", payload);
};
</script>

