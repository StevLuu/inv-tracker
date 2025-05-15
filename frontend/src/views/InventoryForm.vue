<template>
  <b-container class="py-5">
    <b-card class="p-4 shadow-sm">
      <b-form @submit.prevent="handleSubmit">
        <!-- Category Path Picker -->
        <b-form-group label="Category Path">
          <NestedCategorySelect :categories="categoryTree" @update="updateCategoryPath" />
        </b-form-group>

        <!-- Product Name -->
        <b-form-group label="Product Name" label-for="productName">
          <b-form-input
            id="productName"
            v-model="form.productName"
            type="text"
            required
          />
        </b-form-group>

        <!-- SKU -->
        <b-form-group label="SKU" label-for="sku">
          <b-form-input id="sku" v-model="form.sku" type="text" required />
        </b-form-group>

        <!-- Selling Price -->
        <b-form-group label="Selling Price" label-for="sellingPrice">
          <b-input-group prepend="$">
            <b-form-input
              id="sellingPrice"
              v-model.number="form.sellingPrice"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </b-input-group>
        </b-form-group>

        <!-- Manufacture Price -->
        <b-form-group label="Manufacture Price" label-for="manuPrice">
          <b-input-group prepend="$">
            <b-form-input
              id="manuPrice"
              v-model.number="form.manufacturePrice"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </b-input-group>
          <b-form-checkbox v-model="form.isManuPricePerUnit" class="mt-2">
            This is the price per unit (uncheck if total for all
            {{ form.quantity || 1 }} units)
          </b-form-checkbox>
          <b-form-text class="mt-1">
            Total Manufacture Cost: <strong>${{ totalManuCost.toFixed(2) }}</strong>
          </b-form-text>
        </b-form-group>

        <b-form-group label="Upload Product Image File">
          <b-button @click="triggerFileInput" variant="outline-primary" size="sm">
            📁 Choose File
          </b-button>

          <input
            ref="fileInput"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            @change="handleImageUpload"
            class="d-none"
          />

          <!-- File name & delete -->
          <div v-if="form.imageFileName" class="mt-2 d-flex align-items-center gap-2">
            <span class="text-truncate">{{ form.imageFileName }}</span>
            <b-button @click="removeImage" size="sm" variant="outline-danger"
              >❌</b-button
            >
          </div>

          <!-- Thumbnail preview -->
          <div v-if="form.image" class="mt-3">
            <b-img
              :src="form.image"
              alt="Preview"
              thumbnail
              fluid
              class="rounded border"
              style="max-width: 150px"
            />
          </div>

          <!-- Error message -->
          <b-form-text v-if="imageTooLarge" class="text-danger">
            Image exceeds 5MB limit.
          </b-form-text>
        </b-form-group>

        <!-- Tags -->
        <b-form-group label="Tags (add additional tags for search)">
          <Multiselect
            class="multiselect"
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
        <b-button type="submit" variant="primary" block> Add Item </b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
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

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const removeImage = () => {
  form.image = null;
  form.imageFileName = null;
  imageTooLarge.value = false;
};

const form = reactive({
  categoryPath: [],
  productName: "",
  sku: "",
  sellingPrice: 0,
  manufacturePrice: 0,
  isManuPricePerUnit: true,
  quantity: 0,
  imageLink: "",
  image: null,
  tags: [],
});

const updateCategoryPath = (path) => {
  form.categoryPath.splice(0, form.categoryPath.length, ...path);
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

const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, "-");

const totalManuCost = computed(() => {
  return form.isManuPricePerUnit
    ? form.manufacturePrice * form.quantity
    : form.manufacturePrice;
});

const imageTooLarge = ref(false);

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  imageTooLarge.value = file && file.size > 5 * 1024 * 1024;

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  const isValidType = file && allowedTypes.includes(file.type);

  if (imageTooLarge.value || !isValidType) {
    form.image = null;
    form.imageFileName = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    form.image = reader.result; // base64 string
    form.imageFileName = file.name; // save name
  };
  reader.readAsDataURL(file);
};

const handleSubmit = () => {
  const categoryTags = form.categoryPath.map(normalize);
  const userTags = form.tags.map(normalize);
  const allTags = [
    ...new Set([...userTags, ...categoryTags, normalize(form.productName)]),
  ];

  // ✅ Confirm if image is a base64 string
  if (typeof form.image === "string" && form.image.startsWith("data:image/")) {
    console.log("✅ Image uploaded and encoded as Base64");
  } else {
    console.warn("❌ No valid image uploaded or encoding failed");
  }

  const payload = {
    name: normalize(form.productName),
    sku: form.sku,
    sellingPrice: parseFloat(form.sellingPrice.toFixed(2)),
    quantity: form.quantity,
    manufacturePrice: parseFloat(form.manufacturePrice.toFixed(2)),
    isManuPricePerUnit: form.isManuPricePerUnit,
    totalManufactureCost: parseFloat(totalManuCost.value.toFixed(2)),
    tags: allTags,
    categoryPath: [...form.categoryPath],
    imageLink: form.imageLink || null,
    imageBase64: typeof form.image === "string" ? form.image : null,
    imageFileName: form.imageFileName || null,
    createdAt: new Date().toISOString(),
  };

  console.log("📦 Submitted payload:", payload);
};
</script>
<!-- 
<style>
/* DARK THEME */
[data-bs-theme="dark"] .multiselect {
  background-color: #212529;
  color: #f8f9fa;
  border: 1px solid #495057;
  border-radius: 0.375rem;
  min-height: 38px;
  padding: 0.375rem 0.5rem;
}

[data-bs-theme="dark"] .multiselect__input {
  background-color: transparent;
  color: inherit;
}

[data-bs-theme="dark"] .multiselect__tag {
  background-color: #0d6efd;
  color: white;
  border-radius: 0.25rem;
}

[data-bs-theme="dark"] .multiselect__option--highlight {
  background-color: #343a40;
  color: white;
}
</style>
-->