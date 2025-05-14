<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 p-6 bg-zinc-900 rounded-xl shadow-lg text-white">
    <!-- Category Path Picker -->
    <div>
      <label class="block text-sm font-semibold mb-2">Category Path</label>
      <NestedCategorySelect
        :categories="categoryTree"
        @update="updateCategoryPath"
      />
    </div>

    <!-- SKU -->
    <div>
      <label for="sku" class="block text-sm font-medium mb-1">SKU</label>
      <input
        id="sku"
        v-model="form.sku"
        type="text"
        required
        class="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
      />
    </div>

    <!-- Price -->
    <div>
      <label for="price" class="block text-sm font-medium mb-1">Price</label>
      <div class="flex items-center bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden">
        <span class="px-3 text-zinc-400">$</span>
        <input
          id="price"
          v-model.number="form.price"
          type="number"
          min="0"
          step="0.01"
          required
          class="w-full bg-zinc-800 p-2 text-white focus:outline-none"
        />
      </div>
    </div>

    <!-- Image Upload -->
    <div>
      <label for="image" class="block text-sm font-medium mb-1">Product Image</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        class="w-full text-white file:bg-zinc-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:text-white file:cursor-pointer bg-zinc-800 border border-zinc-700 rounded-md p-2"
      />
    </div>

    <!-- Tags -->
    <div>
      <label class="block text-sm font-medium mb-1">Tags</label>
      <Multiselect
        v-model="form.tags"
        :options="availableTags"
        :multiple="true"
        :taggable="true"
        @tag="addTag"
        placeholder="Select or create tags"
        class="multiselect w-full bg-zinc-800 border border-zinc-700 rounded-md text-white"
      />
    </div>

    <!-- Quantity -->
    <div>
      <label for="quantity" class="block text-sm font-medium mb-1">Quantity</label>
      <input
        id="quantity"
        v-model.number="form.quantity"
        type="number"
        min="0"
        required
        class="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-white"
      />
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
    >
      Add Item
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Multiselect from 'vue-multiselect'
import NestedCategorySelect from './NestedCategorySelect.vue'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const categoryTree = ref([
  {
    name: 'Acrylic',
    children: [
      {
        name: 'Charm',
        children: [
          {
            name: 'One Piece',
            children: [
              { name: 'Straw Hat Crew', children: [] }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Sticker',
    children: [
      { name: 'Flat', children: [] }
    ]
  }
])

const availableTags = ref(['online', 'cash', 'etsy', 'restock'])

const form = reactive({
  categoryPath: [],
  sku: '',
  price: 0,
  image: null,
  tags: [],
  quantity: 0
})

const updateCategoryPath = (path) => {
  form.categoryPath = path
}

const handleImageUpload = (e) => {
  form.image = e.target.files[0]
}

const addTag = (newTag) => {
  const trimmed = newTag.trim()
  if (trimmed && !availableTags.value.includes(trimmed)) {
    availableTags.value.push(trimmed)
  }
  if (!form.tags.includes(trimmed)) {
    form.tags.push(trimmed)
  }
}

const handleSubmit = () => {
  const payload = {
    sku: form.sku,
    price: form.price,
    quantity: form.quantity,
    tags: [...form.tags],
    categoryPath: [...form.categoryPath],
    image: form.image?.name || null
  }

  console.log('Submitted:', payload)
  // axios.post('/api/inventory', payload) or prepare FormData if using image
}

</script>

<style scoped>
.multiselect {
  background-color: #27272a;
  color: #f4f4f5;
  min-height: 38px;
  padding: 0.375rem 0.5rem;
  font-size: 1rem;
}
.multiselect__input {
  background-color: transparent;
  color: inherit;
}
.multiselect__option--highlight {
  background-color: #3f3f46;
  color: #fff;
}
.multiselect__tag {
  background-color: #2563eb;
  color: white;
  border-radius: 0.25rem;
}
</style>
